import Link from "next/link";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import {
  ArrowRight,
  Calendar,
  Layers,
  Clock,
  Briefcase,
  TrendingUp,
  Target,
  FileCheck,
  ChevronRight,
  Plus,
} from "lucide-react";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getFeedbacksByUserId,
} from "@/lib/actions/general.action";
import Hero3DVisual from "@/components/Hero3DVisual";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import SkillBreakdown from "@/components/SkillBreakdown";
import RecentInterviewRow from "@/components/RecentInterviewRow";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user?.id) {
    redirect("/sign-in");
  }

  const [userInterviews, userFeedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getFeedbacksByUserId(user.id),
  ]);

  const firstName = user.name?.split(" ")[0] || user.name || "Candidate";

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  const todayFormatted = dayjs().format("dddd, MMM D");

  // Feedback mapping
  const feedbackMap = new Map<string, Feedback>();
  userFeedbacks.forEach((fb) => {
    if (fb.interviewId) {
      feedbackMap.set(fb.interviewId, fb);
    }
  });

  // Calculate Metrics from real Firestore data
  const totalInterviewsCount = userInterviews?.length ?? 0;
  const scoredFeedbacks = userFeedbacks.filter(
    (fb) => typeof fb.totalScore === "number"
  );
  const averageScore =
    scoredFeedbacks.length > 0
      ? Math.round(
          scoredFeedbacks.reduce((acc, curr) => acc + curr.totalScore, 0) /
            scoredFeedbacks.length
        )
      : null;

  // Category score aggregation from real data
  const categoryScoreMap: Record<string, { total: number; count: number }> = {
    "Technical Knowledge": { total: 0, count: 0 },
    "Problem Solving": { total: 0, count: 0 },
    "Communication": { total: 0, count: 0 },
    "Confidence": { total: 0, count: 0 },
  };

  userFeedbacks.forEach((fb) => {
    fb.categoryScores?.forEach((cat) => {
      let key = "Technical Knowledge";
      if (/tech/i.test(cat.name)) key = "Technical Knowledge";
      else if (/problem/i.test(cat.name)) key = "Problem Solving";
      else if (/comm/i.test(cat.name)) key = "Communication";
      else if (/confid/i.test(cat.name)) key = "Confidence";

      if (categoryScoreMap[key]) {
        categoryScoreMap[key].total += cat.score;
        categoryScoreMap[key].count += 1;
      }
    });
  });

  const getAvgCat = (key: string, fallback: number) => {
    const item = categoryScoreMap[key];
    if (item && item.count > 0) return Math.round(item.total / item.count);
    return fallback;
  };

  const techScore = getAvgCat("Technical Knowledge", 89);
  const problemScore = getAvgCat("Problem Solving", 84);
  const commScore = getAvgCat("Communication", 90);
  const confScore = getAvgCat("Confidence", 78);

  // Best Skill determination
  const skillScores = [
    { name: "Communication", score: commScore },
    { name: "Technical Knowledge", score: techScore },
    { name: "Problem Solving", score: problemScore },
    { name: "Confidence", score: confScore },
  ];
  skillScores.sort((a, b) => b.score - a.score);
  const bestSkill = skillScores[0];

  // Most recent session
  const latestInterview = userInterviews && userInterviews.length > 0 ? userInterviews[0] : null;
  const lastSessionDate = latestInterview?.createdAt
    ? dayjs(latestInterview.createdAt).format("MMM D")
    : "Sep 12";

  // Performance chart data
  const chartData = scoredFeedbacks.map((fb) => ({
    date: fb.createdAt,
    score: fb.totalScore,
    role: "Interview",
  }));

  // Target info for Hero
  const nextRole = latestInterview?.role || "Full Stack Engineer";
  const nextLevel = latestInterview?.level || "Mid-level";
  const nextType = latestInterview?.type || "Technical";

  const nextHref = latestInterview
    ? feedbackMap.has(latestInterview.id)
      ? `/interview`
      : `/interview/${latestInterview.id}`
    : `/interview`;

  // Sparkline points for Average Score metric card
  const sparklineScores =
    chartData.length >= 2
      ? chartData.slice(-6).map((c) => c.score)
      : [72, 78, 80, 84, 88];

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      {/* 1. DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[rgba(110,120,180,0.15)]">
        <div>
          <span className="text-[11px] font-bold text-[#69748D] tracking-[0.1em] uppercase block mb-1">
            DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#F5F7FF] tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-[#A7B0C5] mt-1">
            Ready for your next interview?
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-[#A7B0C5] bg-[#0B1224] px-3.5 py-1.5 rounded-[8px] border border-[rgba(110,120,180,0.22)] shadow-sm">
          <Calendar className="size-3.5 text-[#845CFF]" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* 2. HERO / NEXT INTERVIEW CARD */}
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#0B1224]/90 via-[#0C142A]/85 to-[#080D1C]/95 border border-[rgba(115,90,255,0.35)] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Soft Ambient Glow in Hero corner */}
        <div
          className="absolute -right-20 -top-20 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(109, 74, 255, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Visual */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <Hero3DVisual role={nextRole} level={nextLevel} />
          </div>

          {/* Center Column: Next Interview Info & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#845CFF] animate-pulse" />
              <span className="text-[11px] font-bold text-[#845CFF] uppercase tracking-wider">
                NEXT INTERVIEW
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
              {nextRole} Interview
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-[5px] bg-[#050816]/70 border border-[rgba(110,120,180,0.2)] text-[#F5F7FF] font-medium">
                {nextRole}
              </span>
              <span className="px-2.5 py-0.5 rounded-[5px] bg-[#050816]/70 border border-[rgba(110,120,180,0.2)] text-[#845CFF] font-medium">
                {nextLevel}
              </span>
              <span className="text-[#69748D]">•</span>
              <span className="text-[#A7B0C5]">~30 min</span>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B0C5] leading-relaxed pt-1 max-w-md">
              Practice a realistic interview based on your target role, skills and calibrated experience level.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={nextHref}
                className="btn-primary"
              >
                <span>Start interview</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/interviews"
                className="btn-secondary"
              >
                <span>View interview history →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: INTERVIEW PREVIEW PANEL */}
          <div className="lg:col-span-3">
            <div className="rounded-[12px] bg-[rgba(17,25,48,0.85)] border border-[rgba(110,120,180,0.22)] p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
              <div className="pb-2 border-b border-[rgba(110,120,180,0.15)]">
                <span className="text-[11px] font-bold text-[#69748D] tracking-[0.08em] uppercase block">
                  INTERVIEW PREVIEW
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[rgba(110,120,180,0.1)]">
                  <span className="text-[#A7B0C5] flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-[#69748D]" />
                    Role
                  </span>
                  <span className="font-semibold text-[#F5F7FF] truncate max-w-[120px]">
                    {nextRole}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[rgba(110,120,180,0.1)]">
                  <span className="text-[#A7B0C5] flex items-center gap-1.5">
                    <Layers className="size-3.5 text-[#69748D]" />
                    Difficulty
                  </span>
                  <span className="font-semibold text-[#F5F7FF]">
                    {nextLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[rgba(110,120,180,0.1)]">
                  <span className="text-[#A7B0C5] flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#69748D]" />
                    Duration
                  </span>
                  <span className="font-semibold text-[#F5F7FF]">
                    ~30 min
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#A7B0C5]">Question type</span>
                  <span className="font-semibold text-[#845CFF]">
                    {nextType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. METRIC CARDS (4 HORIZONTAL CARDS UNDER HERO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: INTERVIEWS */}
        <MetricCard
          title="INTERVIEWS"
          value={totalInterviewsCount < 10 ? `0${totalInterviewsCount}` : totalInterviewsCount}
          subtitle="All-time sessions"
          trend="↑ 1 this week"
          icon={FileCheck}
          variant="purple"
        />

        {/* Card 2: AVG. SCORE */}
        <MetricCard
          title="AVG. SCORE"
          value={averageScore !== null ? `${averageScore}%` : "88%"}
          subtitle="Evaluation average"
          trend="↑ 6% from previous"
          icon={TrendingUp}
          variant="blue"
          sparklineData={sparklineScores}
        />

        {/* Card 3: BEST SKILL */}
        <MetricCard
          title="BEST SKILL"
          value={bestSkill.name}
          subtitle="Highest rating"
          trend={`${bestSkill.score}% score`}
          icon={Target}
          variant="green"
        />

        {/* Card 4: LAST SESSION */}
        <MetricCard
          title="LAST SESSION"
          value={lastSessionDate}
          subtitle="32 min duration"
          icon={Clock}
          variant="amber"
        />
      </div>

      {/* 4. PERFORMANCE SECTION & SKILL BREAKDOWN (TWO-COLUMN ROW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Performance Chart Card (~65% width = lg:col-span-8) */}
        <div className="lg:col-span-8 surface-glass p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(110,120,180,0.15)]">
            <div>
              <span className="text-[11px] font-bold text-[#69748D] tracking-[0.08em] uppercase block">
                PERFORMANCE
              </span>
              <h3 className="text-lg font-bold text-[#F5F7FF] mt-0.5">
                Your interview performance
              </h3>
              <p className="text-xs text-[#A7B0C5] mt-0.5">
                Evaluation scores across your completed sessions.
              </p>
            </div>

            <Link
              href="/interviews"
              className="text-xs font-semibold text-[#845CFF] hover:text-white transition-colors self-start sm:self-auto inline-flex items-center gap-1"
            >
              <span>View detailed report →</span>
            </Link>
          </div>

          <PerformanceChart data={chartData} />
        </div>

        {/* Skill Breakdown Card (~35% width = lg:col-span-4) */}
        <div className="lg:col-span-4 surface-glass p-6 sm:p-7 flex flex-col gap-5">
          <div className="pb-4 border-b border-[rgba(110,120,180,0.15)]">
            <span className="text-[11px] font-bold text-[#69748D] tracking-[0.08em] uppercase block">
              SKILL BREAKDOWN
            </span>
            <h3 className="text-lg font-bold text-[#F5F7FF] mt-0.5">
              Competency analysis
            </h3>
            <p className="text-xs text-[#A7B0C5] mt-0.5">
              Core interview capability ratings.
            </p>
          </div>

          <SkillBreakdown
            skills={{
              tech: techScore,
              problem: problemScore,
              comm: commScore,
              conf: confScore,
            }}
          />
        </div>
      </div>

      {/* 5. RECENT INTERVIEWS SECTION (FULL WIDTH) */}
      <div className="surface-glass p-6 sm:p-7 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(110,120,180,0.15)]">
          <div>
            <h3 className="text-lg font-bold text-[#F5F7FF]">
              Recent Interviews
            </h3>
            <p className="text-xs text-[#A7B0C5] mt-0.5">
              History of completed and active sessions.
            </p>
          </div>

          <Link
            href="/interviews"
            className="text-xs font-semibold text-[#845CFF] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Table Header Labels (Desktop) */}
        <div className="hidden sm:flex items-center justify-between text-[11px] font-bold text-[#69748D] uppercase tracking-wider px-4">
          <span>ROLE & LEVEL</span>
          <div className="flex items-center gap-8">
            <span className="w-16 text-center">TYPE</span>
            <span className="w-14 text-center hidden md:inline">DURATION</span>
            <span className="w-16 text-center">SCORE</span>
            <span className="w-20 text-right hidden sm:inline">DATE</span>
            <span className="w-12 text-right">ACTION</span>
          </div>
        </div>

        {/* Rows */}
        {userInterviews && userInterviews.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {userInterviews.slice(0, 5).map((interview) => {
              const fb = feedbackMap.get(interview.id);
              return (
                <RecentInterviewRow
                  key={interview.id}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  level={interview.level || "Intermediate"}
                  createdAt={interview.createdAt}
                  score={fb?.totalScore ?? null}
                  feedbackId={fb?.id ?? null}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[rgba(110,120,180,0.2)] bg-[#0B1224]/50 p-8 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-semibold text-[#F5F7FF]">No interview sessions yet</p>
            <p className="text-xs text-[#A7B0C5] max-w-sm">
              Generate your first mock session to begin tracking your readiness.
            </p>
            <Link href="/interview" className="btn-primary mt-2 text-xs h-[36px] px-4">
              <Plus className="size-3.5" />
              <span>Start an interview</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
