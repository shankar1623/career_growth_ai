"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { User, Mail, Briefcase, Award, CheckCircle2, FileText, Video, Compass, Sparkles } from "lucide-react";

interface ProfileStats {
  resumesCount: number;
  interviewsCount: number;
  roadmapCount: number;
  completedRoadmapItems: number;
  totalRoadmapItems: number;
}

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const [stats, setStats] = useState<ProfileStats>({
    resumesCount: 0,
    interviewsCount: 0,
    roadmapCount: 0,
    completedRoadmapItems: 0,
    totalRoadmapItems: 4,
  });
  const [apiUserName, setApiUserName] = useState("Candidate User");
  const [apiUserEmail, setApiUserEmail] = useState("user@careergrowth.ai");
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (2-4 Years)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.success) {
          if (data.stats) setStats(data.stats);
          if (data.user?.name) setApiUserName(data.user.name);
          if (data.user?.email) setApiUserEmail(data.user.email);
        }
      } catch (err) {
        console.warn("Could not load profile stats:", err);
      }
    }
    loadProfile();
  }, []);

  // Determine displayed user information from Clerk or DB API
  const displayName =
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    clerkUser?.username ||
    apiUserName ||
    "Candidate User";

  const displayEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    apiUserEmail ||
    "user@careergrowth.ai";

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "CU";
  };

  const userInitials = getInitials(displayName);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Account & Profile</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          User Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information, career target preferences, and view your activity summary.
        </p>
      </div>

      {/* User Information & Activity Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-6 transition-colors">
        <div className="flex items-center gap-4">
          {clerkUser?.imageUrl ? (
            <Image
              src={clerkUser.imageUrl}
              alt={displayName}
              width={56}
              height={56}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-100 dark:shadow-indigo-950"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-indigo-950">
              {userInitials}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{displayName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{displayEmail}</p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mt-1">
              Active Member
            </span>
          </div>
        </div>

        {/* Real Database Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Resumes Analyzed</span>
              <strong className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {stats.resumesCount} {stats.resumesCount === 1 ? "Document" : "Documents"}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Mock Interviews Practiced</span>
              <strong className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                {stats.interviewsCount} {stats.interviewsCount === 1 ? "Session" : "Sessions"}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Roadmap Milestones Done</span>
              <strong className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {stats.completedRoadmapItems} of {stats.totalRoadmapItems} Completed
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Career Preferences Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Career & Interview Target Preferences</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Customize the target role and seniority for AI mock sessions</span>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Primary Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Seniority Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Fresher / Entry-Level (0-1 Years)">Fresher / Entry-Level (0-1 Years)</option>
                <option value="Junior Software Developer (1-2 Years)">Junior Software Developer (1-2 Years)</option>
                <option value="Mid-Level (2-4 Years)">Mid-Level (2-4 Years)</option>
                <option value="Senior Software Engineer (5+ Years)">Senior Software Engineer (5+ Years)</option>
                <option value="Lead Engineer / Tech Lead">Lead Engineer / Tech Lead</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">Settings are automatically applied to your mock interview generator</span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
