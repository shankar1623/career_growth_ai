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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span>CareerGrowth<span className="text-indigo-600">.AI</span></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Career Studio
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-600" : "text-slate-400")} />
              <span>{item.name}</span>
              {item.name === "Mock Interview" && (
                <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">
                  Live
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
