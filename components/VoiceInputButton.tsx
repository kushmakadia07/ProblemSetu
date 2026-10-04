"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

interface VoiceInputButtonProps {
  value: string;
  onChange: (newValue: string) => void;
  fieldName?: string;
  size?: "normal" | "compact";
  className?: string;
}

export default function VoiceInputButton({
  value,
  onChange,
  fieldName = "field",
  size = "normal",
  className = "",
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isRecognitionRunningRef = useRef<boolean>(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const baseTextRef = useRef<string>("");
  const capturedTextRef = useRef<string>("");

  useEffect(() => {
    return () => {
      // Clean up all streams and recognizers on unmount
      stopAll();
    };
  }, []);

  const stopAll = () => {
    if (recognitionRef.current && isRecognitionRunningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      isRecognitionRunningRef.current = false;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      mediaStreamRef.current = null;
    }

    setIsListening(false);
  };

  const startListening = async () => {
    setErrorMessage(null);
    baseTextRef.current = value || "";
    capturedTextRef.current = "";

    // 1. Request microphone access
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission was denied. Please allow microphone access in your browser or type manually.");
      } else {
        setErrorMessage("Could not access microphone. Please type your response directly.");
      }
      return;
    }

    // 2. Initialize MediaRecorder for high-accuracy Gemini audio backup
    let mimeType = "audio/webm";
    if (typeof MediaRecorder !== "undefined" && stream) {
      try {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg";
        }

        const recorder = new MediaRecorder(stream, { mimeType });
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.start(200);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn("MediaRecorder init notice:", recErr);
      }
    }

    // 3. Initialize Web Speech API with Indian English accent
    let webSpeechStarted = false;
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        // Indian English accent locale
        recognition.lang = "en-IN";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          isRecognitionRunningRef.current = true;
        };

        recognition.onresult = (event: any) => {
          let sessionTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            sessionTranscript += event.results[i][0].transcript;
          }

          if (sessionTranscript.trim()) {
            capturedTextRef.current = sessionTranscript.trim();
            const base = baseTextRef.current.trim();
            const updated = base
              ? `${base} ${capturedTextRef.current}`
              : capturedTextRef.current;
            onChange(updated);
          }
        };

        recognition.onerror = (event: any) => {
          console.info("Web Speech event:", event.error);
          // Don't show disruptive error banners for normal pause/silence or network disconnects.
          // MediaRecorder with Gemini AI will seamlessly handle transcription.
          if (event.error === "not-allowed") {
            setErrorMessage("Microphone access was denied. Please allow microphone access or type manually.");
          }
        };

        recognition.onend = () => {
          isRecognitionRunningRef.current = false;
        };

        recognitionRef.current = recognition;
        recognition.start();
        webSpeechStarted = true;
      } catch (speechErr) {
        console.warn("SpeechRecognition start error:", speechErr);
        isRecognitionRunningRef.current = false;
      }
    }

    setIsListening(true);
  };

  const stopListening = async () => {
    setIsListening(false);

    // Stop Web Speech API
    if (recognitionRef.current && isRecognitionRunningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      isRecognitionRunningRef.current = false;
    }

    // Process MediaRecorder audio
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = async () => {
        // Release mic stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }

        const mime = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });

        // If Web Speech API already captured the user's speech accurately, we're done!
        if (capturedTextRef.current && capturedTextRef.current.length > 5) {
          return;
        }

        // If Web Speech API got nothing or had network drop, transcribe via Gemini 3.8 Flash!
        if (audioBlob.size > 2000) {
          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              try {
                const base64Audio = (reader.result as string).split(",")[1];
                if (!base64Audio) return;

                const res = await fetch("/api/transcribe-audio", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    audioBase64: base64Audio,
                    mimeType: mime,
                  }),
                });

                if (res.ok) {
                  const data = await res.json();
                  if (data.transcript && data.transcript.trim()) {
                    const cleanTranscript = data.transcript.trim();
                    const base = baseTextRef.current.trim();
                    const updated = base
                      ? `${base} ${cleanTranscript}`
                      : cleanTranscript;
                    onChange(updated);
                  }
                }
              } catch (fetchErr) {
                console.warn("Gemini audio transcription fetch failed:", fetchErr);
              } finally {
                setIsTranscribing(false);
              }
            };
            reader.readAsDataURL(audioBlob);
          } catch (blobErr) {
            console.warn("Blob conversion error:", blobErr);
            setIsTranscribing(false);
          }
        }
      };

      try {
        recorder.stop();
      } catch {
        // ignore
      }
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`inline-flex flex-col items-end ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={isTranscribing}
        title={
          isListening
            ? "Listening (English in Indian Accent)... Click to stop"
            : isTranscribing
            ? "Transcribing your Indian English voice with Gemini AI..."
            : "Click to speak in English (Indian Accent) or type directly"
        }
        className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all shadow-xs cursor-pointer select-none ${
          isListening
            ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-400 ring-offset-1"
            : isTranscribing
            ? "bg-amber-100 text-amber-800 border border-amber-300"
            : "bg-slate-100 hover:bg-slate-200 text-[#1b365d] border border-slate-300"
        } ${
          size === "compact"
            ? "text-[11px] px-2.5 py-1"
            : "text-xs px-3 py-1.5"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-spin" />
            <span className="font-semibold">Stop Listening</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
          </>
        ) : isTranscribing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#e87722]" />
            <span>Processing Voice...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-[#e87722]" />
            <span>Voice (Indian English)</span>
          </>
        )}
      </button>

      {isListening && (
        <span className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
          <Volume2 className="w-3 h-3 animate-bounce" />
          Listening (Indian English)... Speak or type freely
        </span>
      )}

      {isTranscribing && (
        <span className="text-[10px] text-amber-700 font-medium mt-1 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
          Transcribing Indian English speech...
        </span>
      )}

      {errorMessage && (
        <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mt-1 max-w-xs text-right">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
