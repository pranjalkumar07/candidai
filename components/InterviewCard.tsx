import dayjs from "dayjs";
import Link from "next/link";
import { ArrowRight, Calendar, Award, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";

import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack = [],
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type || "")
    ? "Mixed"
    : /behav/gi.test(type || "")
    ? "Behavioral"
    : "Technical";

  const typeColor = {
    Behavioral: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    Mixed: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Technical: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  }[normalizedType] || "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";

  const formattedDate = (feedback?.createdAt || createdAt)
    ? dayjs(feedback?.createdAt || createdAt).format("MMM D, YYYY")
    : "Recently";

  const hasScore = typeof feedback?.totalScore === "number";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-indigo-950/20">
      <div>
        {/* Card Header: Type Badge & Score / Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${typeColor}`}
          >
            {normalizedType}
          </span>

          {hasScore ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs">
              <Award className="size-3.5 text-indigo-400" />
              <span>{feedback.totalScore}/100</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-400 text-xs font-medium">
              <Sparkles className="size-3 text-slate-400" />
              <span>Ready</span>
            </div>
          )}
        </div>

        {/* Role Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors capitalize leading-snug line-clamp-1">
          {role}
        </h3>

        {/* Date & Completion Status */}
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-500" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            {hasScore ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Evaluated</span>
              </>
            ) : (
              <span className="text-slate-400">Not taken yet</span>
            )}
          </div>
        </div>

        {/* Summary Snippet / Description */}
        <p className="mt-4 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {feedback?.finalAssessment ||
            "Tailored mock interview focusing on core role competencies, architecture, and practical problem solving."}
        </p>
      </div>

      {/* Card Footer: Tech Stack & CTA */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex-1 overflow-hidden">
          <DisplayTechIcons techStack={techstack} />
        </div>

        <Link
          href={
            feedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
          }
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            feedback
              ? "bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
          }`}
        >
          {feedback ? (
            <>
              <span>Feedback</span>
              <ArrowRight className="size-3.5" />
            </>
          ) : (
            <>
              <PlayCircle className="size-3.5" />
              <span>Start</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
