"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Target,
  Video,
  MessageSquareCheck,
  Compass,
  History,
  User,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/BrandLogo";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText, badge: "ATS" },
  { name: "Job Match", href: "/job-match", icon: Target, badge: null },
  { name: "Mock Interview", href: "/mock-interview", icon: Video, badge: "LIVE" },
  { name: "Feedback", href: "/feedback", icon: MessageSquareCheck, badge: null },
  { name: "Learning Roadmap", href: "/roadmap", icon: Compass, badge: "4-Wk" },
  { name: "History", href: "/history", icon: History, badge: "ALL" },
  { name: "Profile", href: "/profile", icon: User, badge: null },
];

interface AppSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isMobile = false, isOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-stone-100/90 dark:border-slate-800/80 shrink-0 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 transition-colors duration-200">
        <BrandLogo href="/dashboard" />
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-black tracking-wider text-stone-400 dark:text-slate-500 uppercase flex items-center justify-between">
          <span>Platform Modules</span>
          <Sparkles className="w-3 h-3 text-indigo-500" />
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 relative group",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-extrabold scale-[1.01]"
                  : "text-stone-600 dark:text-slate-300 hover:bg-stone-100/70 dark:hover:bg-slate-800/80 hover:text-stone-900 dark:hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-stone-400 dark:text-slate-400 group-hover:text-stone-700 dark:group-hover:text-slate-200"
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
      </nav>

      {/* Footer Info / Version */}
      <div className="p-4 border-t border-stone-100 dark:border-slate-800 text-[10px] text-stone-400 dark:text-slate-500 text-center font-medium">
        <span>CareerGrowth AI Studio v2.4</span>
      </div>
    </div>
  );

  // If mobile drawer mode
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <aside
          className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-stone-200 dark:border-slate-800 z-50 shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-left"
        >
          {navContent}
        </aside>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside className="w-64 h-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-stone-200/80 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto shadow-xs z-30 transition-colors duration-200">
      {navContent}
    </aside>
  );
}
