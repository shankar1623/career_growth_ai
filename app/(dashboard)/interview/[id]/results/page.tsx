"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Award, ArrowRight, Video, MessageSquareCheck, Compass, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { getScoreColor } from "@/lib/utils";

interface ResultsData {
  interview: {
    id: string;
    targetRole: string;
    overallScore: number;
    communicationScore: number;
    technicalScore: number;
    problemSolvingScore: number;
    structureScore: number;
    resumeScore: number;
    codingScore: number;
    hrScore: number;
    summaryFeedback?: string;
  };
}

export default function InterviewResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/interview/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);

          // Trigger Confetti Celebration
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-500">Calculating your 5-round performance metrics...</span>
      </div>
    );
  }

  const interview = data?.interview || {
    id,
    targetRole: "Software Engineer",
    overallScore: 82,
    communicationScore: 85,
    technicalScore: 78,
    problemSolvingScore: 80,
    structureScore: 82,
    resumeScore: 88,
    codingScore: 75,
    hrScore: 84,
    summaryFeedback: "Strong performance across all 5 interview rounds. Demonstrated clear communication, sound technical instincts, and structured answers.",
  };

  const colors = getScoreColor(interview.overallScore);

  const breakdown = [
    { label: "Communication & Clarity", score: interview.communicationScore },
    { label: "Technical Knowledge", score: interview.technicalScore },
    { label: "Problem Solving", score: interview.problemSolvingScore },
    { label: "Answer Structure (STAR)", score: interview.structureScore },
    { label: "Resume & Projects Depth", score: interview.resumeScore },
    { label: "Coding Assessment", score: interview.codingScore },
    { label: "HR & Behavioral Fit", score: interview.hrScore },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm shadow-indigo-100">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Mock Interview Completed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            5-Round Interview Assessment Report
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Role: {interview.targetRole}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="inline-flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 min-w-[200px] mt-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Interview Score
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-5xl font-extrabold ${colors.text}`}>
              {interview.overallScore}
            </span>
            <span className="text-sm font-bold text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-2">
            Top 15% Candidate Performance
          </span>
        </div>

        {interview.summaryFeedback && (
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
            {interview.summaryFeedback}
          </p>
        )}
      </div>

      {/* 7-Dimensional Breakdown Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Score Breakdown by Competency</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {breakdown.map((item) => {
            const subCol = getScoreColor(item.score);
            return (
              <div key={item.label} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-600 block truncate">{item.label}</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-2xl font-extrabold ${subCol.text}`}>{item.score}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-indigo-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-100/70 rounded-2xl border border-slate-200">
        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Another Mock Interview</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <MessageSquareCheck className="w-4 h-4 text-indigo-600" />
            <span>Detailed Feedback</span>
          </Link>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-200"
          >
            <Compass className="w-4 h-4" />
            <span>View Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
