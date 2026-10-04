"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  Camera,
  Upload,
  Square,
  RefreshCw,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Home,
  XCircle,
  Play,
  Pause,
  Film
} from "lucide-react";
import type { VideoAnalysisResult } from "@/app/api/analyze-video/route";

interface VideoProblemRecorderProps {
  onAnalysisSuccess: (result: VideoAnalysisResult) => void;
  onAnalysisRejection?: (result: VideoAnalysisResult) => void;
}

export default function VideoProblemRecorder({
  onAnalysisSuccess,
  onAnalysisRejection
}: VideoProblemRecorderProps) {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record");

  // Recording state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatusText, setAnalysisStatusText] = useState<string>("");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);

  // Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_SECONDS = 60; // 60 seconds limit for rapid AI processing

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setRecordedBlob(null);
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not supported on this browser. Please use the Upload Video tab instead.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: true
      });

      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
        videoPreviewRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera & microphone permission denied. Please allow camera access in your browser or upload a video file.");
      } else {
        setCameraError("Could not access camera/microphone. Please upload a video file instead.");
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setRecordingSeconds(0);
    setAnalysisError(null);
    setAnalysisResult(null);

    let mimeType = "video/webm";
    if (typeof MediaRecorder !== "undefined") {
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
        mimeType = "video/webm;codecs=vp8,opus";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4";
      }
    }

    try {
      const recorder = new MediaRecorder(streamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setRecordedVideoUrl(url);
        stopCamera();
      };

      recorder.start(1000); // 1-second chunks
      setIsRecording(true);

      // Timer countdown
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            stopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("MediaRecorder start failed:", err);
      setCameraError("Failed to initialize video recording on this device. Please upload a pre-recorded video file.");
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    setUploadedFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    startCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 40MB
    if (file.size > 40 * 1024 * 1024) {
      setAnalysisError("Video file size exceeds 40MB. Please select a shorter video statement (1-2 minutes).");
      return;
    }

    setUploadedFile(file);
    setRecordedBlob(file);
    const url = URL.createObjectURL(file);
    setRecordedVideoUrl(url);
    setAnalysisError(null);
    setAnalysisResult(null);
  };

  const handleAnalyzeWithAi = async () => {
    if (!recordedBlob) {
      setAnalysisError("Please record or upload a video statement first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStatusText("Uploading video statement to secure server...");

    try {
      const formData = new FormData();
      formData.append("video", recordedBlob, uploadedFile ? uploadedFile.name : "recorded_statement.webm");

      setTimeout(() => {
        setAnalysisStatusText("Google Gemini listening to spoken English explanation...");
      }, 1500);

      setTimeout(() => {
        setAnalysisStatusText("Verifying public community infrastructure policy...");
      }, 3500);

      setTimeout(() => {
        setAnalysisStatusText("Synthesizing problem description & technical questions...");
      }, 5500);

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setAnalysisError(data.error || "Failed to analyze video. Please try again or type your complaint.");
        setIsAnalyzing(false);
        return;
      }

      setAnalysisResult(data);

      if (!data.isApproved) {
        if (onAnalysisRejection) onAnalysisRejection(data);
      } else {
        onAnalysisSuccess(data);
      }
    } catch (err: any) {
      console.error("Video AI analysis exception:", err);
      setAnalysisError("Network timeout during video analysis. Please check your internet connection.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatusText("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-slate-100 border-2 border-indigo-200 rounded-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200/70 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Film className="w-4 h-4 text-[#e87722]" />
            <span className="uppercase tracking-wider">AI Video Intake Statement</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-amber-300">
              English Only
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Record or upload a video speaking about your problem. Google Gemini AI will process your video statement and generate diagnostic questions automatically.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-white border border-gray-300 rounded p-0.5 text-xs self-start sm:self-auto shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("record");
              if (!recordedVideoUrl && !isCameraActive) startCamera();
            }}
            className={`px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "record"
                ? "bg-[#1b365d] text-white shadow-xs"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Record Video</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("upload");
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "upload"
                ? "bg-[#1b365d] text-white shadow-xs"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{cameraError}</span>
          </div>
        </div>
      )}

      {analysisError && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-start gap-2">
          <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{analysisError}</div>
        </div>
      )}

      {/* AI Policy Rejection Alert */}
      {analysisResult && !analysisResult.isApproved && (
        <div
          className={`p-4 rounded-lg border-2 space-y-3 ${
            analysisResult.classification === "PRIVATE_PROPERTY"
              ? "bg-rose-50 border-rose-300 text-rose-950"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                analysisResult.classification === "PRIVATE_PROPERTY"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {analysisResult.classification === "PRIVATE_PROPERTY" ? (
                <Home className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">
                  {analysisResult.classification === "PRIVATE_PROPERTY"
                    ? "Private Property Issue Detected in Video"
                    : "Video Not Approved Under Portal Policy"}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    analysisResult.classification === "PRIVATE_PROPERTY"
                      ? "bg-rose-200 text-rose-800"
                      : "bg-amber-200 text-amber-800"
                  }`}
                >
                  AI Video Filter
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-800">
                {analysisResult.citizenMessage}
              </p>
              <div className="text-[11px] text-gray-600 bg-white/80 p-2.5 rounded border border-gray-200 mt-2">
                ℹ️ <strong>ProblemSetu Rule:</strong> ProblemSetu is dedicated exclusively to public and community infrastructure (such as roads, community handpumps, streetlights, and drainage). Videos showing personal domestic disputes or internal household fixtures cannot be accepted.
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleRetake}
              className="gov-btn-primary text-xs px-3.5 py-1.5 rounded font-bold"
            >
              Record / Upload Another Video
            </button>
          </div>
        </div>
      )}

      {/* AI Success Banner */}
      {analysisResult && analysisResult.isApproved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>AI Video Analysis Successful!</span>
          </div>
          <p className="text-emerald-900 leading-relaxed">
            {analysisResult.citizenMessage}
          </p>
          <div className="bg-white/80 p-3 rounded border border-emerald-200 space-y-1">
            <div className="font-bold text-gray-800 text-xs">
              Extracted Title: <span className="text-[#1b365d]">{analysisResult.title}</span>
            </div>
            <div className="text-gray-700 text-xs leading-relaxed">
              <strong>Processed Video Description:</strong> {analysisResult.description}
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Category: <strong>{analysisResult.category}</strong> • <strong>{analysisResult.questions?.length || 3} Diagnostic Questions Generated</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Viewport */}
      {activeTab === "record" && (
        <div className="space-y-3">
          {!recordedVideoUrl ? (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-w-lg mx-auto flex items-center justify-center border border-gray-800 shadow-inner">
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-white space-y-3">
                  <Camera className="w-10 h-10 text-gray-400" />
                  <div className="text-xs font-semibold">Camera is currently inactive</div>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="gov-btn-accent text-xs px-4 py-2 rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Camera & Mic</span>
                  </button>
                </div>
              )}

              {/* Recording indicator badge */}
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 01:00</span>
                </div>
              )}

              {/* Progress bar */}
              {isRecording && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700">
                  <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(recordingSeconds / MAX_SECONDS) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Review recorded video */
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-w-lg mx-auto border border-gray-800 shadow-md">
              <video
                src={recordedVideoUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {isCameraActive && !isRecording && !recordedVideoUrl && (
              <button
                type="button"
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-5 rounded-full font-bold shadow-md cursor-pointer flex items-center gap-2 transition"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                <span>Start Recording (Speak in English)</span>
              </button>
            )}

            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-gray-900 hover:bg-black text-white text-xs py-2 px-5 rounded-full font-bold shadow-md cursor-pointer flex items-center gap-2 border border-red-500 transition animate-pulse"
              >
                <Square className="w-3 h-3 text-red-500 fill-red-500" />
                <span>Stop Recording</span>
              </button>
            )}

            {recordedVideoUrl && !isAnalyzing && (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs py-2 px-4 rounded font-semibold cursor-pointer flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Video</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeWithAi}
                  className="gov-btn-accent text-xs py-2 px-6 rounded font-bold shadow-md cursor-pointer flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Processing Video</span>
                </button>
              </>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50 px-4 py-2 rounded border border-indigo-200">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-700" />
                <span>{analysisStatusText || "Processing video with Google Gemini..."}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Video Tab */}
      {activeTab === "upload" && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/mkv,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!recordedVideoUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white/70 hover:bg-white rounded-lg p-8 text-center cursor-pointer transition max-w-lg mx-auto space-y-2.5"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-950">
                Click to browse or drag video file here
              </div>
              <div className="text-[11px] text-gray-500">
                Supports MP4, WebM, MOV (Max 40MB). Video must feature speech in English describing the community problem.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-w-lg mx-auto border border-gray-800 shadow-md">
                <video src={recordedVideoUrl} controls className="w-full h-full object-contain" />
              </div>
              <div className="text-center text-xs text-gray-600">
                Selected: <strong>{uploadedFile?.name || "Video Statement"}</strong> (
                {(Number(uploadedFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB)
              </div>
            </div>
          )}

          {/* Action buttons for upload */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {recordedVideoUrl && !isAnalyzing && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setRecordedVideoUrl(null);
                    setRecordedBlob(null);
                    setUploadedFile(null);
                    setAnalysisResult(null);
                  }}
                  className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs py-2 px-4 rounded font-semibold cursor-pointer flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Different Video</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeWithAi}
                  className="gov-btn-accent text-xs py-2 px-6 rounded font-bold shadow-md cursor-pointer flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Processing Video</span>
                </button>
              </>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50 px-4 py-2 rounded border border-indigo-200">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-700" />
                <span>{analysisStatusText || "Processing video with Google Gemini..."}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helpful Instructions */}
      <div className="text-[11px] text-gray-500 bg-white/70 p-2.5 rounded border border-indigo-100 space-y-1">
        <div className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span>💡</span>
          <span>Tips for Best Video Results:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 pl-1">
          <li>Speak clearly in English (Indian English accent is fully supported).</li>
          <li>Point camera at the affected infrastructure (damaged road, leaking handpump, sewage overflow).</li>
          <li>Explain what is broken, how many people are affected, and how long the issue has persisted.</li>
        </ul>
      </div>
    </div>
  );
}
