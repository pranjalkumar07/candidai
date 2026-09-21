import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  variant?: "purple" | "blue" | "green" | "amber";
  sparklineData?: number[];
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = "purple",
  sparklineData,
}: MetricCardProps) {
  // Gradient styles per variant
  const variantStyles = {
    purple: {
      iconBg: "from-[#6D4AFF]/20 to-[#4F46E5]/10 border-[rgba(109,74,255,0.35)] text-[#845CFF]",
      accent: "#845CFF",
    },
    blue: {
      iconBg: "from-[#3B82F6]/20 to-[#22D3EE]/10 border-[rgba(59,130,246,0.35)] text-[#3B82F6]",
      accent: "#3B82F6",
    },
    green: {
      iconBg: "from-[#22C55E]/20 to-[#10B981]/10 border-[rgba(34,197,94,0.35)] text-[#22C55E]",
      accent: "#22C55E",
    },
    amber: {
      iconBg: "from-[#F5B942]/20 to-[#F59E0B]/10 border-[rgba(245,185,66,0.35)] text-[#F5B942]",
      accent: "#F5B942",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.purple;

  return (
    <div className="surface-glass p-5 flex flex-col justify-between gap-4 group">
      {/* Top Row: Title + Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#69748D] tracking-[0.08em] uppercase">
          {title}
        </span>
        <div
          className={`size-8 rounded-[8px] bg-gradient-to-br border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${currentVariant.iconBg}`}
        >
          <Icon className="size-4" />
        </div>
      </div>

      {/* Center Value */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#F5F7FF] tracking-tight">
          {value}
        </span>

        {/* Optional SVG Miniature Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <svg className="w-16 h-6 overflow-visible opacity-80" viewBox="0 0 60 20">
            <polyline
              fill="none"
              stroke={currentVariant.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklineData
                .map((val, idx) => {
                  const x = (idx / (sparklineData.length - 1)) * 58 + 1;
                  const y = 19 - (val / 100) * 16;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
        )}
      </div>

      {/* Bottom Subtext / Trend */}
      <div className="pt-2 border-t border-[rgba(110,120,180,0.12)] flex items-center justify-between text-xs min-h-[28px]">
        {trend ? (
          <span
            className={`font-semibold flex items-center gap-1 text-[11px] ${
              trend.startsWith("↓") || trend.includes("-")
                ? "text-[#F5B942]"
                : "text-[#22C55E]"
            }`}
          >
            {trend}
          </span>
        ) : (
          <span />
        )}
        {subtitle && (
          <span className="text-[#A7B0C5] text-[11px] ml-auto truncate max-w-[180px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
