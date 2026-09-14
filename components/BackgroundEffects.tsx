import React from "react";

export default function BackgroundEffects() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Radial Ambient Glows */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(109, 74, 255, 0.12) 0%, rgba(79, 70, 229, 0.05) 45%, transparent 70%)",
        }}
      />

      <div
        className="absolute top-[28%] right-[-10%] w-[750px] h-[750px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, rgba(109, 74, 255, 0.04) 50%, transparent 75%)",
        }}
      />

      <div
        className="absolute bottom-[-15%] left-[20%] w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 92, 255, 0.05) 0%, transparent 65%)",
        }}
      />

      {/* 2. Micro Grid Texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(110, 120, 180, 0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 3. Subtle Faint Orbital Curve Lines */}
      <svg
        className="absolute -top-[15%] -left-[10%] w-[900px] h-[900px] opacity-[0.12] animate-orbit-spin"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="500"
          cy="500"
          r="420"
          stroke="url(#orbitalGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 12"
        />
        <circle
          cx="500"
          cy="500"
          r="320"
          stroke="url(#orbitalGradient)"
          strokeWidth="1"
          strokeDasharray="4 16"
        />
        <defs>
          <linearGradient
            id="orbitalGradient"
            x1="0"
            y1="0"
            x2="1000"
            y2="1000"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D4AFF" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
