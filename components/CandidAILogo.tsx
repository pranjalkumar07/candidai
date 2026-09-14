import React from "react";

interface CandidAILogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const CandidAILogo = ({
  className = "",
  size = 36,
  showText = true,
}: CandidAILogoProps) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Futuristic 'C' Mark */}
      <div
        className="relative flex items-center justify-center rounded-[9px] bg-gradient-to-br from-[#0B1224] to-[#111930] border border-[rgba(115,90,255,0.35)] shrink-0 shadow-[0_2px_12px_rgba(109,74,255,0.25)]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Futuristic 'C' Outline */}
          <path
            d="M24 10.5C22 7.8 18.8 6.5 15 6.5C9.75 6.5 5.5 10.75 5.5 16C5.5 21.25 9.75 25.5 15 25.5C18.8 25.5 22 24.2 24 21.5"
            stroke="url(#candidLogoGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Core AI Intelligence Node */}
          <circle cx="15.5" cy="16" r="2.5" fill="#845CFF" />
          <path
            d="M20.5 13.5C21.8 14.8 22.5 15.8 22.5 16C22.5 16.2 21.8 17.2 20.5 18.5"
            stroke="#22D3EE"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="candidLogoGradient" x1="5.5" y1="6.5" x2="24" y2="25.5">
              <stop stopColor="#F5F7FF" />
              <stop offset="0.6" stopColor="#845CFF" />
              <stop offset="1" stopColor="#6D4AFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex items-center tracking-tight text-[19px] leading-none">
          <span className="font-bold text-[#F5F7FF] tracking-tight">
            Candid
          </span>
          <span className="font-bold text-[#845CFF] ml-0.5">
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default CandidAILogo;
