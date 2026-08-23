"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, FileUp, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function AppHeader({ onToggleMobileMenu }: AppHeaderProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.startsWith("/resume-analyzer")) {
      return { title: "Resume ATS Analyzer", category: "Diagnostics" };
    }
    if (pathname.startsWith("/job-match")) {
      return { title: "Job Description Matcher", category: "Target Role" };
    }
    if (pathname.startsWith("/mock-interview") || pathname.startsWith("/interview")) {
      return { title: "Mock Interview Studio", category: "Simulation" };
    }
    if (pathname.startsWith("/feedback")) {
      return { title: "Answer Feedback", category: "Analytics" };
    }
    if (pathname.startsWith("/roadmap")) {
      return { title: "Learning Roadmap", category: "Milestones" };
    }
    if (pathname.startsWith("/profile")) {
      return { title: "Career Profile", category: "Settings" };
    }
    return { title: "Dashboard", category: "Overview" };
  };

  const { title, category } = getPageInfo();

  return (
    <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors duration-200 w-full shrink-0">
      {/* Left side: Hamburger button + Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open mobile menu"
            className="lg:hidden p-2 rounded-xl border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
          <span className="hidden sm:inline-block font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2 py-0.5 rounded-lg text-[10px] shrink-0">
            {category}
          </span>
          <span className="hidden sm:inline-block text-stone-300 dark:text-stone-700">/</span>
          <h1 className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 tracking-tight truncate max-w-[140px] sm:max-w-[220px] md:max-w-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Action Buttons + Theme Toggle + User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Link
          href="/resume-analyzer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-300 transition-all shadow-xs active:scale-95"
        >
          <FileUp className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
          <span>Upload Resume</span>
        </Link>

        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25 active:scale-95 shrink-0"
        >
          <Video className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xs:inline sm:inline">Mock Interview</span>
          <span className="inline xs:hidden sm:hidden">Interview</span>
        </Link>

        <div className="h-5 w-px bg-stone-200 dark:bg-stone-700 mx-0.5 sm:mx-1 hidden xs:block" />

        {/* Top Right Dark/Light Mode Switcher */}
        <ThemeToggle />

        {/* User Account / Clerk Avatar */}
        <div className="flex items-center gap-2 shrink-0">
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
