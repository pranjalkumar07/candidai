"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  Briefcase,
  Layers,
  Code2,
  Users2,
  Cpu,
  Plus,
  X,
  Loader2,
  Mic,
  ArrowRight,
  Check,
} from "lucide-react";
import Agent from "./Agent";

interface CreateInterviewFormProps {
  userName: string;
  userId: string;
}

const POPULAR_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI / ML Engineer",
  "DevOps Engineer",
  "Mobile Developer",
];

const EXPERIENCE_LEVELS = [
  { id: "Junior", label: "Junior", desc: "0 - 2 years experience" },
  { id: "Mid-level", label: "Intermediate", desc: "2 - 5 years experience" },
  { id: "Senior", label: "Senior", desc: "5 - 8+ years experience" },
  { id: "Lead", label: "Lead / Staff", desc: "Architecture & leadership" },
];

const POPULAR_TECHS = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
  "AWS",
  "GraphQL",
];

const INTERVIEW_MODES = [
  {
    id: "Technical",
    title: "Technical",
    icon: Code2,
    desc: "Coding concepts, architecture, debugging, and system implementation.",
  },
  {
    id: "Behavioral",
    title: "Behavioral",
    icon: Users2,
    desc: "STAR method, team communication, ownership, and decision making.",
  },
  {
    id: "Mixed",
    title: "Mixed",
    icon: Cpu,
    desc: "Balanced combination of technical problem solving and leadership scenarios.",
  },
];

const QUESTION_COUNTS = [3, 5, 7, 10];

