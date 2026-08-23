"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Target,
  Video,
  MessageSquareCheck,
  Compass,
  User,
  Sparkles,
  FileUp,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText, badge: "ATS" },
  { name: "Job Match", href: "/job-match", icon: Target, badge: null },
  { name: "Mock Interview", href: "/mock-interview", icon: Video, badge: "LIVE" },
  { name: "Feedback", href: "/feedback", icon: MessageSquareCheck, badge: null },
  { name: "Learning Roadmap", href: "/roadmap", icon: Compass, badge: "4-Wk" },
  { name: "Profile", href: "/profile", icon: User, badge: null },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Header Bar */}
      <div className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800 px-3 sm:px-6 flex items-center justify-between shadow-2xs">
        {/* Left Side: 3-line Menu Button + Brand Logo (Mobile) / Breadcrumb (Desktop) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile 3-line Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700 transition-all active:scale-95 shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Brand Logo */}
          <div className="flex lg:hidden shrink-0">
            <BrandLogo size="sm" href="/dashboard" />
          </div>

          {/* Desktop Breadcrumb Navigation */}
          <div className="hidden lg:flex items-center gap-2 text-xs min-w-0">
            <span className="font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2 py-0.5 rounded-lg text-[10px] shrink-0">
              {category}
            </span>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <h1 className="text-sm font-black text-stone-900 dark:text-stone-100 tracking-tight truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Side: Action Buttons + Theme Toggle + User Avatar */}
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
            <span className="hidden sm:inline">Mock Interview</span>
            <span className="inline sm:hidden">Interview</span>
          </Link>

          <div className="h-5 w-px bg-stone-200 dark:bg-stone-700 mx-0.5 sm:mx-1 hidden xs:block" />

          {/* Theme Mode Switcher */}
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
      </div>

      {/* Mobile Slide-Down Dropdown Menu (Visible on screens < 1024px when 3-lines menu clicked) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-stone-200 dark:border-slate-800 p-4 shadow-2xl space-y-2 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300"
          >
            <div className="px-3 py-1.5 text-[10px] font-black tracking-wider text-stone-400 dark:text-slate-500 uppercase flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-2 mb-2">
              <span>Platform Navigation</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-98",
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-black"
                        : "text-stone-700 dark:text-slate-200 hover:bg-stone-100/80 dark:hover:bg-slate-800/80"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "text-stone-500 dark:text-slate-400"
                      )}
                    />
                    <span className="truncate">{item.name}</span>

                    {item.badge && (
                      <span
                        className={cn(
                          "ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                          isActive
                            ? "bg-white/20 text-white border border-white/30"
                            : item.badge === "LIVE"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-slate-500 px-2 font-medium">
              <span>CareerGrowth AI Studio</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Close Menu &times;
              </button>
            </div>
          </div>

          {/* Backdrop click to dismiss */}
          <div
            className="h-full w-full"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  );
}
