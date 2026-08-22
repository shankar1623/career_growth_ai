"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, FileUp, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.startsWith("/resume-analyzer")) {
      return { title: "Resume ATS Analyzer", category: "Diagnostics" };
    }
    if (pathname.startsWith("/job-match")) {
      return { title: "Job Description Matcher", category: "Target Role" };
    }
    if (pathname.startsWith("/mock-interview") || pathname.startsWith("/interview")) {
      return { title: "5-Round Mock Interview Studio", category: "Simulation" };
    }
    if (pathname.startsWith("/feedback")) {
      return { title: "Performance & Answer Feedback", category: "Analytics" };
    }
    if (pathname.startsWith("/roadmap")) {
      return { title: "Personalized Learning Roadmap", category: "Milestones" };
    }
    if (pathname.startsWith("/profile")) {
      return { title: "Account & Career Profile", category: "Settings" };
    }
    return { title: "Dashboard", category: "Overview" };
  };

  const { title, category } = getPageInfo();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-lg text-[10px]">
            {category}
          </span>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-black text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/resume-analyzer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs active:scale-95"
        >
          <FileUp className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload Resume</span>
        </Link>

        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25 active:scale-95"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Mock Interview</span>
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Account / Clerk Avatar */}
        <div className="flex items-center gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
          !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") ? (
            <UserButton />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
              SS
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
