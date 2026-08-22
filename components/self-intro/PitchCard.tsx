"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, Clock, Volume2, CheckCircle2 } from "lucide-react";
import { SelfIntroductionResult } from "@/types";

interface PitchCardProps {
  introduction: SelfIntroductionResult;
  companyName?: string;
  targetRole?: string;
}

export function PitchCard({ introduction, companyName, targetRole }: PitchCardProps) {
  const [activeTab, setActiveTab] = useState<"30" | "60" | "90">("60");
  const [copied, setCopied] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getActiveText = () => {
    if (activeTab === "30") return introduction.pitch30;
    if (activeTab === "90") return introduction.pitch90;
    return introduction.pitch60;
  };

  const handleCopy = (version: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(version);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSpeakAloud = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(getActiveText());
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Personalized Self-Introduction Pitch</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tailored for {targetRole || "Software Engineer"} {companyName ? `at ${companyName}` : ""}
          </p>
        </div>

        {/* Pitch Duration Switcher */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1">
          <button
            onClick={() => {
              setActiveTab("30");
              if (isPlayingAudio) {
                window.speechSynthesis?.cancel();
                setIsPlayingAudio(false);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "30"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            30-Second Elevator
          </button>
          <button
            onClick={() => {
              setActiveTab("60");
              if (isPlayingAudio) {
                window.speechSynthesis?.cancel();
                setIsPlayingAudio(false);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "60"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            60-Second Standard
          </button>
          <button
            onClick={() => {
              setActiveTab("90");
              if (isPlayingAudio) {
                window.speechSynthesis?.cancel();
                setIsPlayingAudio(false);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "90"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            90-Second Comprehensive
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Pitch Card */}
        <div className="p-6 rounded-2xl bg-indigo-50/30 border border-indigo-100/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>
                {activeTab === "30"
                  ? "30-Second Elevator Pitch (~75 words)"
                  : activeTab === "60"
                  ? "60-Second Standard Pitch (~140 words)"
                  : "90-Second In-Depth Pitch (~220 words)"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakAloud}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-xs ${
                  isPlayingAudio
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
                <span>{isPlayingAudio ? "Stop Audio" : "Listen (AI Voice)"}</span>
              </button>

              <button
                onClick={() => handleCopy(activeTab, getActiveText())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-200"
              >
                {copied === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Pitch</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 leading-relaxed shadow-xs whitespace-pre-wrap">
            {getActiveText()}
          </div>
        </div>

        {/* Why this introduction works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Why This Introduction Works
            </h4>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {introduction.whyItWorks}
            </div>
          </div>

          {introduction.keyHighlights && introduction.keyHighlights.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5">
                Key Strategic Highlights
              </h4>
              <ul className="space-y-1.5">
                {introduction.keyHighlights.map((hl, i) => (
                  <li key={i} className="text-xs text-emerald-900/90 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
