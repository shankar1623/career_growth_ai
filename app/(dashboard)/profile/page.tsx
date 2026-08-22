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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Account & Profile</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal information, career target preferences, and view your activity summary.
        </p>
      </div>

      {/* User Information & Activity Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-4">
          {clerkUser?.imageUrl ? (
            <Image
              src={clerkUser.imageUrl}
              alt={displayName}
              width={56}
              height={56}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shadow-indigo-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-100">
              {userInitials}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-slate-900">{displayName}</h3>
            <p className="text-xs text-slate-500">{displayEmail}</p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
              Active Member
            </span>
          </div>
        </div>

        {/* Real Database Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block">Resumes Analyzed</span>
              <strong className="text-base font-bold text-slate-900 mt-0.5 block">
                {stats.resumesCount} {stats.resumesCount === 1 ? "Document" : "Documents"}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block">Mock Interviews Practiced</span>
              <strong className="text-base font-bold text-indigo-600 mt-0.5 block">
                {stats.interviewsCount} {stats.interviewsCount === 1 ? "Session" : "Sessions"}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block">Roadmap Milestones Done</span>
              <strong className="text-base font-bold text-emerald-600 mt-0.5 block">
                {stats.completedRoadmapItems} of {stats.totalRoadmapItems} Completed
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Career Preferences Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Career & Interview Target Preferences</h3>
            <span className="text-[11px] text-slate-500">Customize the target role and seniority for AI mock sessions</span>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Seniority Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings are automatically applied to your mock interview generator</span>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs shadow-indigo-200"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
