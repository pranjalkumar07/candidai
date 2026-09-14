"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(2, "Name must be at least 2 characters") : z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isSignIn = type === "sign-in";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
        });

        if (!result?.success) {
          toast.error(result?.message || "Failed to create account profile.");
          if (
            result?.message?.toLowerCase().includes("already exists") ||
            result?.message?.toLowerCase().includes("already in use")
          ) {
            form.setError("email", {
              type: "manual",
              message: "User already exists. Please sign in.",
            });
          }
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed. Could not retrieve token.");
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        if (!result?.success) {
          toast.error(
            result?.message || "Failed to sign into account. Please try again."
          );
          return;
        }

        toast.success("Signed in successfully.");
        router.push("/");
        router.refresh();
      }
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      const code = authError?.code;

      if (code === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "This email is already in use. Please sign in.",
        });
        toast.error("This email is already registered. Please sign in.", {
          action: {
            label: "Sign In",
            onClick: () => router.push("/sign-in"),
          },
        });
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        form.setError("password", {
          type: "manual",
          message: "Invalid email or password.",
        });
        toast.error("Invalid email or password. Please try again.");
      } else if (code === "auth/weak-password") {
        form.setError("password", {
          type: "manual",
          message: "Password is too weak. Must be at least 6 characters.",
        });
        toast.error("Password is too weak. Must be at least 6 characters.");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else if (code === "auth/invalid-email") {
        form.setError("email", {
          type: "manual",
          message: "Please enter a valid email address.",
        });
        toast.error("Please enter a valid email address.");
      } else {
        console.error("Unexpected auth error:", authError?.message || error);
        toast.error(
          authError?.message || "An error occurred during authentication."
        );
      }
    }
  };

  return (
    <div className="w-full surface-glass p-7 sm:p-9 shadow-2xl">
      {/* Form Header */}
      <div className="flex flex-col gap-1.5 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] tracking-tight">
          {isSignIn ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-xs sm:text-sm text-[#8F9BB3]">
          {isSignIn
            ? "Sign in to access your mock interviews and analytics"
            : "Start practicing realistic mock interviews today"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Alex Johnson"
              type="text"
            />
          )}

          <FormField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="alex@company.com"
            type="email"
          />

          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 h-11 px-4 bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(109,74,255,0.35)] hover:shadow-[0_4px_28px_rgba(109,74,255,0.5)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>{isSignIn ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{isSignIn ? "Sign In" : "Get Started"}</span>
            )}
          </button>
        </form>
      </Form>

      {/* Switcher Link */}
      <div className="mt-6 pt-5 border-t border-[rgba(110,120,180,0.15)] text-center text-xs text-[#8F9BB3]">
        <span>{isSignIn ? "Don't have an account yet?" : "Already have an account?"}</span>
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-semibold text-[#845CFF] hover:text-[#A493FF] ml-1.5 transition-colors"
        >
          {isSignIn ? "Create an account" : "Sign In"}
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
