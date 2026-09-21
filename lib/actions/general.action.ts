"use server";

import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId, durationSeconds } = params;

  if (!interviewId || !userId) {
    return { success: false, message: "Missing interviewId or userId" };
  }

  if (!Array.isArray(transcript) || transcript.length === 0) {
    return { success: false, message: "Transcript cannot be empty" };
  }

  try {
    // 1. Fetch target interview document and verify ownership
    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    if (!interviewDoc.exists) {
      return { success: false, message: "Interview record not found" };
    }

    const interviewData = interviewDoc.data() as Interview;
    if (interviewData.userId !== userId) {
      return { success: false, message: "Unauthorized access to interview" };
    }

    const targetRole = interviewData.role || "Software Engineer";
    const targetLevel = interviewData.level || "Mid-level";
    const targetType = interviewData.type || "Technical";
    const targetTech = interviewData.techstack?.join(", ") || "General Engineering";
    const targetQuestions = interviewData.questions || [];

    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role.toUpperCase()}: ${sentence.content}\n`
      )
      .join("");

    const evaluationPrompt = `You are an elite, highly experienced technical hiring manager and principal engineer conducting a comprehensive, critical evaluation of a candidate's mock interview for CandidAI.

INTERVIEW CONTEXT:
- Target Role: ${targetRole}
- Experience Level: ${targetLevel}
- Interview Type: ${targetType}
- Focus Technologies / Topics: ${targetTech}
- Planned Questions:
${targetQuestions.map((q, i) => `  ${i + 1}. ${q}`).join("\n")}

ACTUAL RECORDED INTERVIEW TRANSCRIPT:
${formattedTranscript}

CRITICAL EVALUATION DIRECTIVES (NEVER FABRICATE OR FLATTER):
1. **Zero Flattery / Honest Assessment**: Do NOT praise the candidate simply for attempting an answer. Do NOT use boilerplate praise like "Good job", "Great answer", or "Strong communication" unless the answer truly demonstrates deep, senior-calibrated mastery. If an answer was shallow, vague, or missing critical details, say so directly and constructively.
2. **Realistic Scoring Standard (0-100)**:
   - 90–100: Exceptional answer. Deep technical understanding, precise reasoning, strong communication, edge cases addressed, production tradeoffs analyzed.
   - 80–89: Strong answer. Correct, clear, and relevant with only minor gaps or omissions.
   - 70–79: Good with noticeable gaps. Understands the high-level concept but lacks depth, precision, completeness, or edge-case awareness.
   - 60–69: Borderline. Basic conceptual understanding, but significant gaps, weak reasoning, or superficial explanations.
   - 50–59: Weak. Major technical gaps, incomplete reasoning, or partially incorrect explanations.
   - Below 50: Poor. Incorrect, irrelevant, superficial, or unable to demonstrate required understanding for a ${targetLevel} ${targetRole}.
3. **Evidence-Based Per-Question Evaluation**:
   For each question covered in the interview:
   - Extract the specific Question.
   - Extract/summarize the Candidate's actual Answer from the transcript.
   - Score the answer realistically (0-100).
   - "whatWasCorrect": Cite actual specific statements made by the candidate that were accurate.
   - "whatWasMissing": Identify specifically what concepts, tradeoffs, or implementation details were omitted.
   - "whatWasIncorrect": Identify any false claims, misconceptions, or anti-patterns (or "None identified" if accurate).
   - "whyItMatters": Explain why this matters in a real production engineering environment.
   - "howToImprove": Concrete, actionable advice on how the candidate should structure this answer in a real interview.
   - "idealAnswer": A concise, senior-grade model response demonstrating optimal depth and clarity.
   - "followUpQuestion": A realistic technical deep-dive follow-up question that an interviewer would ask next.
4. **Competency Category Scores**:
   Score each of the following 5 categories from 0 to 100 with specific, evidence-grounded commentary:
   - "Technical Knowledge"
   - "Problem Solving"
   - "Communication"
   - "Confidence & Clarity"
   - "Relevance & Structure"
