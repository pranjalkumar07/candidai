import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { formatInterviewDuration } from "@/lib/utils";

const getScoreBand = (score: number) => {
  if (score >= 90) return { label: "Exceptional", desc: "Ready for Senior/Staff roles", color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/30" };
  if (score >= 80) return { label: "Strong", desc: "Solid foundation, minor edge cases", color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/30" };
  if (score >= 70) return { label: "Noticeable Gaps", desc: "Review key concepts before real interviews", color: "text-[#845CFF]", bg: "bg-[#6D4AFF]/10", border: "border-[#6D4AFF]/30" };
  if (score >= 60) return { label: "Borderline", desc: "Major gaps in depth or structure", color: "text-[#F5B942]", bg: "bg-[#F5B942]/10", border: "border-[#F5B942]/30" };
  if (score >= 50) return { label: "Weak", desc: "Fundamental concepts missing", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30" };
  return { label: "Poor", desc: "Significant gaps across all competencies", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30" };
};

const getHiringVerdict = (score: number) => {
  if (score >= 90) return { label: "STRONG HIRE", color: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30" };
  if (score >= 80) return { label: "HIRE", color: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25" };
  if (score >= 70) return { label: "LEANING HIRE", color: "bg-[#845CFF]/15 text-[#845CFF] border-[#845CFF]/30" };
  if (score >= 60) return { label: "BORDERLINE", color: "bg-[#F5B942]/15 text-[#F5B942] border-[#F5B942]/30" };
  return { label: "NO HIRE", color: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30" };
};

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  // Data isolation: ensure candidate can only access their own evaluation report
  if (interview.userId !== user.id) redirect("/interviews");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("MMM D, YYYY • h:mm A")
    : "Recently";

  const totalScore = feedback?.totalScore ?? 0;
  const scoreBand = getScoreBand(totalScore);
  const hiringVerdict = getHiringVerdict(totalScore);

  const durationText = formatInterviewDuration({
    durationSeconds: feedback?.durationSeconds || interview.durationSeconds,
    configuredDuration: interview.duration,
    startedAt: interview.createdAt,
    completedAt: feedback?.completedAt || interview.completedAt,
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1440px] mx-auto w-full pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide">
              OFFICIAL EVALUATION REPORT
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] border ${hiringVerdict.color}`}>
              {hiringVerdict.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
            Interview Assessment
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1 capitalize">
            {interview.role} • {interview.level || "Mid-level"} • {interview.type || "Technical"} Interview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#69748D] px-3.5 py-2 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)]">
            <Calendar className="size-3.5 text-[#845CFF]" />
            <span className="text-[#CBD5E1]">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#69748D] px-3.5 py-2 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)]">
            <Clock className="size-3.5 text-[#845CFF]" />
            <span className="text-[#CBD5E1]">{durationText}</span>
          </div>

          {feedback && (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg surface-glass shadow-sm">
              <span className="text-xs text-[#8F9BB3] font-medium">Readiness:</span>
              <span className={`text-xl font-bold ${scoreBand.color}`}>
                {totalScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      {feedback ? (
        <>
          {/* 2. Executive Assessment Summary Card */}
          <div className="surface-glass relative overflow-hidden p-6 sm:p-7 flex flex-col gap-4 shadow-lg border-l-4 border-l-[#845CFF]">
            <div
              className="absolute -right-20 -top-20 size-72 rounded-full pointer-events-none opacity-30"
              style={{
                background: "radial-gradient(circle, rgba(109, 74, 255, 0.25) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-[#845CFF]" />
                <span className="text-[11px] font-bold text-[#845CFF] uppercase tracking-wider">
                  EXECUTIVE ASSESSMENT SUMMARY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${scoreBand.bg} ${scoreBand.border} ${scoreBand.color}`}>
                  {scoreBand.label} ({scoreBand.desc})
                </span>
              </div>
            </div>
            <p className="relative z-10 text-sm sm:text-base text-[#F5F7FF] leading-relaxed">
              {feedback.finalAssessment || feedback.hiringSummary}
            </p>
          </div>

          {/* 3. Critical Weaknesses / Gaps Banner (if present) */}
          {((feedback.criticalWeaknesses && feedback.criticalWeaknesses.length > 0) ||
            (feedback.technicalGaps && feedback.technicalGaps.length > 0) ||
            (feedback.communicationGaps && feedback.communicationGaps.length > 0)) && (
            <div className="surface-glass p-6 border-l-4 border-l-[#F5B942] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-[#F5B942]" />
                <h3 className="text-sm font-bold text-[#F5F7FF]">
                  Critical Gap Analysis &amp; Watchouts
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {feedback.criticalWeaknesses && feedback.criticalWeaknesses.length > 0 && (
                  <div className="bg-[#0B1224]/80 p-3.5 rounded-lg border border-[rgba(110,120,180,0.18)]">
                    <span className="font-bold text-[#EF4444] uppercase tracking-wider text-[10px] block mb-2">
                      Primary Weaknesses
                    </span>
                    <ul className="space-y-1.5 text-[#CBD5E1]">
                      {feedback.criticalWeaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="size-1 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.technicalGaps && feedback.technicalGaps.length > 0 && (
                  <div className="bg-[#0B1224]/80 p-3.5 rounded-lg border border-[rgba(110,120,180,0.18)]">
                    <span className="font-bold text-[#F5B942] uppercase tracking-wider text-[10px] block mb-2">
                      Technical Gaps
                    </span>
                    <ul className="space-y-1.5 text-[#CBD5E1]">
                      {feedback.technicalGaps.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="size-1 rounded-full bg-[#F5B942] mt-1.5 shrink-0" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.communicationGaps && feedback.communicationGaps.length > 0 && (
                  <div className="bg-[#0B1224]/80 p-3.5 rounded-lg border border-[rgba(110,120,180,0.18)]">
                    <span className="font-bold text-[#845CFF] uppercase tracking-wider text-[10px] block mb-2">
                      Communication Gaps
                    </span>
                    <ul className="space-y-1.5 text-[#CBD5E1]">
                      {feedback.communicationGaps.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="size-1 rounded-full bg-[#845CFF] mt-1.5 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Performance Overview / Competency Matrix */}
          <section className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
                COMPETENCY MATRIX
              </span>
              <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">Competency Breakdown</h2>
              <p className="text-xs text-[#69748D] mt-0.5">
                Evaluation across core interview capability pillars.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.categoryScores?.map((cat, i) => (
                <div
                  key={i}
                  className="surface-glass p-5 flex flex-col gap-3 hover:border-[rgba(110,120,180,0.38)] transition-all"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#F5F7FF]">{cat.name}</span>
                    <span className={`font-bold ${cat.score >= 80 ? "text-[#22C55E]" : cat.score >= 70 ? "text-[#845CFF]" : "text-[#F5B942]"}`}>
                      {cat.score}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#0B1224] overflow-hidden border border-[rgba(110,120,180,0.15)]">
                    <div
                      className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#3B82F6] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(109,74,255,0.4)]"
                      style={{ width: `${Math.min(Math.max(cat.score, 0), 100)}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#8F9BB3] leading-relaxed pt-1">
                    {cat.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. What you did well & Areas to improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What you did well */}
            <div className="surface-glass p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[rgba(110,120,180,0.15)]">
                <CheckCircle2 className="size-4 text-[#22C55E]" />
                <h3 className="text-sm font-bold text-[#F5F7FF]">Demonstrated Strengths</h3>
              </div>

              <ul className="space-y-2.5">
                {feedback.strengths?.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#8F9BB3] leading-relaxed list-none"
                  >
                    <span className="size-1.5 rounded-full bg-[#22C55E] mt-2 shrink-0 shadow-[0_0_6px_#22C55E]" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to improve */}
            <div className="surface-glass p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[rgba(110,120,180,0.15)]">
                <AlertCircle className="size-4 text-[#F5B942]" />
                <h3 className="text-sm font-bold text-[#F5F7FF]">Actionable Areas to Calibrate</h3>
              </div>

              <ul className="space-y-2.5">
                {feedback.areasForImprovement?.map((area, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#8F9BB3] leading-relaxed list-none"
                  >
                    <span className="size-1.5 rounded-full bg-[#F5B942] mt-2 shrink-0 shadow-[0_0_6px_#F5B942]" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. Detailed Question-by-Question Evaluations */}
          {feedback.questionEvaluations && feedback.questionEvaluations.length > 0 ? (
            <section className="flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
                  EVIDENCE-BASED QUESTION REVIEWS
                </span>
                <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">
                  Question-by-Question Deep Dive
                </h2>
                <p className="text-xs text-[#69748D] mt-0.5">
                  Specific assessment of your voice response, technical accuracy, and improvement steps.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {feedback.questionEvaluations.map((qEval, idx) => (
                  <div
                    key={idx}
                    className="surface-glass p-6 sm:p-7 flex flex-col gap-5 border border-[rgba(110,120,180,0.22)] shadow-md"
                  >
                    {/* Header: Question + Score */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[rgba(110,120,180,0.15)]">
                      <div className="flex items-start gap-3">
                        <div className="size-7 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-xs font-bold text-[#845CFF] flex items-center justify-center shrink-0 mt-0.5">
                          Q{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-[#F5F7FF] leading-snug">
                            {qEval.question}
                          </h4>
                          {qEval.candidateResponse && (
                            <p className="text-xs text-[#8F9BB3] italic mt-1.5 bg-[#0B1224]/60 p-2 rounded-md border border-[rgba(110,120,180,0.12)]">
                              &ldquo;{qEval.candidateResponse}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                          qEval.score >= 80
                            ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
                            : qEval.score >= 70
                            ? "bg-[#6D4AFF]/10 border-[#6D4AFF]/30 text-[#845CFF]"
                            : "bg-[#F5B942]/10 border-[#F5B942]/30 text-[#F5B942]"
                        }`}>
                          Score: {qEval.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Feedback Breakdown Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* What was correct */}
                      <div className="p-3.5 rounded-lg bg-[#0B1224]/80 border border-[rgba(34,197,94,0.2)] flex flex-col gap-1.5">
                        <span className="font-bold text-[#22C55E] flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="size-3.5" />
                          What Was Correct
                        </span>
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {qEval.whatWasCorrect || "Demonstrated baseline role context."}
                        </p>
                      </div>

                      {/* What was missing */}
                      <div className="p-3.5 rounded-lg bg-[#0B1224]/80 border border-[rgba(245,185,66,0.2)] flex flex-col gap-1.5">
                        <span className="font-bold text-[#F5B942] flex items-center gap-1.5 text-[11px]">
                          <AlertCircle className="size-3.5" />
                          What Was Missing
                        </span>
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {qEval.whatWasMissing || "Expected deeper architectural or operational considerations."}
                        </p>
                      </div>

                      {/* What was incorrect */}
                      <div className="p-3.5 rounded-lg bg-[#0B1224]/80 border border-[rgba(239,68,68,0.2)] flex flex-col gap-1.5">
                        <span className="font-bold text-[#EF4444] flex items-center gap-1.5 text-[11px]">
                          <AlertTriangle className="size-3.5" />
                          What Was Inaccurate
                        </span>
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {qEval.whatWasIncorrect || "No direct conceptual inaccuracies detected."}
                        </p>
                      </div>
                    </div>

                    {/* Why It Matters & How To Improve */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {qEval.whyItMatters && (
                        <div className="p-3.5 rounded-lg bg-[rgba(11,18,36,0.6)] border border-[rgba(110,120,180,0.15)] flex flex-col gap-1">
                          <span className="font-semibold text-[#845CFF] flex items-center gap-1.5 text-[11px]">
                            <BookOpen className="size-3.5" />
                            Why It Matters in Real Interviews
                          </span>
                          <p className="text-[#8F9BB3] leading-relaxed">
                            {qEval.whyItMatters}
                          </p>
                        </div>
                      )}

                      {qEval.howToImprove && (
                        <div className="p-3.5 rounded-lg bg-[rgba(11,18,36,0.6)] border border-[rgba(110,120,180,0.15)] flex flex-col gap-1">
                          <span className="font-semibold text-[#22D3EE] flex items-center gap-1.5 text-[11px]">
                            <TrendingUp className="size-3.5" />
                            How to Structure Answer Next Time
                          </span>
                          <p className="text-[#8F9BB3] leading-relaxed">
                            {qEval.howToImprove}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ideal Model Answer */}
                    {qEval.idealAnswer && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-[#0B1224] to-[#121A33] border border-[#6D4AFF]/30 flex flex-col gap-2">
                        <span className="font-bold text-[#845CFF] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Lightbulb className="size-3.5 text-[#F5B942]" />
                          Exemplary Senior-Level Answer Model
                        </span>
                        <p className="text-xs text-[#CBD5E1] leading-relaxed">
                          {qEval.idealAnswer}
                        </p>
                      </div>
                    )}

                    {/* Recommended Follow-up */}
                    {qEval.followUpQuestion && (
                      <div className="p-3.5 rounded-lg bg-[#0B1224]/50 border border-[rgba(110,120,180,0.15)] flex items-start gap-2.5 text-xs">
                        <MessageSquare className="size-4 text-[#845CFF] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#F5F7FF] block text-[11px]">
                            Expected Real-World Follow-Up:
                          </span>
                          <span className="text-[#8F9BB3] italic">
                            &ldquo;{qEval.followUpQuestion}&rdquo;
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            interview.questions && interview.questions.length > 0 && (
              <section className="flex flex-col gap-4">
                <div>
                  <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
                    SESSION QUESTIONS
                  </span>
                  <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">Questions Covered</h2>
                </div>

                <div className="surface-glass divide-y divide-[rgba(110,120,180,0.15)] overflow-hidden">
                  {interview.questions.map((q, idx) => (
                    <div key={idx} className="p-4 flex items-start gap-3 hover:bg-[rgba(26,36,68,0.4)] transition-colors">
                      <div className="size-6 rounded-md bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[11px] font-bold text-[#845CFF] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-[#F5F7FF] leading-relaxed">
                        {q}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          )}

          {/* 7. Next Interview Recommendations */}
          {(feedback.nextInterviewRecommendation || (feedback.recommendedTopics && feedback.recommendedTopics.length > 0)) && (
            <div className="surface-glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#845CFF] uppercase tracking-wider block">
                  RECOMMENDED NEXT DRILL
                </span>
                <h4 className="text-sm font-bold text-[#F5F7FF] mt-0.5">
                  {feedback.nextInterviewRecommendation || "Reinforce identified technical edge cases"}
                </h4>
                {feedback.recommendedTopics && feedback.recommendedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {feedback.recommendedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-[4px] bg-[#0B1224] border border-[rgba(110,120,180,0.2)] text-[10px] text-[#A7B0C5]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/interview"
                className="btn-primary text-xs h-9 px-4 shrink-0 justify-center"
              >
                <span>Schedule Next Drill</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          {/* 8. Action Controls */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/"
              className="btn-secondary text-xs font-semibold h-10 px-5 rounded-lg justify-center text-center"
            >
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href={`/interview/${id}`}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg shadow-[0_4px_16px_rgba(109,74,255,0.3)] hover:shadow-[0_4px_24px_rgba(109,74,255,0.45)] transition-all cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Practice again</span>
              </Link>

              <Link
                href="/interview"
                className="btn-secondary text-xs font-semibold h-10 px-5 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>New interview</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="surface-glass p-12 text-center flex flex-col items-center justify-center gap-3">
          <HelpCircle className="size-8 text-[#69748D]" />
          <h3 className="text-base font-bold text-[#F5F7FF]">No evaluation found</h3>
          <p className="text-xs text-[#8F9BB3] max-w-sm">
            Complete your voice session with the interviewer to generate detailed evaluation feedback.
          </p>
          <Link
            href={`/interview/${id}`}
            className="inline-flex items-center gap-2 h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg shadow-[0_4px_16px_rgba(109,74,255,0.3)] transition-all mt-1"
          >
            Start interview
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
