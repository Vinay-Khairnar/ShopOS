"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AnimatedLogo({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Small delay to ensure CSS transition triggers after initial render
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      <svg
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[140px] sm:w-[180px] h-auto text-[#155fc3] drop-shadow-sm shrink-0 overflow-visible"
      >
        {/* Left 'shop' text */}
        <text
          x="5"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="currentColor"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-15px)",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s",
          }}
          className="tracking-tight"
        >
          <tspan>shop</tspan>
        </text>

        {/* Group for Cart & OS moving left-to-right */}
        <g
          style={{
            transform: mounted ? "translateX(0)" : "translateX(-40px)",
            opacity: mounted ? 1 : 0,
            transition: "all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          {/* Cart Handle & base line (+70 X offset) */}
          <path
            d="M 65 5 L 72 5 L 78 28 L 116 28 L 124 20"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 120,
              strokeDashoffset: mounted ? 0 : 120,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            }}
          />

          {/* The 'O' Shape inside the cart (Left side) */}
          <circle
            cx="88"
            cy="18"
            r="8"
            stroke="currentColor"
            strokeWidth="4"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: mounted ? 0 : 60,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s",
            }}
          />

          {/* The 'S' Shape beside O (Right side) */}
          <path
            d="M 118 12 C 109 12 106 14 106 17 C 106 21 116 21 116 24 C 116 27 110 28 104 26"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 80,
              strokeDashoffset: mounted ? 0 : 80,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.9s",
            }}
          />

          {/* Wheels */}
          <circle
            cx="88"
            cy="36"
            r="3.5"
            fill="currentColor"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-8px)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s",
            }}
          />
          <circle
            cx="108"
            cy="36"
            r="3.5"
            fill="currentColor"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-8px)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.3s",
            }}
          />
        </g>
      </svg>
    </div>
  );
}
