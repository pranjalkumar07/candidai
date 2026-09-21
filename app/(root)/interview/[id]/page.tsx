import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Agent from "@/components/Agent";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  // Data isolation: ensure candidate can only access their own interview session
  if (interview.userId !== user.id) redirect("/interviews");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Top Breadcrumb & Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="size-8 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] hover:border-[#6D4AFF]/50 flex items-center justify-center text-[#8F9BB3] hover:text-[#F5F7FF] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#845CFF] font-semibold uppercase tracking-wider">
              <span>Interview Session</span>
              <span>•</span>
              <span className="capitalize">{interview.type || "Technical"}</span>
              {interview.level && (
                <>
                  <span>•</span>
                  <span className="capitalize">{interview.level}</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F7FF] capitalize mt-0.5">
              {interview.role}
            </h1>
          </div>
        </div>

        {feedback && (
          <Link
            href={`/interview/${id}/feedback`}
            className="px-3.5 py-1.5 rounded-lg bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 hover:bg-[#6D4AFF]/20 text-xs font-semibold text-[#845CFF] transition-all shadow-[0_2px_12px_rgba(109,74,255,0.15)]"
          >
            View Evaluation ({feedback.totalScore}%)
          </Link>
        )}
      </div>

      {/* Live Agent Room */}
      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        role={interview.role}
        level={interview.level}
        interviewMode={interview.type}
      />
    </div>
  );
};

export default InterviewDetails;
