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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-3 px-4 flex flex-wrap items-center justify-between gap-3">
      {/* Left Group: Media toggles */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMic}
          className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isMicOn
              ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
          title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-rose-600" />}
          <span className="hidden sm:inline">{isMicOn ? "Mic ON" : "Mic OFF"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleCamera}
          className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isCameraOn
              ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
          title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isCameraOn ? <Camera className="w-4 h-4 text-emerald-600" /> : <CameraOff className="w-4 h-4 text-rose-600" />}
          <span className="hidden sm:inline">{isCameraOn ? "Camera ON" : "Camera OFF"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAiVoice}
          className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isAiVoiceOn
              ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
          title={isAiVoiceOn ? "Disable AI Voice" : "Enable AI Voice"}
        >
          {isAiVoiceOn ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-amber-600" />}
          <span className="hidden sm:inline">{isAiVoiceOn ? "AI Voice" : "Muted"}</span>
        </button>
      </div>

      {/* Center Group: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReplayQuestion}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Repeat current question aloud"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">Replay</span>
        </button>

        <button
          type="button"
          onClick={onOpenTextInput}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Type answer manually (Speech fallback)"
        >
          <MessageSquarePlus className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">Text Fallback</span>
        </button>

        <button
          type="button"
          onClick={onSubmitAnswer}
          disabled={isEvaluating}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs shadow-indigo-200"
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
          className="p-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>End Interview</span>
        </button>
      </div>
    </div>
  );
}
