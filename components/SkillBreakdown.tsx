"use client";

import React from "react";
import { Code, Brain, MessageSquare, Shield } from "lucide-react";

interface SkillItem {
  name: string;
  score: number;
  trend: string;
  icon: typeof Code;
}

interface SkillBreakdownProps {
  skills: {
    tech: number;
    problem: number;
    comm: number;
    conf: number;
  };
}

export default function SkillBreakdown({ skills }: SkillBreakdownProps) {
  const items: SkillItem[] = [
    {
      name: "Technical Knowledge",
      score: skills.tech,
      trend: "↑ 5%",
      icon: Code,
    },
    {
      name: "Problem Solving",
      score: skills.problem,
      trend: "↑ 3%",
      icon: Brain,
    },
    {
      name: "Communication",
      score: skills.comm,
      trend: "↑ 7%",
      icon: MessageSquare,
    },
    {
      name: "Confidence",
      score: skills.conf,
      trend: "↑ 2%",
      icon: Shield,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const clamped = Math.min(Math.max(item.score, 0), 100);

        return (
          <div key={item.name} className="flex flex-col gap-1.5">
            {/* Top Row: Icon + Label + Score + Trend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded-[5px] bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 flex items-center justify-center text-[#845CFF]">
                  <Icon className="size-3" />
                </div>
                <span className="font-semibold text-[#F5F7FF]">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F5F7FF]">{item.score}%</span>
                <span className="text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded-[4px] border border-[#22C55E]/25">
                  {item.trend}
                </span>
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
