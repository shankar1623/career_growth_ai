"use client";

import { RefObject, useEffect } from "react";
import { CameraOff, Mic, MicOff } from "lucide-react";

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
    <div className="relative aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-md flex items-center justify-center">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-2">
            <CameraOff className="w-8 h-8 text-slate-400" />
          </div>
          <span className="text-xs font-semibold">Camera is Turned Off</span>
        </div>
      )}

      {/* Top Left: Candidate Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/60 text-white text-[11px] font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Your Camera (Live)</span>
      </div>

      {/* Top Right: Mic Status */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/60 text-white text-[11px]">
        {isMicOn ? (
          <div className="flex items-center gap-1 text-emerald-400">
            <Mic className="w-3.5 h-3.5" />
            {isUserSpeaking && (
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 h-2 animate-voice-bar-1 rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-3 animate-voice-bar-2 rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-1.5 animate-voice-bar-3 rounded-full" />
              </div>
            )}
          </div>
        ) : (
          <MicOff className="w-3.5 h-3.5 text-rose-400" />
        )}
      </div>

      {/* Bottom Subtitle / Live Transcript Overlay */}
      {liveTranscript && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/70 text-slate-100 text-xs leading-relaxed max-h-16 overflow-y-auto">
          <span className="text-indigo-300 font-semibold mr-1.5">You:</span>
          <span>{liveTranscript}</span>
        </div>
      )}
    </div>
  );
}
