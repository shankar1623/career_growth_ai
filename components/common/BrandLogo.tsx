import React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp } from "lucide-react";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogo({ href = "/dashboard", size = "md", className = "" }: BrandLogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Sleek Gradient Emblem */}
      <div
        className={`relative rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-300 ${
          isSm ? "w-7 h-7" : isLg ? "w-10 h-10" : "w-8.5 h-8.5"
        }`}
      >
        <div className="w-full h-full bg-slate-950/85 backdrop-blur-xs rounded-[10px] flex items-center justify-center text-white relative overflow-hidden">
          {/* Subtle Ambient Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-cyan-400/20 opacity-80" />
          <div className="relative flex items-center justify-center">
            <TrendingUp className={`${isSm ? "w-3.5 h-3.5" : isLg ? "w-5 h-5" : "w-4 h-4"} text-cyan-300 stroke-[2.5]`} />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Modern Wordmark */}
      <div className="flex items-baseline">
        <span
          className={`font-black tracking-tight text-slate-900 ${
            isSm ? "text-sm" : isLg ? "text-xl" : "text-base"
          }`}
        >
          Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Growth</span>
        </span>
        <span className="ml-1 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
          AI
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
