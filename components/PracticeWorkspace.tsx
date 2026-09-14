"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code,
  Users,
  Binary,
  Layout,
  Server,
  Network,
  UserCheck,
  FileCode2,
  ArrowRight,
  Zap,
} from "lucide-react";

interface PracticeCategory {
  id: string;
  name: string;
  icon: typeof Code;
  recommendedRole: string;
  difficulty: string;
  questionCount: string;
  estimatedTime: string;
  description: string;
  recommendedFocus: string[];
}

const CATEGORIES: PracticeCategory[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: Binary,
    recommendedRole: "Software Engineer",
    difficulty: "Advanced",
    questionCount: "5-7 questions",
    estimatedTime: "25 min",
    description: "Algorithmic thinking, tree/graph traversals, recursion, and Big-O efficiency.",
    recommendedFocus: ["Dynamic Programming", "Trees & Graphs", "Binary Search", "Space Optimization"],
  },
  {
    id: "frontend",
    name: "Frontend Engineering",
    icon: Layout,
    recommendedRole: "Frontend Developer",
    difficulty: "Intermediate",
    questionCount: "5 questions",
    estimatedTime: "20 min",
    description: "React hooks, state management, CSS architecture, web vitals, and rendering lifecycles.",
    recommendedFocus: ["React State & Hooks", "DOM Rendering", "Accessibility", "Performance Auditing"],
  },
  {
    id: "backend",
    name: "Backend Engineering",
    icon: Server,
    recommendedRole: "Backend Developer",
    difficulty: "Intermediate to Senior",
    questionCount: "5 questions",
    estimatedTime: "25 min",
    description: "REST & GraphQL APIs, database indexing, caching strategies, and security protocols.",
    recommendedFocus: ["SQL Query Tuning", "Concurrency", "Authentication", "Rate Limiting"],
  },
  {
    id: "system-design",
    name: "System Design",
    icon: Network,
    recommendedRole: "Senior / Staff Engineer",
    difficulty: "Senior",
    questionCount: "4-5 questions",
    estimatedTime: "30 min",
    description: "Scalability, microservices, message queues, partitioning, and resilience patterns.",
    recommendedFocus: ["CAP Theorem", "Sharding & Replication", "Caching Tiers", "Failure Recovery"],
  },
  {
    id: "behavioral",
    name: "Behavioral & STAR",
    icon: Users,
    recommendedRole: "Engineering Candidate",
    difficulty: "All Levels",
    questionCount: "5 questions",
    estimatedTime: "20 min",
    description: "STAR method scenarios, leadership principles, conflict resolution, and communication.",
    recommendedFocus: ["Conflict Resolution", "Project Ownership", "Mentorship", "Handling Deadlines"],
  },
  {
    id: "hr",
    name: "HR & Culture Round",
    icon: UserCheck,
    recommendedRole: "Job Applicant",
    difficulty: "Beginner to Intermediate",
    questionCount: "4 questions",
    estimatedTime: "15 min",
    description: "Motivation, team dynamics, compensation alignment, and career trajectory goals.",
    recommendedFocus: ["Career Trajectory", "Work Ethic", "Team Fit", "Salary & Role Expectations"],
  },
  {
    id: "javascript",
    name: "Core JavaScript",
    icon: FileCode2,
    recommendedRole: "Full Stack Engineer",
    difficulty: "Intermediate",
    questionCount: "5 questions",
    estimatedTime: "20 min",
    description: "Closures, event loop, prototypes, asynchronous JavaScript, and ES6+ standards.",
    recommendedFocus: ["Event Loop & Microtasks", "Prototypes & Inheritance", "Promises & Async/Await", "Scope & Closures"],
  },
];

export default function PracticeWorkspace() {
  const [selectedId, setSelectedId] = useState("dsa");

  return (
    <div className="flex flex-col gap-8">
      {/* 1. "Recommended For You" Hero Card */}
      <div className="relative overflow-hidden surface-glass p-6 sm:p-8">
        <div
          className="absolute -right-16 -top-16 size-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(109, 74, 255, 0.22) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/3 -bottom-20 size-60 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#F5B942]/10 border border-[#F5B942]/25 text-[11px] font-bold text-[#F5B942] tracking-wider uppercase">
                <Zap className="size-3" />
                RECOMMENDED FOR YOU
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] tracking-tight">
              Full Stack Technical Interview Drill
            </h2>

            <p className="text-xs sm:text-sm text-[#8F9BB3] leading-relaxed">
              Calibrated mock interview targeting modern React lifecycles, distributed Node.js architecture, and real-time algorithmic trade-offs.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#69748D] pt-1">
              <span className="px-2 py-0.5 rounded bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#CBD5E1]">
                5 questions
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#CBD5E1]">
                ~20 min
              </span>
              <span>•</span>
              <span className="text-[#22C55E] font-semibold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                High Impact
              </span>
            </div>
          </div>

          <Link
            href="/interview?role=Full%20Stack%20Engineer&type=Technical"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg transition-all shrink-0 shadow-[0_4px_20px_rgba(109,74,255,0.35)] hover:shadow-[0_4px_28px_rgba(109,74,255,0.5)] group cursor-pointer"
          >
            <span>Start recommended drill</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Category Grid (7 Categories) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#845CFF] tracking-[0.08em] uppercase block">
              PRACTICE DRILLS
            </span>
            <h3 className="text-lg font-bold text-[#F5F7FF] mt-0.5">
              Explore Practice Categories
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = cat.id === selectedId;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`surface-glass p-5 flex flex-col justify-between gap-4 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 group ${
                  isSelected
                    ? "!border-[#6D4AFF] shadow-[0_8px_24px_rgba(109,74,255,0.25)]"
                    : "hover:border-[rgba(110,120,180,0.38)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    <div
                      className={`size-10 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-[#6D4AFF] to-[#4F46E5] text-white shadow-[0_0_16px_rgba(109,74,255,0.4)]"
                          : "bg-[#0B1224] text-[#845CFF] border border-[rgba(110,120,180,0.22)] group-hover:border-[#6D4AFF]/50 group-hover:text-[#A493FF]"
                      }`}
                    >
                      <CatIcon className="size-5" />
                    </div>

                    <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-semibold bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#8F9BB3]">
                      {cat.difficulty}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#F5F7FF] group-hover:text-white transition-colors">
                    {cat.name}
                  </h4>

                  <p className="text-xs text-[#8F9BB3] mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Focus Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cat.recommendedFocus.slice(0, 3).map((focus) => (
                      <span
                        key={focus}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#0B1224]/80 text-[#69748D] border border-[rgba(110,120,180,0.15)]"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(110,120,180,0.15)] flex items-center justify-between text-xs">
                  <span className="text-[#69748D] font-medium text-[11px]">
                    {cat.questionCount} • {cat.estimatedTime}
                  </span>

                  <Link
                    href={`/interview?role=${encodeURIComponent(cat.recommendedRole)}&type=${encodeURIComponent(cat.id === "behavioral" || cat.id === "hr" ? "Behavioral" : "Technical")}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#845CFF] group-hover:text-[#A493FF] transition-colors"
                  >
                    <span>Practice</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
