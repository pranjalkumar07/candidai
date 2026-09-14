"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Menu, X } from "lucide-react";
import SignOutButton from "./SignOutButton";
import Sidebar from "./Sidebar";

interface TopHeaderProps {
  userName?: string;
}

export default function TopHeader({ userName = "Candidate" }: TopHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CA";

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-[60px] bg-[#050816]/80 backdrop-blur-md border-b border-[rgba(110,120,180,0.18)] flex items-center justify-between px-4 sm:px-8">
        {/* Left Side: Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden size-9 rounded-[8px] bg-[#0B1224] border border-[rgba(110,120,180,0.22)] flex items-center justify-center text-[#A7B0C5] hover:text-[#F5F7FF] transition-colors"
            title="Toggle navigation"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {/* Right Side: + New Interview CTA, Avatar, Sign Out */}
        <div className="flex items-center gap-3.5 ml-auto">
          {/* + New Interview CTA */}
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 h-[38px] px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#845CFF] hover:to-[#6D4AFF] rounded-[8px] transition-all duration-200 shadow-[0_4px_16px_rgba(109,74,255,0.35)] hover:shadow-[0_6px_22px_rgba(109,74,255,0.45)] hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>+ New interview</span>
          </Link>

          {/* User Profile Avatar */}
          <div
            className="size-[36px] rounded-full bg-gradient-to-b from-[#0B1224] to-[#111930] border border-[rgba(115,90,255,0.35)] flex items-center justify-center text-xs font-bold text-[#F5F7FF] shadow-sm select-none"
            title={userName}
          >
            {initials}
          </div>

          {/* Sign Out Button */}
          <SignOutButton />
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
