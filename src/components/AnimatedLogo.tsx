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
        viewBox="0 0 160 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[120px] sm:w-[160px] h-auto text-[#155fc3] drop-shadow-sm shrink-0"
      >
        {/* Cart Handle & base line */}
        <path
          d="M 5 5 L 12 5 L 18 28 L 56 28 L 64 20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 120,
            strokeDashoffset: mounted ? 0 : 120,
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* The 'S' Shape inside the cart */}
        <path
          d="M 36 12 C 27 12 24 14 24 17 C 24 21 34 21 34 24 C 34 27 28 28 22 26"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 80,
            strokeDashoffset: mounted ? 0 : 80,
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          }}
        />

        {/* The 'O' Shape connecting/beside S */}
        <circle
          cx="48"
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

        {/* Wheels */}
        <circle
          cx="28"
          cy="36"
          r="3.5"
          fill="currentColor"
          className={cn(
            "transition-all duration-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
          style={{ transitionDelay: "0.9s" }}
        />
        <circle
          cx="48"
          cy="36"
          r="3.5"
          fill="currentColor"
          className={cn(
            "transition-all duration-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
          style={{ transitionDelay: "1s" }}
        />

        {/* Text */}
        <text
          x="72"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="currentColor"
          className={cn(
            "transition-all duration-700 tracking-tight",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}
          style={{ transitionDelay: "0.5s" }}
        >
          <tspan>shop OS</tspan>
        </text>
      </svg>
    </div>
  );
}
