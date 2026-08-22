"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, FileUp } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith("/resume-analyzer")) return "Resume Analyzer";
    if (pathname.startsWith("/job-match")) return "Job Matcher";
    if (pathname.startsWith("/mock-interview") || pathname.startsWith("/interview")) return "Mock Interview Studio";
    if (pathname.startsWith("/feedback")) return "Performance Feedback";
    if (pathname.startsWith("/roadmap")) return "Learning Roadmap";
    if (pathname.startsWith("/profile")) return "Profile Settings";
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{getPageTitle()}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/resume-analyzer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-xs"
        >
          <FileUp className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload Resume</span>
        </Link>

        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-bold text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm shadow-indigo-200"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Start Mock Interview</span>
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Account / Clerk Avatar */}
        <div className="flex items-center gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
          !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") ? (
            <UserButton />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              SS
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
