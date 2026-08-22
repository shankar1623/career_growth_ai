"use client";

import Link from "next/link";
import {
  FileText,
  Target,
  Video,
  Code2,
  MessageSquareCheck,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Bot,
  Mic,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function LandingPage() {
  const workflowSteps = [
    { number: "01", title: "Upload Resume", desc: "PDF, Word DOCX, or text parser extracting all sections", icon: FileText },
    { number: "02", title: "Analyze Resume", desc: "8 core metrics, ATS scan, and section-by-section rewrites", icon: Sparkles },
    { number: "03", title: "Match Job", desc: "Cross-reference JD requirements & discover missing skills", icon: Target },
    { number: "04", title: "Practice Interview", desc: "Webcam + mic 5-round AI interview with coding round", icon: Video },
    { number: "05", title: "Get Feedback", desc: "STAR structure evaluations, filler word diagnostics & scores", icon: MessageSquareCheck },
    { number: "06", title: "Follow Roadmap", desc: "Interactive week-by-week practice curriculum", icon: Compass },
  ];

  const features = [
    {
      icon: FileText,
      title: "AI Resume Diagnostic & ATS Score",
      description: "Section-by-section diagnostic breakdowns providing original vs problem vs suggested replacement cards with zero generic filler.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      badge: "8 Scoring Dimensions",
    },
    {
      icon: Target,
      title: "Job Description Gap Matcher",
      description: "Identifies strong matches, missing target technologies, and critical ATS keywords with clear learning guidance without fabricating experience.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      badge: "Keyword Analysis",
    },
    {
      icon: Video,
      title: "Browser-Native AI Video Mock Interview",
      description: "Practice real video interviews using your webcam and microphone. Browser SpeechSynthesis speaks questions aloud with 5s silence detection.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      badge: "5 Live Rounds",
    },
    {
      icon: Code2,
      title: "Monaco In-Browser Coding Assessment",
      description: "Solve algorithmic challenges in JavaScript, TypeScript, Python, Java, C++, or Go with Big-O time and space complexity evaluation.",
      color: "bg-violet-50 text-violet-600 border-violet-100",
      badge: "Monaco Editor",
    },
    {
      icon: MessageSquareCheck,
      title: "Granular Feedback & STAR Rewrites",
      description: "Comprehensive review of What You Did Well and What Needs Improvement with Problem -> Why It Matters -> Better Example -> How to Practice.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      badge: "STAR Breakdown",
    },
    {
      icon: Compass,
      title: "Personalized Learning Roadmap",
      description: "Customized week-by-week curriculum with practice tasks, free documentation resources, and completion trackers saved in database.",
      color: "bg-teal-50 text-teal-600 border-teal-100",
      badge: "Step-by-Step",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free-Tier & Browser-Native AI Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Turn Your Resume Into Your{" "}
            <span className="text-indigo-600 bg-clip-text">
              Interview Advantage
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Analyze your resume, match it with real job descriptions, practice AI-powered video interviews with speech & coding rounds, and follow a personalized roadmap to become job-ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/resume-analyzer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span>Analyze My Resume</span>
            </Link>

            <Link
              href="/mock-interview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-xs hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4 text-indigo-600" />
              <span>Start Mock Interview</span>
            </Link>
          </div>

          {/* Free technology guarantees */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free Browser Speech API
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free Neon PostgreSQL
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Configurable AI (Ollama/Local)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Zero Paid API Lock-In
            </span>
          </div>
        </div>
      </section>

      {/* Product Workflow Section */}
      <section id="workflow" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              End-to-End System
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 6-Step Career Acceleration Pipeline
            </h2>
            <p className="text-sm text-slate-600">
              From uploading an unoptimized resume to mastering your behavioral and live coding interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col justify-between relative hover:border-indigo-300 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {step.number}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      &rarr;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Comprehensive Features
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered For Modern Job Seekers & Freshers
            </h2>
            <p className="text-sm text-slate-600">
              Every tool you need to diagnose flaws, align keywords, rehearse with AI, and land top offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>Explore feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Video Interview Studio Spotlight */}
      <section id="interview" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" />
                <span>Simulated Online Interview Environment</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Practice 5 Full Interview Rounds With Live Voice & Webcam
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Experience realistic interview conditions with an interactive AI interviewer. Questions are spoken aloud using browser text-to-speech, and your live microphone feed is transcribed with built-in 5-second silence detection.
              </p>

              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Round 1: Self-Introduction Pitch (1–2 minutes)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Round 2: Resume & Project Architecture Deep-Dive</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Round 3: Core Technical & Domain Concepts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Round 4: In-Browser Monaco Code Editor Challenge</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Round 5: HR & Behavioral STAR Method Evaluation</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/mock-interview"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-200"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Mock Interview Studio</span>
                </Link>
              </div>
            </div>

            {/* Video Mockup Preview */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 px-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI MOCK INTERVIEW STUDIO
                </span>
                <span>Round 1 of 5</span>
              </div>

              <div className="grid grid-cols-2 gap-3 aspect-video">
                {/* AI Interviewer tile */}
                <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 border border-slate-700">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">AI Interviewer</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">🔊 Speaking question...</span>
                </div>

                {/* Candidate Camera tile */}
                <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 border border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                    <Mic className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">Live Webcam Feed</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">🎤 Listening...</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-200">
                &ldquo;Tell me about yourself, your technical background, and what drives you as a software developer.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 bg-slate-900 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span>CareerGrowth<span className="text-indigo-400">.AI</span></span>
          </div>

          <h3 className="text-2xl font-bold max-w-xl mx-auto">
            Ready to accelerate your career and ace your upcoming technical interviews?
          </h3>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-900"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-slate-400 pt-8 border-t border-slate-800">
            &copy; {new Date().getFullYear()} CareerGrowth AI. Built with Next.js, Prisma, Neon PostgreSQL, and Free Browser-Native AI APIs.
          </p>
        </div>
      </footer>
    </div>
  );
}
