"use client";

import { useState } from "react";
import dayjs from "dayjs";

interface ScorePoint {
  date: string;
  score: number;
  role: string;
}

interface PerformanceChartProps {
  data: ScorePoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    score: number;
    date: string;
    role: string;
    x: number;
    y: number;
  } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[rgba(110,120,180,0.22)] rounded-[12px] bg-[rgba(11,18,36,0.5)]">
        <p className="text-xs text-[#A7B0C5] max-w-xs">
          Complete your next interview to unlock your live performance trajectory.
        </p>
      </div>
    );
  }

  // Reverse so chronological order left to right
  const points = [...data].reverse().slice(-7);

  const width = 540;
  const height = 190;
  const paddingX = 40;
  const paddingY = 32;

  const minScore = 40;
  const maxScore = 100;

  const getX = (index: number) => {
    if (points.length === 1) return width / 2;
    return paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
  };

  const getY = (score: number) => {
    const clamped = Math.max(minScore, Math.min(score, maxScore));
    return (
      height -
      paddingY -
      ((clamped - minScore) / (maxScore - minScore)) * (height - paddingY * 2)
    );
  };

  // Generate smooth cubic bezier SVG path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const coords = points.map((p, i) => ({ x: getX(i), y: getY(p.score) }));
  const smoothPathD = createSmoothPath(coords);
  const areaPathD =
    points.length > 1
      ? `${smoothPathD} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`
      : "";

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {/* Floating Interactive Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-[8px] bg-[#0B1224]/95 border border-[rgba(115,90,255,0.4)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-xs flex flex-col gap-0.5 transition-all duration-150 -translate-x-1/2 -translate-y-12 backdrop-blur-md"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F5F7FF]">Session #{hoveredPoint.index + 1}</span>
            <span className="text-[#22C55E] font-bold">{hoveredPoint.score}%</span>
          </div>
          <span className="text-[10px] text-[#69748D]">
            {hoveredPoint.date ? dayjs(hoveredPoint.date).format("MMM D, YYYY") : "Recent interview"}
          </span>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[190px] overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="chartGlowArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0B1224" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6D4AFF" />
              <stop offset="70%" stopColor="#845CFF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* Horizontal grid guide lines */}
          <line
            x1={paddingX}
            y1={getY(100)}
            x2={width - paddingX}
            y2={getY(100)}
            stroke="rgba(110, 120, 180, 0.15)"
            strokeDasharray="4 4"
          />
          <text
            x={paddingX - 10}
            y={getY(100) + 3}
            fill="#69748D"
            fontSize="10"
            fontWeight="500"
            textAnchor="end"
          >
            100%
          </text>

          <line
            x1={paddingX}
            y1={getY(70)}
            x2={width - paddingX}
            y2={getY(70)}
            stroke="rgba(110, 120, 180, 0.15)"
            strokeDasharray="4 4"
          />
          <text
            x={paddingX - 10}
            y={getY(70) + 3}
            fill="#69748D"
            fontSize="10"
            fontWeight="500"
            textAnchor="end"
          >
            70%
          </text>

          {/* Smooth area fill under curve */}
          {areaPathD && <path d={areaPathD} fill="url(#chartGlowArea)" />}

          {/* Smooth spline stroke */}
          <path
            d={smoothPathD}
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_2px_8px_rgba(109,74,255,0.4)]"
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.score);
            const isHovered = hoveredPoint?.index === i;
            const isLast = i === points.length - 1;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() =>
                  setHoveredPoint({
                    index: i,
                    score: p.score,
                    date: p.date,
                    role: p.role,
                    x: cx,
                    y: cy,
                  })
                }
              >
                {/* Glow ring on hover or latest */}
                {(isHovered || isLast) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? "11" : "8"}
                    fill={isLast ? "#22D3EE" : "#845CFF"}
                    opacity={isHovered ? "0.4" : "0.22"}
                    className="transition-all duration-200"
                  />
                )}
                {/* Core Point Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "5.5" : "4.5"}
                  fill="#0B1224"
                  stroke={isLast ? "#22D3EE" : isHovered ? "#845CFF" : "#6D4AFF"}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {/* Score Text above point */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill={isHovered ? "#FFFFFF" : "#F5F7FF"}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.score}%
                </text>
                {/* Date Text at bottom axis */}
                <text
                  x={cx}
                  y={height - 10}
                  fill="#69748D"
                  fontSize="10"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {p.date ? dayjs(p.date).format("MMM D") : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
