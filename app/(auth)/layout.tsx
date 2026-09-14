import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Mic, BarChart2, CheckCircle2 } from "lucide-react";

import { isAuthenticated } from "@/lib/actions/auth.action";
import CandidAILogo from "@/components/CandidAILogo";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#050816] text-[#F5F7FF] relative overflow-hidden">
      {/* Left Side: Product Statement & Visual Showcase (Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#080D1C]/60 border-r border-[rgba(255,255,255,0.06)] p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Background glow for auth screen */}
        <div
          className="absolute -top-40 -left-40 size-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(109, 74, 255, 0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-0 size-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <CandidAILogo size={36} />
        </div>

        {/* Center: Value Proposition */}
        <div className="relative z-10 flex flex-col gap-5 my-auto py-8 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[11px] font-bold text-[#845CFF] tracking-wide w-fit">
            <span className="size-1.5 rounded-full bg-[#6D4AFF] animate-pulse" />
            PREPARATION COCKPIT
          </span>

          <h1 className="text-3xl xl:text-4xl font-bold text-[#F5F7FF] tracking-tight leading-tight">
            Your next interview starts here.
          </h1>

          <p className="text-sm xl:text-base text-[#8F9BB3] leading-relaxed">
            Practice realistic AI mock interviews, receive instantaneous evaluation reports, and track your readiness trajectory.
          </p>

          {/* Feature highlights */}
          <div className="space-y-3 pt-3">
            <div className="surface-glass p-3.5 flex items-center gap-3.5">
              <div className="size-8 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#845CFF] shrink-0">
                <Mic className="size-4" />
              </div>
              <span className="text-xs sm:text-sm text-[#CBD5E1]">
                Realistic voice agent sessions tailored to your target role
              </span>
            </div>

            <div className="surface-glass p-3.5 flex items-center gap-3.5">
              <div className="size-8 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#3B82F6] shrink-0">
                <BarChart2 className="size-4" />
              </div>
              <span className="text-xs sm:text-sm text-[#CBD5E1]">
                Structured competency scoring and actionable improvement reports
              </span>
            </div>

            <div className="surface-glass p-3.5 flex items-center gap-3.5">
              <div className="size-8 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#22C55E] shrink-0">
                <CheckCircle2 className="size-4" />
              </div>
              <span className="text-xs sm:text-sm text-[#CBD5E1]">
                Personalized questions calibrated to your experience level
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Tagline & Copyright */}
        <div className="relative z-10 text-xs text-[#69748D]">
          <span>&copy; {new Date().getFullYear()} CandidAI. Practice smarter. Interview with confidence.</span>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex justify-center mb-8">
            <CandidAILogo size={36} />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