export default function CreateInterviewForm({
  userName,
  userId,
}: CreateInterviewFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole = searchParams.get("role") || "Full Stack Engineer";
  const initialType = (searchParams.get("type") as "Technical" | "Behavioral" | "Mixed") || "Mixed";

  const [role, setRole] = useState(initialRole);
  const [level, setLevel] = useState("Mid-level");
  const [techStack, setTechStack] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
  ]);
  const [techInput, setTechInput] = useState("");
  const [interviewMode, setInterviewMode] = useState<"Technical" | "Behavioral" | "Mixed">(initialType);
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useVoiceMode, setUseVoiceMode] = useState(false);

  const handleAddTech = (techToAdd: string) => {
    const trimmed = techToAdd.trim();
    if (!trimmed) return;
    if (!techStack.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setTechStack([...techStack, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  const handleGenerate = async () => {
    if (!role.trim()) {
      toast.error("Please specify a target role.");
      return;
    }

    if (techStack.length === 0) {
      toast.error("Please add at least one technology or topic focus.");
      return;
    }

    setIsGenerating(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          techstack: techStack.join(", "),
          type: interviewMode,
          amount: questionCount,
          userid: userId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok || !data.success || !data.interviewId) {
        throw new Error(data.message || "Failed to generate interview questions");
      }

      toast.success("Interview session created. Redirecting to room...");
      router.push(`/interview/${data.interviewId}`);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const err = error as Error;
      if (err.name === "AbortError") {
        toast.error("Generation timed out. Please check your network connection and try again.");
      } else {
        toast.error(err.message || "An error occurred while generating interview.");
      }
      setIsGenerating(false);
    }
  };

  const estimatedMinutes = questionCount * 3;

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Top Step Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          {/* Step Breadcrumb Indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide">
              <span className="size-1.5 rounded-full bg-[#6D4AFF] animate-pulse shadow-[0_0_8px_#6D4AFF]" />
              01 SETUP
            </span>
            <span className="text-[#69748D] text-xs">•</span>
            <span className="text-xs font-medium text-[#69748D]">02 REVIEW</span>
            <span className="text-[#69748D] text-xs">•</span>
            <span className="text-xs font-medium text-[#69748D]">03 START</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
            Build Your Interview
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1">
            Configure your target role, experience level, and core focus areas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUseVoiceMode(!useVoiceMode)}
          className={`inline-flex items-center gap-2 h-9 px-4 text-xs font-semibold rounded-lg border transition-all cursor-pointer self-start sm:self-auto ${
            useVoiceMode
              ? "bg-[#6D4AFF]/15 text-[#845CFF] border-[#6D4AFF]/40 shadow-[0_2px_12px_rgba(109,74,255,0.25)]"
              : "bg-[#0B1224] text-[#8F9BB3] border-[rgba(110,120,180,0.22)] hover:text-[#F5F7FF] hover:border-[rgba(110,120,180,0.4)]"
          }`}
        >
          <Mic className="size-3.5 text-[#845CFF]" />
          <span>{useVoiceMode ? "Switch to Form" : "Voice Setup"}</span>
        </button>
      </div>

      {useVoiceMode ? (
        <div className="surface-glass p-8 flex flex-col items-center justify-center">
          <div className="max-w-md text-center mb-6">
            <h3 className="text-base font-bold text-[#F5F7FF] mb-1">Voice Configuration</h3>
            <p className="text-xs text-[#8F9BB3]">
              Speak directly with the voice assistant to configure your session.
            </p>
          </div>
          <Agent userName={userName} userId={userId} type="generate" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Configuration */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* 1. ROLE */}
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-md bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[11px] font-bold text-[#845CFF] flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">Which role are you preparing for?</h3>
                  <p className="text-xs text-[#69748D]">Target position title</p>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#0B1224] border border-[rgba(110,120,180,0.22)] focus:border-[#6D4AFF] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F7FF] placeholder:text-[#69748D] outline-none transition-colors"
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      role === r
                        ? "bg-[#6D4AFF]/15 border-[#6D4AFF]/40 text-[#845CFF]"
                        : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:text-[#F5F7FF] hover:border-[rgba(110,120,180,0.4)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. EXPERIENCE LEVEL */}
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-md bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[11px] font-bold text-[#845CFF] flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">What&apos;s your experience level?</h3>
                  <p className="text-xs text-[#69748D]">Question difficulty calibration</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      level === lvl.id
                        ? "bg-[#6D4AFF]/15 border-[#6D4AFF] text-[#F5F7FF] shadow-[0_0_16px_rgba(109,74,255,0.25)]"
                        : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:border-[rgba(110,120,180,0.4)] hover:text-[#F5F7FF]"
                    }`}
                  >
                    <span className="text-xs font-bold block">{lvl.label}</span>
                    <span className="text-[10px] text-[#69748D] mt-1 block leading-tight">
                      {lvl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. TECHNOLOGIES */}
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-md bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[11px] font-bold text-[#845CFF] flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">What technologies should we focus on?</h3>
                  <p className="text-xs text-[#69748D]">Add programming languages, frameworks, or architecture topics</p>
                </div>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech(techInput);
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. Next.js, Docker)"
                  className="flex-1 bg-[#0B1224] border border-[rgba(110,120,180,0.22)] focus:border-[#6D4AFF] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#F5F7FF] placeholder:text-[#69748D] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleAddTech(techInput)}
                  className="px-4 py-2 bg-[#6D4AFF]/15 hover:bg-[#6D4AFF]/25 text-[#845CFF] hover:text-white text-xs font-semibold rounded-lg border border-[#6D4AFF]/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Selected Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-7">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-xs text-[#F5F7FF]"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-[#69748D] hover:text-[#EF4444] transition-colors cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-[rgba(110,120,180,0.15)]">
                <span className="text-[11px] text-[#69748D] block mb-1.5">
                  Popular topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TECHS.map((tech) => {
                    const isSelected = techStack.some(
                      (t) => t.toLowerCase() === tech.toLowerCase()
                    );
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() =>
                          isSelected ? handleRemoveTech(tech) : handleAddTech(tech)
                        }
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#6D4AFF]/15 border-[#6D4AFF]/30 text-[#845CFF]"
                            : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:text-[#F5F7FF] hover:border-[rgba(110,120,180,0.4)]"
                        }`}
                      >
                        {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. INTERVIEW MODE */}
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-md bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[11px] font-bold text-[#845CFF] flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">Interview Mode</h3>
                  <p className="text-xs text-[#69748D]">Select the category focus of questions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {INTERVIEW_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = interviewMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        setInterviewMode(mode.id as "Technical" | "Behavioral" | "Mixed")
                      }
                      className={`p-4 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#6D4AFF]/15 border-[#6D4AFF] text-[#F5F7FF] shadow-[0_0_16px_rgba(109,74,255,0.25)]"
                          : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:border-[rgba(110,120,180,0.4)] hover:text-[#F5F7FF]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <Icon className={`size-4 ${isSelected ? "text-[#845CFF]" : "text-[#69748D]"}`} />
                        {isSelected && <Check className="size-3.5 text-[#845CFF]" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{mode.title}</span>
                        <span className="text-[10px] text-[#69748D] mt-1 block leading-tight">
                          {mode.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. QUESTION COUNT */}
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-md bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[11px] font-bold text-[#845CFF] flex items-center justify-center">
                  5
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FF]">Question Count</h3>
                  <p className="text-xs text-[#69748D]">Session length calibration</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                      questionCount === count
                        ? "bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] text-white border-[#6D4AFF] shadow-[0_0_14px_rgba(109,74,255,0.35)]"
                        : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:border-[rgba(110,120,180,0.4)] hover:text-[#F5F7FF]"
                    }`}
                  >
                    <span>{count}</span>
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                      ~{count * 3} min
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: INTERVIEW PREVIEW PANEL */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="surface-glass p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
              <div className="pb-3 border-b border-[rgba(110,120,180,0.15)]">
                <span className="text-[11px] font-bold text-[#845CFF] uppercase tracking-wider block">
                  INTERVIEW PREVIEW
                </span>
                <h3 className="text-sm font-bold text-[#F5F7FF] mt-0.5">Configuration Summary</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-start gap-2 py-1.5 border-b border-[rgba(110,120,180,0.12)]">
                  <span className="text-[#8F9BB3] flex items-center gap-1.5">
                    <Briefcase className="size-3 text-[#69748D]" />
                    Role
                  </span>
                  <span className="font-semibold text-[#F5F7FF] text-right truncate max-w-[170px]">
                    {role || "Unspecified"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-[rgba(110,120,180,0.12)]">
                  <span className="text-[#8F9BB3] flex items-center gap-1.5">
                    <Layers className="size-3 text-[#69748D]" />
                    Level
                  </span>
                  <span className="font-semibold text-[#F5F7FF]">{level}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-[rgba(110,120,180,0.12)]">
                  <span className="text-[#8F9BB3] flex items-center gap-1.5">
                    <Cpu className="size-3 text-[#69748D]" />
                    Mode
                  </span>
                  <span className="font-semibold text-[#845CFF]">{interviewMode}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-[rgba(110,120,180,0.12)]">
                  <span className="text-[#8F9BB3]">Questions</span>
                  <span className="font-semibold text-[#F5F7FF]">{questionCount} questions</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-[rgba(110,120,180,0.12)]">
                  <span className="text-[#8F9BB3] flex items-center gap-1.5">
                    <Clock className="size-3 text-[#69748D]" />
                    Duration
                  </span>
                  <span className="font-semibold text-[#F5F7FF]">~{estimatedMinutes} min</span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-[#69748D] block mb-1.5">Focus areas:</span>
                  <div className="flex flex-wrap gap-1">
                    {techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#CBD5E1]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-2 h-11 bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] text-white font-semibold text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(109,74,255,0.35)] hover:shadow-[0_4px_28px_rgba(109,74,255,0.5)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Generating questions...</span>
                  </>
                ) : (
                  <>
                    <span>Generate interview</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
