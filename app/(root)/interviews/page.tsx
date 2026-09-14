import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getFeedbacksByUserId,
} from "@/lib/actions/general.action";
import InterviewHistoryList from "@/components/InterviewHistoryList";

export const metadata = {
  title: "Interviews — CandidAI",
  description: "View and filter your interview history and performance evaluations.",
};

export default async function InterviewsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const [interviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getFeedbacksByUserId(user.id),
  ]);

  const feedbackMap = new Map<string, Feedback>();
  feedbacks.forEach((fb) => {
    if (fb.interviewId) {
      feedbackMap.set(fb.interviewId, fb);
    }
  });

  const historyItems = (interviews || []).map((i) => {
    const fb = feedbackMap.get(i.id);
    return {
      id: i.id,
      role: i.role,
      type: i.type,
      level: i.level || "Intermediate",
      createdAt: i.createdAt,
      score: fb?.totalScore ?? null,
      feedbackId: fb?.id ?? null,
    };
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide mb-2">
            SESSION LOGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
            Interviews
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1">
            Review past mock interview sessions, evaluate scores, and inspect feedback.
          </p>
        </div>

        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg transition-all self-start sm:self-auto shadow-[0_4px_16px_rgba(109,74,255,0.3)] hover:shadow-[0_4px_22px_rgba(109,74,255,0.45)] cursor-pointer"
        >
          <Plus className="size-4" />
          <span>+ New interview</span>
        </Link>
      </div>

      {/* History List with Search and Filtering */}
      <InterviewHistoryList initialInterviews={historyItems} />
    </div>
  );
}
