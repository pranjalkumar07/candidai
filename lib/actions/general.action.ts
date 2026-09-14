"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  if (!interviewId || !userId) {
    return { success: false };
  }

  if (!Array.isArray(transcript) || transcript.length === 0) {
    return { success: false };
  }

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-flash-latest", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following categories. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem Solving**: Ability to analyze problems and propose solutions.
        - **Cultural Fit**: Alignment with company values and job role.
        - **Confidence and Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  if (!id) return null;

  try {
    const interview = await db.collection("interviews").doc(id).get();

    if (!interview.exists) return null;

    return {
      id: interview.id,
      ...interview.data(),
    } as Interview;
  } catch (error) {
    console.error("Error getting interview by ID:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  if (!interviewId || !userId) return null;

  try {
    // Query by interviewId using Firestore single-field index (no composite index needed)
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs.find(
      (doc) => doc.data()?.userId === userId
    );
    if (!feedbackDoc) return null;

    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.error("Error getting feedback by interview ID:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  try {
    // Query ordered strictly by createdAt using Firestore single-field index (no composite index needed)
    // Filter finalized and userId in memory
    const snapshot = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .limit(limit + 50)
      .get();

    const interviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews
      .filter((interview) => interview.finalized && (!userId || interview.userId !== userId))
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  if (!userId) return [];

  try {
    // Query by userId using Firestore single-field index (no composite index needed)
    // Sort in memory by createdAt descending
    const snapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    const interviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error getting interviews by user ID:", error);
    return [];
  }
}

export async function getFeedbacksByUserId(
  userId: string
): Promise<Feedback[]> {
  if (!userId) return [];

  try {
    const snapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    const feedbacks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    return feedbacks.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error getting feedbacks by user ID:", error);
    return [];
  }
}

