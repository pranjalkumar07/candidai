import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { ArrowRight, Play, CheckCircle2, Clock } from "lucide-react";
import { formatInterviewDuration } from "@/lib/utils";

interface RecentInterviewRowProps {
  id: string;
  role: string;
  type: string;
  level?: string;
  createdAt?: string;
  score?: number | null;
  feedbackId?: string | null;
  durationSeconds?: number | null;
  configuredDuration?: number | null;
}

export default function RecentInterviewRow({
  id,
  role,
  type,
  level = "Intermediate",
  createdAt,
  score,
  durationSeconds,
  configuredDuration,
}: RecentInterviewRowProps) {
  const formattedDate = createdAt ? dayjs(createdAt).format("MMM D, YYYY") : "Recently";
  const isEvaluated = typeof score === "number";
  const targetHref = isEvaluated ? `/interview/${id}/feedback` : `/interview/${id}`;

  // Badge styles based on interview type
  const normalizedType = type?.toLowerCase() || "technical";
  const typeBadgeStyle = normalizedType.includes("behav")
    ? "bg-[#F5B942]/12 border-[#F5B942]/30 text-[#F5B942]"
    : normalizedType.includes("mixed")
    ? "bg-[#3B82F6]/12 border-[#3B82F6]/30 text-[#3B82F6]"
    : "bg-[#6D4AFF]/12 border-[#6D4AFF]/30 text-[#845CFF]";

  // Score badge style
  const getScoreBadge = () => {
    if (!isEvaluated) {
      return (
        <span className="text-[11px] font-medium text-[#A7B0C5] bg-[rgba(110,120,180,0.12)] px-2 py-0.5 rounded-[5px] border border-[rgba(110,120,180,0.2)]">
          Pending
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-[5px] border border-[#22C55E]/30">
          {score}%
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="text-[11px] font-bold text-[#845CFF] bg-[#6D4AFF]/10 px-2.5 py-0.5 rounded-[5px] border border-[#6D4AFF]/30">
          {score}%
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-0.5 rounded-[5px] border border-[#EF4444]/30">
        {score}%
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[12px] bg-[rgba(12,19,38,0.7)] border border-[rgba(110,120,180,0.18)] hover:border-[rgba(115,90,255,0.35)] hover:bg-[rgba(26,36,68,0.6)] transition-all duration-200 group shadow-sm">
      {/* Left: Icon & Role & Level & Mobile Date */}
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-[8px] bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#69748D] shrink-0 group-hover:text-[#F5F7FF] group-hover:border-[#6D4AFF]/50 transition-colors">
          {isEvaluated ? (
            <CheckCircle2 className="size-4 text-[#22C55E]" />
          ) : (
            <Play className="size-4 text-[#845CFF]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-semibold text-[#F5F7FF] group-hover:text-white transition-colors capitalize truncate">
              {role}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#69748D] mt-0.5">
            <span>{level}</span>
            <span className="sm:hidden">•</span>
            <span className="sm:hidden">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: Type Badge, Duration, Score, Date, Action */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(110,120,180,0.1)]">
        {/* Type Badge */}
        <span
          className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-[5px] border capitalize ${typeBadgeStyle}`}
        >
          {type || "Technical"}
        </span>

        {/* Duration */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#69748D]">
          <Clock className="size-3 text-[#69748D]" />
          <span>
            {formatInterviewDuration({
              durationSeconds,
              configuredDuration,
            })}
          </span>
        </div>

        {/* Score */}
        <div className="min-w-[50px] sm:min-w-[60px] text-center">
          {getScoreBadge()}
        </div>

        {/* Date (Desktop) */}
        <span className="text-xs text-[#69748D] min-w-[80px] text-right hidden sm:inline">
          {formattedDate}
        </span>

        {/* Action Link */}
        <Link
          href={targetHref}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[#6D4AFF]/10 sm:bg-transparent border border-[#6D4AFF]/30 sm:border-transparent text-xs font-semibold text-[#845CFF] group-hover:text-white transition-all shrink-0"
        >
          <span>{isEvaluated ? "View" : "Start"}</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
