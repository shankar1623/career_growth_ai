"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, FileUp } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith("/resume-analyzer")) return "AI Resume Analyzer";
    if (pathname.startsWith("/job-match")) return "Job Description Matcher";
    if (pathname.startsWith("/mock-interview") || pathname.startsWith("/interview")) return "AI Mock Interview Studio";
    if (pathname.startsWith("/feedback")) return "Performance Feedback";
    if (pathname.startsWith("/roadmap")) return "Personalized Learning Roadmap";
    if (pathname.startsWith("/profile")) return "Account & Preferences";
    return "Career Intelligence Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/resume-analyzer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
        >
          <FileUp className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload Resume</span>
        </Link>

        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-200"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Start Mock Interview</span>
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Account / Clerk Avatar with fallback */}
        <div className="flex items-center gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
          !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") ? (
            <UserButton />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
              AC
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
