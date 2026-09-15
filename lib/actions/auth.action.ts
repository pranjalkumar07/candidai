"use server";

import { cache } from "react";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    const firebaseError = error as { code?: string; message?: string };
    // Handle Firebase specific errors
    if (firebaseError?.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { idToken } = params;

  try {
    await setSessionCookie(idToken);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error signing in with session cookie:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to log into account. Please try again.";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie with per-request memoization and fast local JWT validation
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    // Validate the session cookie cryptographically using local in-memory keys (checkRevoked: false).
    // This removes 500-1500ms network roundtrip to Google servers on every render.
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

    // Fetch user profile from Firestore
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return {
        id: decodedClaims.uid,
        name: decodedClaims.name || decodedClaims.email?.split("@")[0] || "Candidate",
        email: decodedClaims.email || "",
      } as User;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying user session:", error);
    return null;
  }
});

// Check if user is authenticated (memoized per-request)
export const isAuthenticated = cache(async () => {
  const user = await getCurrentUser();
  return !!user;
});

