"use client";

import React from "react";
import { Code, Brain, MessageSquare, Shield, CheckCircle2 } from "lucide-react";

interface SkillItem {
  name: string;
  score: number;
  trend?: string;
}

interface SkillBreakdownProps {
  skills: SkillItem[] | null;
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("tech") || lower.includes("code")) return Code;
  if (lower.includes("problem") || lower.includes("logic")) return Brain;
  if (lower.includes("comm") || lower.includes("clarity")) return MessageSquare;
  if (lower.includes("confid") || lower.includes("delivery")) return Shield;
  return CheckCircle2;
};

export default function SkillBreakdown({ skills }: SkillBreakdownProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 border border-dashed border-[rgba(110,120,180,0.22)] rounded-[12px] bg-[rgba(11,18,36,0.5)] min-h-[190px] gap-2">
        <p className="text-xs font-semibold text-[#F5F7FF]">Competency analysis</p>
        <p className="text-xs text-[#8F9BB3] max-w-xs">
          Your competency profile will appear after your first interview.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {skills.map((item) => {
        const Icon = getCategoryIcon(item.name);
        const clamped = Math.min(Math.max(item.score, 0), 100);

        return (
          <div key={item.name} className="flex flex-col gap-1.5">
            {/* Top Row: Icon + Label + Score + Optional Trend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded-[5px] bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 flex items-center justify-center text-[#845CFF]">
                  <Icon className="size-3" />
                </div>
                <span className="font-semibold text-[#F5F7FF]">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F5F7FF]">{item.score}%</span>
                {item.trend && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${
                      item.trend.startsWith("↓") || item.trend.includes("-")
                        ? "text-[#F5B942] bg-[#F5B942]/10 border-[#F5B942]/25"
                        : "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/25"
                    }`}
                  >
                    {item.trend}
                  </span>
                )}
              </div>
            </div>

            {/* Gradient Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#0B1224] border border-[rgba(110,120,180,0.15)] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6D4AFF] via-[#4F46E5] to-[#22D3EE] shadow-[0_0_10px_rgba(109,74,255,0.4)] transition-all duration-1000 ease-out"
                style={{ width: `${clamped}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

