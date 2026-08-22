"use client";

import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  RotateCcw,
  MessageSquarePlus,
  ArrowRight,
  PhoneOff,
} from "lucide-react";

interface InterviewControlsBarProps {
  isMicOn: boolean;
  onToggleMic: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isAiVoiceOn: boolean;
  onToggleAiVoice: () => void;
  onReplayQuestion: () => void;
  onOpenTextInput: () => void;
  onSubmitAnswer: () => void;
  onEndInterview: () => void;
  isEvaluating: boolean;
  canSubmit: boolean;
}

export function InterviewControlsBar({
  isMicOn,
  onToggleMic,
  isCameraOn,
  onToggleCamera,
  isAiVoiceOn,
  onToggleAiVoice,
  onReplayQuestion,
  onOpenTextInput,
  onSubmitAnswer,
  onEndInterview,
  isEvaluating,
  canSubmit,
}: InterviewControlsBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 transition-colors">
      {/* Left Group: Media toggles */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMic}
          className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
            isMicOn
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750"
              : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
          title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicOn ? <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          <span className="hidden sm:inline">{isMicOn ? "Mic ON" : "Mic OFF"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleCamera}
          className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
            isCameraOn
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750"
              : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
          title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isCameraOn ? <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <CameraOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          <span className="hidden sm:inline">{isCameraOn ? "Camera ON" : "Camera OFF"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAiVoice}
          className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
            isAiVoiceOn
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750"
              : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
          }`}
          title={isAiVoiceOn ? "Disable AI Voice" : "Enable AI Voice"}
        >
          {isAiVoiceOn ? <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          <span className="hidden sm:inline">{isAiVoiceOn ? "AI Voice" : "Muted"}</span>
        </button>
      </div>

      {/* Center Group: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReplayQuestion}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
          title="Repeat current question aloud"
        >
          <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden md:inline">Replay</span>
        </button>

        <button
          type="button"
          onClick={onOpenTextInput}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
          title="Type answer manually (Speech fallback)"
        >
          <MessageSquarePlus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden md:inline">Type Answer</span>
        </button>

        <button
          type="button"
          onClick={onSubmitAnswer}
          disabled={isEvaluating}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/25 active:scale-95"
        >
          <span>{isEvaluating ? "Evaluating..." : "Next Question"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right Group: End interview */}
      <div>
        <button
          type="button"
          onClick={onEndInterview}
          className="p-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>End Session</span>
        </button>
      </div>
    </div>
  );
}
