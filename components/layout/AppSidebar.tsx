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
  Zap,
  ChevronRight,
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
  { name: "Profile", href: "/profile", icon: User, badge: null },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/80 flex flex-col shrink-0 overflow-y-auto shadow-xs z-30">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100/90 shrink-0 sticky top-0 bg-white/70 backdrop-blur-md z-10">
        <BrandLogo href="/dashboard" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-black tracking-wider text-slate-400 uppercase flex items-center justify-between">
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
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 relative group",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-extrabold scale-[1.01]"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
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
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Modern AI Engine Status Chip */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Groq Qwen 27B AI</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          High-throughput spoken & coding assessment engine connected.
        </p>
      </div>
    </aside>
  );
}
