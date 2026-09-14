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
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("MMM D, YYYY • h:mm A")
    : "Recently";

  const totalScore = feedback?.totalScore ?? 0;

  return (
    <div className="flex flex-col gap-8 max-w-[1440px] mx-auto w-full pb-10">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide">
              ASSESSMENT REPORT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
            Interview Completed
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1 capitalize">
            {interview.role} • {interview.type || "Technical"} Interview
          </p>
        </div>

        <div className="flex items-center gap-3.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#69748D] px-3.5 py-2 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)]">
            <Calendar className="size-3.5 text-[#845CFF]" />
            <span className="text-[#CBD5E1]">{formattedDate}</span>
          </div>

          {feedback && (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg surface-glass shadow-sm">
              <span className="text-xs text-[#8F9BB3] font-medium">Readiness:</span>
              <span className={`text-xl font-bold ${totalScore >= 80 ? "text-[#22C55E]" : "text-[#845CFF]"}`}>
                {totalScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      {feedback ? (
        <>
          {/* 2. Executive Assessment */}
          <div className="surface-glass relative overflow-hidden p-6 sm:p-7 flex flex-col gap-3 shadow-lg">
            <div
              className="absolute -right-20 -top-20 size-72 rounded-full pointer-events-none opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(109, 74, 255, 0.2) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#845CFF] uppercase tracking-wider">
                EXECUTIVE ASSESSMENT SUMMARY
              </span>
              <span className="text-xs text-[#69748D] font-mono">CandidAI Evaluator</span>
            </div>
            <p className="relative z-10 text-sm sm:text-base text-[#F5F7FF] leading-relaxed">
              {feedback.finalAssessment}
            </p>
          </div>

          {/* 3. Performance Overview / Skill Breakdown */}
          <section className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
                COMPETENCY MATRIX
              </span>
              <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">Competency Breakdown</h2>
              <p className="text-xs text-[#69748D] mt-0.5">
                Evaluation across core interview competency criteria.
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
                    <span className={`font-bold ${cat.score >= 80 ? "text-[#22C55E]" : "text-[#845CFF]"}`}>{cat.score}%</span>
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

          {/* 4. What you did well & Areas to improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What you did well */}
            <div className="surface-glass p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[rgba(110,120,180,0.15)]">
                <CheckCircle2 className="size-4 text-[#22C55E]" />
                <h3 className="text-sm font-bold text-[#F5F7FF]">What You Did Well</h3>
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
                <h3 className="text-sm font-bold text-[#F5F7FF]">Areas to Calibrate</h3>
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

          {/* 5. Question Review */}
          {interview.questions && interview.questions.length > 0 && (
            <section className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
                  TRANSCRIPT LOG
                </span>
                <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">Questions Evaluated</h2>
                <p className="text-xs text-[#69748D] mt-0.5">
                  The tailored questions covered in this interview session.
                </p>
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
          )}

          {/* 6. Action Controls */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="btn-secondary text-xs font-semibold h-10 px-5 rounded-lg"
            >
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/interview/${id}`}
                className="inline-flex items-center gap-2 h-10 px-5 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg shadow-[0_4px_16px_rgba(109,74,255,0.3)] hover:shadow-[0_4px_24px_rgba(109,74,255,0.45)] transition-all cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Practice again</span>
              </Link>

              <Link
                href="/interview"
                className="btn-secondary text-xs font-semibold h-10 px-5 rounded-lg flex items-center gap-1.5"
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
