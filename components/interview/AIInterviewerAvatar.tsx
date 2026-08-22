"use client";

import { Bot, Volume2, Mic, Sparkles, Loader2 } from "lucide-react";

interface AIInterviewerAvatarProps {
  isAiSpeaking: boolean;
  isListening: boolean;
  isEvaluating: boolean;
  questionText: string;
  roundTitle: string;
  questionIndex: number;
  totalQuestions: number;
}

export function AIInterviewerAvatar({
  isAiSpeaking,
  isListening,
  isEvaluating,
  questionText,
  roundTitle,
  questionIndex,
  totalQuestions,
}: AIInterviewerAvatarProps) {
  const getStatusBadge = () => {
    if (isEvaluating) {
      return {
        text: "Evaluating your answer...",
        badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        icon: Loader2,
        iconClass: "animate-spin text-amber-600 dark:text-amber-400",
      };
    }
    if (isAiSpeaking) {
      return {
        text: "AI is speaking...",
        badgeClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        icon: Volume2,
        iconClass: "animate-pulse text-indigo-600 dark:text-indigo-400",
      };
    }
    if (isListening) {
      return {
        text: "Listening to you...",
        badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        icon: Mic,
        iconClass: "animate-bounce text-emerald-600 dark:text-emerald-400",
      };
    }
    return {
      text: "Your turn to answer",
      badgeClass: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      icon: Sparkles,
      iconClass: "text-slate-600 dark:text-slate-400",
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <div className="relative aspect-video w-full rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between p-6 transition-colors">
      {/* Top Header: Round Title & Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">AI Interviewer</h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{roundTitle}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${status.badgeClass}`}
        >
          <StatusIcon className={`w-3.5 h-3.5 ${status.iconClass}`} />
          <span>{status.text}</span>
        </div>
      </div>

      {/* Central Animated Avatar Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Glow Rings */}
          <div
            className={`absolute w-24 h-24 rounded-full border-2 transition-all duration-700 ${
              isAiSpeaking
                ? "border-indigo-400/60 dark:border-indigo-500/60 scale-125 animate-ring-pulse bg-indigo-50/40 dark:bg-indigo-950/40"
                : isListening
                ? "border-emerald-400/60 dark:border-emerald-500/60 scale-115 animate-ping bg-emerald-50/30 dark:bg-emerald-950/30"
                : "border-slate-200 dark:border-slate-800"
            }`}
          />

          {/* Avatar Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Bot className="w-10 h-10 drop-shadow-sm" />
          </div>
        </div>

        {/* Dynamic Voice Bars when AI speaks */}
        {isAiSpeaking && (
          <div className="flex items-center gap-1 h-6 mt-3">
            <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-voice-bar-1" />
            <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-voice-bar-2" />
            <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-voice-bar-3" />
            <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-voice-bar-4" />
            <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-voice-bar-5" />
          </div>
        )}
      </div>

      {/* Bottom: Question text preview */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Question {questionIndex} of {totalQuestions}</span>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
          &ldquo;{questionText}&rdquo;
        </p>
      </div>
    </div>
  );
}
