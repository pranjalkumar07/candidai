import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

export const getTechLogos = async (techArray: string[]) => {
  if (!Array.isArray(techArray)) return [];

  return techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: normalized
        ? `${techIconBaseURL}/${normalized}/${normalized}-original.svg`
        : "/tech.svg",
    };
  });
};

export const getRandomInterviewCover = (seed?: string) => {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % interviewCovers.length;
    return `/covers${interviewCovers[index]}`;
  }
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export function formatInterviewDuration(params: {
  durationSeconds?: number | null;
  configuredDuration?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
}): string {
  // 1. Prefer actual recorded elapsed duration in seconds from completion
  if (typeof params.durationSeconds === "number" && params.durationSeconds > 0) {
    const mins = Math.floor(params.durationSeconds / 60);
    const secs = params.durationSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  }

  // 2. Or from actual completion timestamps if available
  if (params.startedAt && params.completedAt) {
    const start = new Date(params.startedAt).getTime();
    const end = new Date(params.completedAt).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      const diffSecs = Math.round((end - start) / 1000);
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;
      if (mins === 0) return `${secs}s`;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
    }
  }

  // 3. Fallback to configured target duration in minutes
  if (typeof params.configuredDuration === "number" && params.configuredDuration > 0) {
    return `${params.configuredDuration} min (Target)`;
  }

  // 4. Neither available - NEVER estimate from question count
  return "Duration not available";
}

