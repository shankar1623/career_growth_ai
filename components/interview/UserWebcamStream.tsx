"use client";

import { RefObject, useEffect } from "react";
import { CameraOff, Mic, MicOff, Sparkles } from "lucide-react";

interface UserWebcamStreamProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  mediaStream?: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isUserSpeaking: boolean;
  liveTranscript: string;
}

export function UserWebcamStream({
  videoRef,
  mediaStream,
  isCameraOn,
  isMicOn,
  isUserSpeaking,
  liveTranscript,
}: UserWebcamStreamProps) {
  // Guarantee media stream is bound whenever video mounts or stream updates
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [videoRef, mediaStream]);

  return (
    <div className="relative aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-center transition-colors">
      {/* Live Video Feed (Mirrored) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
        className={`w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${
          isCameraOn ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Camera Off Placeholder */}
      {!isCameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-2">
            <CameraOff className="w-8 h-8 text-slate-500" />
          </div>
          <span className="text-xs font-bold text-slate-300">Camera is Turned Off</span>
        </div>
      )}

      {/* Top Left: Candidate Badge */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-white text-[11px] font-bold shadow-xs">
        <span className={`w-2 h-2 rounded-full ${isCameraOn ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
        <span>Candidate Video (You)</span>
      </div>

      {/* Top Right: Mic Status */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-white text-[11px] shadow-xs">
        {isMicOn ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Mic className="w-3.5 h-3.5" />
            {isUserSpeaking ? (
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 h-2 animate-voice-bar-1 rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-3 animate-voice-bar-2 rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-1.5 animate-voice-bar-3 rounded-full" />
              </div>
            ) : (
              <span>Mic Ready</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-rose-400 font-semibold">
            <MicOff className="w-3.5 h-3.5" />
            <span>Muted</span>
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Live Transcript Overlay */}
      {liveTranscript ? (
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-slate-100 text-xs leading-relaxed max-h-20 overflow-y-auto animate-in fade-in">
          <span className="text-indigo-400 font-bold mr-1.5">You:</span>
          <span>{liveTranscript}</span>
        </div>
      ) : (
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 bg-slate-950/60 backdrop-blur-xs p-2 rounded-xl border border-slate-800/50 text-slate-400 text-[11px] text-center">
          <span>Speak clearly into your microphone when ready</span>
        </div>
      )}
    </div>
  );
}
