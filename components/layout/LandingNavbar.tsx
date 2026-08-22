"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span>CareerGrowth<span className="text-indigo-600">.AI</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#interview" className="hover:text-slate-900 transition-colors">AI Video Interview</a>
          <a href="#tech" className="hover:text-slate-900 transition-colors">Free-First Tech</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/resume-analyzer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
