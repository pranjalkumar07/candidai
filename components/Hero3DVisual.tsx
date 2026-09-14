"use client";

import React from "react";
import { UserCheck, ShieldCheck } from "lucide-react";

interface Hero3DVisualProps {
  role?: string;
  level?: string;
}

export default function Hero3DVisual({
  role = "Full Stack Engineer",
  level = "Mid-level",
}: Hero3DVisualProps) {
  return (
    <div className="relative w-full max-w-[320px] h-[220px] flex items-center justify-center select-none perspective-[1000px]">
      {/* Ambient Radial Glow Behind 3D Card */}
      <div
        className="absolute inset-0 rounded-full filter blur-2xl opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(109, 74, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)",
        }}
      />

      {/* Rotating Background Orbital Ring */}
      <div className="absolute size-44 rounded-full border border-[rgba(115,90,255,0.25)] border-dashed animate-orbit-spin pointer-events-none" />

      {/* Main 3D Floating Candidate Profile Card */}
      <div className="relative z-10 w-[270px] rounded-[14px] bg-gradient-to-br from-[#0B1224] to-[#121A33] border border-[rgba(115,90,255,0.35)] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.5)] animate-float-3d">
        {/* Card Header with Status */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(110,120,180,0.15)]">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-[7px] bg-gradient-to-br from-[#6D4AFF] to-[#3B82F6] flex items-center justify-center text-white shadow-sm">
              <UserCheck className="size-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#F5F7FF] block leading-tight">
                AI Candidate
              </span>
              <span className="text-[9px] text-[#69748D] block">
                Telemetry Active
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[9px] font-semibold text-[#22C55E]">
            <span className="size-1 rounded-full bg-[#22C55E] animate-pulse" />
            Calibrated
          </span>
        </div>

        {/* Role & Level Specs */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A7B0C5]">Target Focus:</span>
            <span className="font-semibold text-[#F5F7FF] truncate max-w-[130px]">{role}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A7B0C5]">Calibration:</span>
            <span className="font-semibold text-[#845CFF]">{level}</span>
          </div>
        </div>

        {/* Floating Mini Tech Tags */}
        <div className="pt-2 border-t border-[rgba(110,120,180,0.15)] flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-[5px] bg-[#050816]/70 border border-[rgba(110,120,180,0.18)] text-[9px] text-[#A7B0C5]">
            React 19
          </span>
          <span className="px-2 py-0.5 rounded-[5px] bg-[#050816]/70 border border-[rgba(110,120,180,0.18)] text-[9px] text-[#A7B0C5]">
            Node.js
          </span>
          <span className="px-2 py-0.5 rounded-[5px] bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-[9px] text-[#845CFF] font-medium ml-auto">
            92% Match
          </span>
        </div>
      </div>

      {/* Floating Auxiliary Glass Fragment (3D depth layer) */}
      <div
        className="absolute -bottom-2 -right-2 z-20 px-3 py-1.5 rounded-[8px] bg-[#080D1C]/90 backdrop-blur-md border border-[rgba(59,130,246,0.35)] shadow-lg flex items-center gap-2 text-[10px] text-[#F5F7FF] font-medium"
        style={{
          transform: "perspective(800px) translate3d(10px, 10px, 20px)",
        }}
      >
        <ShieldCheck className="size-3 text-[#22D3EE]" />
        <span>STAR Evaluator Ready</span>
      </div>
    </div>
  );
}
