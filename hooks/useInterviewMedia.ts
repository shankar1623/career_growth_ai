"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseInterviewMediaOptions {
  onSilenceTimeout?: () => void;
  onTranscriptUpdate?: (transcript: string) => void;
  enableSilenceDetection?: boolean;
}

export function useInterviewMedia(options: UseInterviewMediaOptions = {}) {
  const { onSilenceTimeout, onTranscriptUpdate, enableSilenceDetection = true } = options;

  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAiVoiceOn, setIsAiVoiceOn] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onSilenceTimeoutRef = useRef(onSilenceTimeout);

  useEffect(() => {
    onSilenceTimeoutRef.current = onSilenceTimeout;
  }, [onSilenceTimeout]);

  // Reset Silence Timers
  const resetSilenceDetection = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(null);
  }, []);

  // Trigger 5-second silence countdown to auto-advance to next question
  const startSilenceCountdown = useCallback((duration: number = 5) => {
    if (!enableSilenceDetection) return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    let timeLeft = duration;
    setSilenceCountdown(timeLeft);

    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setSilenceCountdown(null);
        if (onSilenceTimeoutRef.current) onSilenceTimeoutRef.current();
      } else {
        setSilenceCountdown(timeLeft);
      }
    }, 1000);
  }, [enableSilenceDetection]);

  // Initialize Media Stream
  const requestMediaPermissions = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasPermissions(true);
      return true;
    } catch (err: unknown) {
      console.error("Media permission error:", err);
      const msg = err instanceof Error ? err.message : "Camera and microphone access was denied or not found.";
      setPermissionError(msg);
      return false;
    }
  }, []);

  // Ensure video element receives stream whenever mounted
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream]);

  // Toggle Camera
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  // Setup Web Speech API Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + " ";
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      const fullText = (finalStr + interimStr).trim();
      setLiveTranscript(fullText);
      if (onTranscriptUpdate) onTranscriptUpdate(fullText);

      // User is actively speaking -> cancel countdown
      setIsUserSpeaking(true);
      resetSilenceDetection();

      // Start 5-second silence countdown after user stops speaking (pause for 2.5s)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        setIsUserSpeaking(false);
        startSilenceCountdown(5);
      }, 2500);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      console.warn("Speech recognition notice:", e.error);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      resetSilenceDetection();
    };
  }, [onTranscriptUpdate, resetSilenceDetection, startSilenceCountdown]);

  // Start Listening and trigger 5s countdown if user stays completely silent
  const startListening = useCallback(() => {
    resetSilenceDetection();
    if (recognitionRef.current && isMicOn) {
      try {
        setLiveTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition already started or error:", err);
      }
    }
    // Start 5-second auto-advance countdown if user doesn't speak at all
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      startSilenceCountdown(5);
    }, 5000);
  }, [isMicOn, resetSilenceDetection, startSilenceCountdown]);

  // Stop Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch {}
    }
    resetSilenceDetection();
  }, [resetSilenceDetection]);

  // Speak AI Question using browser SpeechSynthesis
  const speakQuestion = useCallback(
    (text: string, onComplete?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onComplete) onComplete();
        startListening();
        return;
      }

      window.speechSynthesis.cancel();
      stopListening();

      if (!isAiVoiceOn) {
        if (onComplete) onComplete();
        startListening();
        return;
      }

      setIsAiSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (onComplete) onComplete();
        startListening();
      };

      utterance.onerror = () => {
        setIsAiSpeaking(false);
        if (onComplete) onComplete();
        startListening();
      };

      window.speechSynthesis.speak(utterance);
    },
    [isAiVoiceOn, startListening, stopListening]
  );

  // Stop all media on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      resetSilenceDetection();
    };
  }, [resetSilenceDetection]);

  return {
    videoRef,
    mediaStream,
    hasPermissions,
    permissionError,
    requestMediaPermissions,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMic,
    isAiVoiceOn,
    setIsAiVoiceOn,
    isAiSpeaking,
    isUserSpeaking,
    isListening,
    liveTranscript,
    setLiveTranscript,
    silenceCountdown,
    resetSilenceDetection,
    speechRecognitionSupported,
    startListening,
    stopListening,
    speakQuestion,
  };
}
