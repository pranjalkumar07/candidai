"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Search, ArrowRight, Play, CheckCircle2, ChevronDown, Layers, Clock } from "lucide-react";
import { formatInterviewDuration } from "@/lib/utils";

interface HistoryItem {
  id: string;
  role: string;
  type: string;
  level: string;
  createdAt: string;
  score?: number | null;
  feedbackId?: string | null;
  durationSeconds?: number | null;
  configuredDuration?: number | null;
}

interface InterviewHistoryListProps {
  initialInterviews: HistoryItem[];
}

export default function InterviewHistoryList({
  initialInterviews,
}: InterviewHistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score">("newest");

  const filteredInterviews = useMemo(() => {
    return initialInterviews
      .filter((item) => {
        const matchesSearch =
          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.level && item.level.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType =
          typeFilter === "All" ||
          item.type.toLowerCase().includes(typeFilter.toLowerCase());

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "score") {
          return (b.score ?? 0) - (a.score ?? 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [initialInterviews, searchQuery, typeFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar */}
      <div className="surface-glass p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#69748D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interviews by role or calibration..."
            className="w-full bg-[#0B1224] border border-[rgba(110,120,180,0.22)] focus:border-[#6D4AFF] rounded-[8px] pl-10 pr-3 py-2 text-xs text-[#F5F7FF] placeholder:text-[#69748D] outline-none transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="relative flex-1 sm:flex-none min-w-[120px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#F5F7FF] text-xs rounded-[8px] pl-3.5 pr-8 py-2 outline-none cursor-pointer focus:border-[#6D4AFF] transition-colors"
            >
              <option value="All">All types</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Mixed">Mixed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-[#69748D] pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative flex-1 sm:flex-none min-w-[120px]">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "score")
              }
              className="w-full sm:w-auto appearance-none bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#F5F7FF] text-xs rounded-[8px] pl-3.5 pr-8 py-2 outline-none cursor-pointer focus:border-[#6D4AFF] transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="score">Highest score</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-[#69748D] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Analytics Data Table */}
      {filteredInterviews.length > 0 ? (
        <div className="surface-glass overflow-hidden shadow-lg">
          {/* Table Header (Desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-bold text-[#69748D] uppercase tracking-wider border-b border-[rgba(110,120,180,0.15)] bg-[#0B1224]/80">
            <div className="col-span-4">Role & Level</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[rgba(110,120,180,0.15)]">
            {filteredInterviews.map((item) => {
              const isEvaluated = typeof item.score === "number";
              const targetHref = isEvaluated
                ? `/interview/${item.id}/feedback`
                : `/interview/${item.id}`;
              const formattedDate = item.createdAt
                ? dayjs(item.createdAt).format("MMM D, YYYY")
                : "Recently";

              const normalizedType = item.type?.toLowerCase() || "technical";
              const typeBadgeStyle = normalizedType.includes("behav")
                ? "bg-[#F5B942]/12 border-[#F5B942]/30 text-[#F5B942]"
                : normalizedType.includes("mixed")
                ? "bg-[#3B82F6]/12 border-[#3B82F6]/30 text-[#3B82F6]"
                : "bg-[#6D4AFF]/12 border-[#6D4AFF]/30 text-[#845CFF]";

              return (
                <div
                  key={item.id}
                  className="p-4 sm:px-5 sm:py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center hover:bg-[rgba(26,36,68,0.55)] transition-all duration-150 group"
                >
                  {/* Role / Level */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className="size-8 rounded-[7px] bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#69748D] shrink-0 group-hover:text-[#F5F7FF] group-hover:border-[#6D4AFF]/40 transition-colors">
                      {isEvaluated ? (
                        <CheckCircle2 className="size-3.5 text-[#22C55E]" />
                      ) : (
                        <Play className="size-3.5 text-[#845CFF]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#F5F7FF] block capitalize">
                        {item.role}
                      </span>
                      <span className="text-[11px] text-[#69748D]">
                        {item.level || "Intermediate"} • {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="sm:col-span-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-[5px] border capitalize ${typeBadgeStyle}`}>
                      {item.type || "Technical"}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                    <span className="sm:hidden text-xs text-[#69748D]">Score:</span>
                    {isEvaluated ? (
                      <span className={`text-xs sm:text-sm font-bold ${item.score && item.score >= 80 ? "text-[#22C55E]" : "text-[#845CFF]"}`}>
                        {item.score}%
                      </span>
                    ) : (
                      <span className="text-xs text-[#69748D]">Not taken</span>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="sm:col-span-2 text-xs text-[#69748D] flex items-center gap-1.5 min-w-0">
                    <Clock className="size-3 text-[#69748D] shrink-0" />
                    <span className="truncate">
                      {formatInterviewDuration({
                        durationSeconds: item.durationSeconds,
                        configuredDuration: item.configuredDuration,
                      })}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="sm:col-span-2 flex justify-end pt-1 sm:pt-0">
                    <Link
                      href={targetHref}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:size-8 sm:p-0 rounded-[7px] bg-[#0B1224] group-hover:bg-[#6D4AFF] group-hover:text-white text-[#A7B0C5] border border-[rgba(110,120,180,0.22)] group-hover:border-[#6D4AFF] sm:justify-center text-xs font-semibold transition-all cursor-pointer shadow-xs"
                      title={isEvaluated ? "View Evaluation" : "Start Interview"}
                    >
                      <span className="sm:hidden">{isEvaluated ? "View report" : "Start"}</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="surface-glass p-12 text-center flex flex-col items-center justify-center gap-3">
          <Layers className="size-6 text-[#69748D]" />
          <p className="text-sm font-semibold text-[#F5F7FF]">
            {searchQuery || typeFilter !== "All"
              ? "No matching interviews found."
              : "No interviews yet."}
          </p>
          <p className="text-xs text-[#8F9BB3] max-w-xs">
            {searchQuery || typeFilter !== "All"
              ? "Try adjusting your search query or filters to find your interview sessions."
              : "Your completed interviews will appear here."}
          </p>
          <Link
            href="/interview"
            className="btn-primary text-xs h-[38px] px-4 mt-2 inline-flex items-center gap-1.5"
          >
            <span>Create your first interview →</span>
          </Link>
        </div>
      )}
    </div>
  );
}