5. **Executive Hiring Summary**:
   - Write an objective hiring-style evaluation summary. Use realistic phrasing such as: "The candidate's performance indicates...", "The primary technical gap observed was...", "To improve readiness for a ${targetLevel} role, focus on...".
   - Do NOT say "You are definitely ready for a job" or make unsupported hiring guarantees.
`;

    let evaluationResult;

    try {
      const { object } = await generateObject({
        model: google("gemini-1.5-flash", {
          structuredOutputs: false,
        }),
        schema: feedbackSchema,
        prompt: evaluationPrompt,
        system:
          "You are an elite, objective technical hiring manager. You evaluate mock interviews critically, fairly, and evidence-based, avoiding generic flattery or inflated scores.",
      });
      evaluationResult = object;
    } catch (genObjError) {
      console.warn("generateObject failed, falling back to generateText with robust parsing:", genObjError);
      const { text: rawText } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: `${evaluationPrompt}

Return ONLY valid JSON matching this schema:
{
  "totalScore": number,
  "categoryScores": [{"name": string, "score": number, "comment": string}],
  "strengths": string[],
  "areasForImprovement": string[],
  "finalAssessment": string,
  "hiringSummary": string,
  "criticalWeaknesses": string[],
  "technicalGaps": string[],
  "communicationGaps": string[],
  "struggledQuestions": string[],
  "strongQuestions": string[],
  "improvementAreas": string[],
  "recommendedTopics": string[],
  "difficultyAssessment": string,
  "nextInterviewRecommendation": string,
  "questionEvaluations": [
    {
      "question": string,
      "candidateAnswer": string,
      "score": number,
      "whatWasCorrect": string,
      "whatWasMissing": string,
      "whatWasIncorrect": string,
      "whyItMatters": string,
      "howToImprove": string,
      "idealAnswer": string,
      "followUpQuestion": string
    }
  ]
}`,
      });

      const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      evaluationResult = feedbackSchema.parse(parsed);
    }

    const nowIso = new Date().toISOString();

    const feedbackDocData: Record<string, unknown> = {
      interviewId,
      userId,
      totalScore: evaluationResult.totalScore,
      categoryScores: evaluationResult.categoryScores,
      strengths: evaluationResult.strengths || [],
      areasForImprovement: evaluationResult.areasForImprovement || [],
      finalAssessment: evaluationResult.finalAssessment || evaluationResult.hiringSummary || "Interview evaluation completed.",
      hiringSummary: evaluationResult.hiringSummary || evaluationResult.finalAssessment,
      criticalWeaknesses: evaluationResult.criticalWeaknesses || [],
      technicalGaps: evaluationResult.technicalGaps || [],
      communicationGaps: evaluationResult.communicationGaps || [],
      struggledQuestions: evaluationResult.struggledQuestions || [],
      strongQuestions: evaluationResult.strongQuestions || [],
      improvementAreas: evaluationResult.improvementAreas || evaluationResult.areasForImprovement || [],
      recommendedTopics: evaluationResult.recommendedTopics || [],
      difficultyAssessment: evaluationResult.difficultyAssessment || `${targetLevel} Calibration`,
      nextInterviewRecommendation: evaluationResult.nextInterviewRecommendation || `Practice another ${targetType} session`,
      questionEvaluations: evaluationResult.questionEvaluations || [],
      createdAt: nowIso,
    };

    if (typeof durationSeconds === "number" && durationSeconds > 0) {
      feedbackDocData.durationSeconds = durationSeconds;
      feedbackDocData.completedAt = nowIso;
    }

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedbackDocData);

    // Update the interview document with completion state and duration if available
    const interviewUpdates: Record<string, unknown> = {
      finalized: true,
      completedAt: nowIso,
    };
    if (typeof durationSeconds === "number" && durationSeconds > 0) {
      interviewUpdates.durationSeconds = durationSeconds;
    }

    await db.collection("interviews").doc(interviewId).update(interviewUpdates);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error creating and saving feedback:", error);
    return { success: false, message: "Failed to generate evaluation" };
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

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  if (!userId) return [];

  try {
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

