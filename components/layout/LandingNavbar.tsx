"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export function LandingNavbar() {
  return (
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo href="/" size="md" />

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#workflow" className="hover:text-indigo-600 transition-colors">Workflow</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#interview" className="hover:text-indigo-600 transition-colors">AI Video Interview</a>
          <a href="#tech" className="hover:text-indigo-600 transition-colors">Free-First Tech</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/resume-analyzer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-bold text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm shadow-indigo-200"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
