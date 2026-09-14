import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

const questionArraySchema = z.array(z.string().min(1));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type = "Mixed", role = "Software Engineer", level = "Mid-level", techstack = "", amount = 5, userid } = body || {};

    if (!userid) {
      return Response.json(
        { success: false, message: "Missing required field: userid" },
        { status: 400 }
      );
    }

    let parsedQuestions: string[] = [];

    try {
      const { object } = await generateObject({
        model: google("gemini-flash-latest"),
        schema: z.object({
          questions: questionArraySchema,
        }),
        prompt: `Prepare questions for a job interview.
          The job role is ${role}.
          The job experience level is ${level}.
          The tech stack used in the job is: ${techstack}.
          The focus between behavioural and technical questions should lean towards: ${type}.
          The amount of questions required is: ${amount}.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        `,
      });
      parsedQuestions = object.questions;
    } catch (genObjError) {
      console.warn("generateObject failed, falling back to generateText with sanitization:", genObjError);
      const { text: rawText } = await generateText({
        model: google("gemini-flash-latest"),
        prompt: `Prepare ${amount} interview questions for a ${level} ${role} with tech stack: ${techstack}. Focus: ${type}.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters.
          Return ONLY a valid JSON array of strings, for example:
          ["Question 1", "Question 2", "Question 3"]
        `,
      });

      // Safely strip any markdown code blocks or trailing backticks
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
      userId: userid,
      finalized: true,
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
