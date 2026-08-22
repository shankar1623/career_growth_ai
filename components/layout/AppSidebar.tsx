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
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/BrandLogo";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText },
  { name: "Job Match", href: "/job-match", icon: Target },
  { name: "Mock Interview", href: "/mock-interview", icon: Video },
  { name: "Feedback", href: "/feedback", icon: MessageSquareCheck },
  { name: "Learning Roadmap", href: "/roadmap", icon: Compass },
  { name: "Profile", href: "/profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col shrink-0 overflow-y-auto shadow-xs">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100/80 shrink-0 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <BrandLogo href="/dashboard" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5">
        <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center justify-between">
          <span>Main Navigation</span>
          <Sparkles className="w-3 h-3 text-indigo-400" />
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group",
                isActive
                  ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100/70"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full shadow-xs" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span>{item.name}</span>
              {item.name === "Mock Interview" && (
                <span className="ml-auto text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
