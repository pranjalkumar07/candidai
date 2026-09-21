import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

const questionArraySchema = z.array(z.string().min(1));

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      type = "Mixed",
      role = "Software Engineer",
      level = "Mid-level",
      techstack = "",
      amount = 5,
      duration = 30,
    } = body || {};

    let parsedQuestions: string[] = [];

    try {
      const { object } = await generateObject({
        model: google("gemini-1.5-flash"),
        schema: z.object({
          questions: questionArraySchema,
        }),
        prompt: `Prepare high-quality, realistic mock interview questions for CandidAI.
          Role: ${role}.
          Experience Level: ${level}.
          Tech Stack / Focus: ${techstack}.
          Interview Mode: ${type}.
          Number of Questions: ${amount}.
          Calibration Guidelines:
          - For Junior: Focus on core fundamentals, basic debugging, and clean explanations.
          - For Mid-level: Focus on architectural decisions, performance, practical implementation, and trade-offs.
          - For Senior / Lead: Focus on distributed systems, scaling, resilience, leadership, and complex edge cases.
          - The questions will be spoken aloud by a voice assistant: do NOT use slashes, asterisks, markdown, or awkward notation that sounds unnatural when spoken.
        `,
      });
      parsedQuestions = object.questions;
    } catch (genObjError) {
      console.warn("generateObject failed, falling back to generateText with sanitization:", genObjError);
      const { text: rawText } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: `Prepare ${amount} interview questions for a ${level} ${role} with tech stack: ${techstack}. Focus: ${type}.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters.
          Return ONLY a valid JSON array of strings, for example:
          ["Question 1", "Question 2", "Question 3"]
        `,
      });

      const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
      const rawParsed = JSON.parse(cleaned);
      parsedQuestions = questionArraySchema.parse(rawParsed);
    }

    const techstackArray = typeof techstack === "string"
      ? techstack.split(",").map((tech: string) => tech.trim()).filter(Boolean)
      : Array.isArray(techstack)
      ? techstack.map((tech: string) => String(tech).trim()).filter(Boolean)
      : [];

    const interview = {
      role,
      type,
      level,
      techstack: techstackArray,
      questions: parsedQuestions,
      userId: user.id,
      finalized: false,
      duration: typeof duration === "number" ? duration : 30,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error generating interview questions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate interview questions";
    return Response.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
