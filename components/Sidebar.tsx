"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Code2,
  Zap,
  X,
} from "lucide-react";
import CandidAILogo from "./CandidAILogo";

interface SidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Interviews",
    href: "/interviews",
    icon: Layers,
  },
  {
    name: "Practice",
    href: "/practice",
    icon: Code2,
  },
];

export default function Sidebar({ onCloseMobile, className = "" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-[240px] h-screen flex flex-col justify-between bg-[#080D1C] md:bg-[#080D1C]/90 backdrop-blur-xl border-r border-[rgba(110,120,180,0.18)] select-none shrink-0 z-40 transition-all duration-300 overflow-y-auto ${className}`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-[64px] flex items-center justify-between px-5 border-b border-[rgba(110,120,180,0.15)]">
          <Link href="/" onClick={onCloseMobile} className="flex items-center">
            <CandidAILogo size={32} />
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden size-8 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#A7B0C5] hover:text-[#F5F7FF] transition-colors cursor-pointer"
              title="Close navigation"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-6 flex flex-col gap-1.5">
          <span className="px-3 text-[10px] font-bold text-[#69748D] tracking-[0.1em] uppercase mb-1 block">
            NAVIGATION
          </span>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-180 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[rgba(109,74,255,0.18)] to-[rgba(79,70,229,0.08)] text-[#F5F7FF] font-semibold border-l-2 border-[#6D4AFF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                    : "text-[#A7B0C5] hover:text-[#F5F7FF] hover:bg-[rgba(26,36,68,0.45)] border-l-2 border-transparent"
                }`}
              >
                <Icon
                  className={`size-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-[#845CFF]"
                      : "text-[#69748D] group-hover:text-[#A7B0C5]"
                  }`}
                />
                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#845CFF] shadow-[0_0_8px_#845CFF]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Atmosphere & Status Badge */}
      <div className="p-4 relative overflow-hidden">
        {/* Subtle Purple Glow behind card */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(109, 74, 255, 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative rounded-[10px] bg-gradient-to-b from-[#0B1224] to-[#0E172E] border border-[rgba(110,120,180,0.18)] p-3.5 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#845CFF]">
              <Zap className="size-3 text-[#845CFF]" />
              AI Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#22C55E]">
              <span className="size-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-[#A7B0C5] leading-relaxed">
            Gemini & Voice models calibrated for real-time practice.
          </p>
        </div>
      </div>
    </aside>
  );
}
