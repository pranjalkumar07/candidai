import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import PracticeWorkspace from "@/components/PracticeWorkspace";

export const metadata = {
  title: "Practice — CandidAI",
  description: "Targeted interview preparation workspace across technical, system design, DSA, and behavioral topics.",
};

export default async function PracticePage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide mb-2">
            DRILL WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
            Targeted Practice
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9BB3] mt-1">
            Hone specific interview capabilities across architecture, coding algorithms, and leadership scenarios.
          </p>
        </div>
      </div>

      <PracticeWorkspace />
    </div>
  );
}
