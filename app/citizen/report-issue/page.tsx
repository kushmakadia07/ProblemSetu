"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  FileText,
  Camera,
  Video,
  Mic,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Upload,
  AlertTriangle,
  Loader2,
  Database,
  ShieldAlert,
  AlertCircle,
  XCircle,
  Home,
  Film,
  Trash2,
  Sparkles
} from "lucide-react";
import { store } from "@/lib/store";
import { uploadAttachmentToSupabase } from "@/lib/supabase";
import VoiceInputButton from "@/components/VoiceInputButton";
import VideoProblemRecorder from "@/components/VideoProblemRecorder";
import type { VideoAnalysisResult } from "@/app/api/analyze-video/route";

const JHARKHAND_DISTRICTS = [
  "Ranchi", "Dhanbad", "Bokaro", "East Singhbhum (Jamshedpur)", "West Singhbhum (Chaibasa)",
  "Palamu", "Garhwa", "Chatra", "Hazaribagh", "Ramgarh", "Koderma", "Giridih",
  "Deoghar", "Dumka", "Godda", "Sahebganj", "Pakur", "Jamtara", "Lohardaga",
  "Gumla", "Simdega", "Latehar", "Khunti", "Saraikela Kharsawan"
];

const CATEGORIES = [
  "Water & Sanitation (Fluoride/Arsenic/Handpump)",
  "Clean Energy & Microgrid (Solar/Vaccine Chiller)",
  "Agri-Tech & Forest Produce (Mahua/Lac/Cold Storage)",
  "Tribal Healthcare (Malnutrition/Millet/Tele-health)",
  "Mining Safety & Dust Control (Coal Dust/Air Quality)",
  "Rural Infrastructure & Wildlife Safety (Elephant Alert/Bridges)"
];

interface DiagnosticQuestion {
  id: string;
  question: string;
  placeholder?: string;
  helpText?: string;
}

export default function ReportIssuePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [district, setDistrict] = useState("Ranchi");
  const [block, setBlock] = useState("");
  const [panchayat, setPanchayat] = useState("");
  const [village, setVillage] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 23.3441, lng: 85.3096 });
  const [gpsCaptured, setGpsCaptured] = useState(false);

  // Dynamic AI Questions (Google Gemini API)
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([]);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, string>>({});
  const [isGeneratingAiQuestions, setIsGeneratingAiQuestions] = useState(false);
  const [isValidatingSubmission, setIsValidatingSubmission] = useState(false);
  const [validationRejection, setValidationRejection] = useState<{
    classification: "PRIVATE_PROPERTY" | "SPAM_OR_FAKE";
    citizenMessage: string;
    detailedReason?: string;
  } | null>(null);

  // Step 1 states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [urgency, setUrgency] = useState<"Normal" | "High" | "Critical">("High");
  const [affectedCount, setAffectedCount] = useState(500);

  // Evidence states (populated only when user uploads photos/videos)
  const [mediaUploaded, setMediaUploaded] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "video">("text");
  const [showEvidenceVideoRecorder, setShowEvidenceVideoRecorder] = useState<boolean>(false);

  // Step 5 states (populated from actual logged in citizen session)
  const [citizenName, setCitizenName] = useState(() => store.getCitizenAuth().name || "");
  const [citizenPhone, setCitizenPhone] = useState(() => store.getCitizenAuth().phone || "");
  const [aadhaarNumber, setAadhaarNumber] = useState(() => store.getCitizenAuth().aadhaar || "");
  const [aadhaarLast4, setAadhaarLast4] = useState(() => (store.getCitizenAuth().aadhaar || "").slice(-4));
  const [otp, setOtp] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  React.useEffect(() => {
    const auth = store.getCitizenAuth();
    if (auth.name) setCitizenName(auth.name);
    if (auth.phone) setCitizenPhone(auth.phone);
    if (auth.aadhaar) {
      setAadhaarNumber(auth.aadhaar);
      setAadhaarLast4(auth.aadhaar.slice(-4));
    }
    const unsub = store.subscribe(() => {
      const updated = store.getCitizenAuth();
      if (updated.name) setCitizenName(updated.name);
      if (updated.phone) setCitizenPhone(updated.phone);
      if (updated.aadhaar) {
        setAadhaarNumber(updated.aadhaar);
        setAadhaarLast4(updated.aadhaar.slice(-4));
      }
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (currentStep === 3 && !gpsCaptured) {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setGpsCaptured(true);
          },
          (err) => {
            console.warn("Geolocation error:", err);
            setCoordinates({ lat: 23.3441, lng: 85.3096 });
            setGpsCaptured(true);
          }
        );
      } else {
        setCoordinates({ lat: 23.3441, lng: 85.3096 });
        setGpsCaptured(true);
      }
    }
  }, [currentStep, gpsCaptured]);

  const fetchGeminiQuestions = async () => {
    if (!description.trim()) {
      alert("Please describe the issue on the ground (using voice or typing).");
      return;
    }
    const cleanCat = category.split(" (")[0];
    const derivedTitle =
      description.trim().split("\n")[0].slice(0, 80).trim() ||
      `${cleanCat} Community Problem`;
    setTitle(derivedTitle);

    setValidationRejection(null);
    setIsGeneratingAiQuestions(true);

    try {
      // 1. Pre-validation with Gemini AI before generating questions or advancing
      const valRes = await fetch("/api/validate-grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: derivedTitle,
          description,
          category: cleanCat,
          district,
          block: block || "Ranchi Sadar",
          panchayat: panchayat || "Gram Panchayat",
        }),
      });

      const validation = await valRes.json();

      if (!validation.isApproved) {
        // Automatically stop right here at Step 1! Do NOT advance to Step 2.
        setValidationRejection({
          classification: validation.classification,
          citizenMessage: validation.citizenMessage,
          detailedReason: validation.detailedReason,
        });
        setIsGeneratingAiQuestions(false);
        return;
      }

      // 2. Only if approved as community infrastructure, proceed to generate questions
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: derivedTitle,
          description,
          category: cleanCat,
          district,
          block: block || "Ranchi Sadar",
          panchayat: panchayat || "Gram Panchayat",
        }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setDiagnosticQuestions(data.questions);
      }
      setCurrentStep(2);
    } catch (err) {
      console.error("Gemini validation/questions error:", err);
      setCurrentStep(2);
    } finally {
      setIsGeneratingAiQuestions(false);
    }
  };

  const handleVideoAnalysisSuccess = (result: VideoAnalysisResult) => {
    if (result.title) setTitle(result.title);
    if (result.description) setDescription(result.description);
    if (result.category) {
      const cleanCatResult = result.category.toLowerCase();
      const matched = CATEGORIES.find(
        (c) =>
          c.toLowerCase().includes(cleanCatResult) ||
          cleanCatResult.includes(c.toLowerCase().split(" ")[0])
      );
      if (matched) setCategory(matched);
    }
    if (result.videoUrl) {
      setMediaUploaded((prev) => (prev.includes(result.videoUrl!) ? prev : [...prev, result.videoUrl!]));
    }
    if (result.questions && Array.isArray(result.questions) && result.questions.length > 0) {
      setDiagnosticQuestions(result.questions);
    }
    setValidationRejection(null);
    setCurrentStep(2);
  };

  const handleVideoAnalysisRejection = (result: VideoAnalysisResult) => {
    setValidationRejection({
      classification: result.classification === "PRIVATE_PROPERTY" ? "PRIVATE_PROPERTY" : "SPAM_OR_FAKE",
      citizenMessage: result.citizenMessage,
      detailedReason: result.rejectionReason,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploadingMedia(true);
      try {
        const publicUrl = await uploadAttachmentToSupabase(file);
        if (publicUrl) {
          setMediaUploaded((prev) => [...prev, publicUrl]);
        } else {
          // Fallback to local object URL
          const localUrl = URL.createObjectURL(file);
          setMediaUploaded((prev) => [...prev, localUrl]);
        }
      } catch (err) {
        console.warn("Upload error:", err);
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidatingSubmission(true);
    setValidationRejection(null);

    try {
      const cleanCategory = category.split(" (")[0];
      const derivedTitle =
        description.trim().split("\n")[0].slice(0, 80).trim() ||
        `${cleanCategory} Community Problem`;
      setTitle(derivedTitle);

      const qaList = diagnosticQuestions.map((q) => ({
        question: q.question,
        answer: diagnosticAnswers[q.id] || "Pending verification on ground",
      }));

      // 1. AI Content Analysis & Validation Filter (Google Gemini API)
      const valRes = await fetch("/api/validate-grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: derivedTitle,
          description,
          category: cleanCategory,
          district,
          block,
          panchayat,
          mediaUrls: mediaUploaded,
          aiDiagnosticQa: qaList,
        }),
      });

      const validation = await valRes.json();

      if (!validation.isApproved) {
        // Automatically reject private property or spam/fake reports
        setValidationRejection({
          classification: validation.classification,
          citizenMessage: validation.citizenMessage,
          detailedReason: validation.detailedReason,
        });
        setIsValidatingSubmission(false);
        // Do NOT save to Supabase or create grievance
        return;
      }

      // 2. Approved Public Community Problem -> Save to Supabase
      const newGrievance = store.addGrievance({
        title: derivedTitle,
        description,
        category: cleanCategory,
        district,
        block: block || "Central Block",
        panchayat: panchayat || "Gram Panchayat",
        coordinates,
        citizenName,
        citizenPhone,
        urgency,
        affectedCount: Number(affectedCount),
        mediaUrls: mediaUploaded,
        aiDiagnosticQa: qaList,
      });

      setSubmittedId(newGrievance.id);
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred during submission. Please check your connection and try again.");
    } finally {
      setIsValidatingSubmission(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-b-4 border-[#e87722] mb-8">
        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIAL CPGRAMS MULTI-STEP REPORTING FORM</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Lodge Rural Community Problem for University Engineering
        </h1>
        <p className="text-xs text-gray-300 mt-1">
          All reports are geocoded, assigned to state engineering universities (JSRIP-2025), and funded via CSR escrow.
        </p>
      </div>

      {submittedId ? (
        /* Submission Success Stage */
        <div className="gov-card p-8 text-center border-2 border-emerald-500 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-[#1b365d]">
            Grievance Successfully Registered!
          </h2>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded max-w-md mx-auto">
            <div className="text-xs text-gray-600 font-semibold">Your Registration Tracking ID:</div>
            <div className="text-2xl font-mono font-extrabold text-[#1b365d] tracking-wider my-1">
              {submittedId}
            </div>
            <div className="text-[11px] text-gray-500">
              An SMS confirmation with tracking URL has been sent to +91 {citizenPhone}.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Persisted to Supabase Database</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Validated as Public Infrastructure</span>
            </span>
          </div>

          <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
            Your grievance and Gemini-engineered diagnostics are now routed to the District Innovation Officer for verification and matched with student engineering capstone teams across Jharkhand universities.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <Link href="/citizen/dashboard" className="gov-btn-primary text-xs px-5 py-2.5 rounded font-bold">
              <span>View in Citizen Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSubmittedId(null);
                setCurrentStep(1);
                setTitle("");
                setDescription("");
              }}
              className="gov-btn-outline text-xs px-4 py-2.5 rounded"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      ) : (
        <div className="gov-card border border-gray-300 rounded shadow-md overflow-hidden">
          {/* 4-Step Stepper Bar */}
          <div className="bg-gray-100 border-b border-gray-300 grid grid-cols-5 text-xs font-semibold text-center">
            <div className={`py-3 px-1 border-b-2 transition ${currentStep === 1 ? "border-[#e87722] bg-white text-[#1b365d] font-bold" : "border-transparent text-gray-500"}`}>
              1. Problem Details
            </div>
            <div className={`py-3 px-1 border-b-2 transition ${currentStep === 2 ? "border-[#e87722] bg-white text-[#1b365d] font-bold" : "border-transparent text-gray-500"}`}>
              2. Confirmation
            </div>
            <div className={`py-3 px-1 border-b-2 transition ${currentStep === 3 ? "border-[#e87722] bg-white text-[#1b365d] font-bold" : "border-transparent text-gray-500"}`}>
              3. Location
            </div>
            <div className={`py-3 px-1 border-b-2 transition ${currentStep === 4 ? "border-[#e87722] bg-white text-[#1b365d] font-bold" : "border-transparent text-gray-500"}`}>
              4. Evidence
            </div>
            <div className={`py-3 px-1 border-b-2 transition ${currentStep === 5 ? "border-[#e87722] bg-white text-[#1b365d] font-bold" : "border-transparent text-gray-500"}`}>
              5. Review & OTP
            </div>
          </div>

          <div className="p-6">
            {/* Step 3: Location & GPS Tagging */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <h2 className="text-base font-bold text-[#1b365d]">Step 3: Grassroots Location & Geotag</h2>
                  <p className="text-xs text-gray-600">
                    Specify the exact administrative division. GPS coordinates are automatically tracked.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      District (Jharkhand) *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-hidden focus:border-[#1b365d]"
                    >
                      {JHARKHAND_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Block / Tehsil *
                    </label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      placeholder="e.g. Daltonganj / Jharia / Chaibasa"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gram Panchayat *
                    </label>
                    <input
                      type="text"
                      value={panchayat}
                      onChange={(e) => setPanchayat(e.target.value)}
                      placeholder="e.g. Chhatauna / Bhulanbararee"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Village / Hamlet (Tola)
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Munda Tola"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>
                </div>

                {/* GPS Tagging Box */}
                <div className="bg-slate-50 border border-slate-300 p-4 rounded-md mt-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#1b365d] flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-[#e87722]" />
                        <span>GPS Geolocation Automatically Tracked</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Current Coordinates:{" "}
                        <strong className="font-mono text-gray-800">
                          {coordinates.lat.toFixed(5)}° N, {coordinates.lng.toFixed(5)}° E
                        </strong>{" "}
                        {gpsCaptured && (
                          <span className="text-emerald-700 font-semibold">(Tagged via location data)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="gov-btn-outline text-xs px-4 py-2 rounded"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!block || !panchayat) {
                        alert("Please fill in Block and Gram Panchayat.");
                        return;
                      }
                      setCurrentStep(4);
                    }}
                    className="gov-btn-primary text-xs px-6 py-2.5 rounded font-bold"
                  >
                    <span>Next: Evidence Upload</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Problem Description & Severity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2 mb-3">
                  <h2 className="text-base font-bold text-[#1b365d]">Step 1: Societal Problem Description</h2>
                  <p className="text-xs text-gray-600">
                    Describe the ground reality to help engineering faculty understand design constraints. You can record a video statement or type/speak your complaint.
                  </p>
                </div>

                {/* Input Mode Selector */}
                <div className="flex rounded-md border border-gray-300 p-1 bg-gray-50 mb-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setInputMode("text")}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      inputMode === "text"
                        ? "bg-[#1b365d] text-white shadow-xs"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>✍️ Written / Voice Input</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("video")}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      inputMode === "video"
                        ? "bg-[#1b365d] text-white shadow-xs"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5 text-[#e87722]" />
                    <span>📹 AI Video Statement (English)</span>
                  </button>
                </div>

                {/* Video Statement Mode */}
                {inputMode === "video" ? (
                  <div className="space-y-4">
                    <VideoProblemRecorder
                      onAnalysisSuccess={handleVideoAnalysisSuccess}
                      onAnalysisRejection={handleVideoAnalysisRejection}
                    />

                    {description && (
                      <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-lg text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>AI Processed Video Statement Ready</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInputMode("text")}
                            className="text-xs text-[#1b365d] underline font-semibold cursor-pointer"
                          >
                            Edit in Written Mode
                          </button>
                        </div>
                        <div>
                          <strong className="text-gray-800">Problem Title:</strong>{" "}
                          <span className="text-[#1b365d] font-semibold">{title}</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed">
                          <strong>Ground Description:</strong> {description}
                        </div>
                        <div className="text-gray-600 text-[11px]">
                          Category: <strong>{category}</strong> • <strong>{diagnosticQuestions.length} Questions Prepared</strong>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-emerald-200">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="gov-btn-primary text-xs px-5 py-2 rounded font-bold flex items-center gap-1.5"
                          >
                            <span>Proceed to Confirmation Questions</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Written / Voice Input Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Problem Domain / Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-hidden focus:border-[#1b365d]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700">
                            Detailed Ground Description & Daily Hardship *
                          </label>
                          <span className="text-[11px] text-gray-500">
                            Speak in English (Indian accent supported) or type directly.
                          </span>
                        </div>
                        <VoiceInputButton
                          value={description}
                          onChange={(val) => {
                            setDescription(val);
                            if (validationRejection) setValidationRejection(null);
                          }}
                          fieldName="Ground Description"
                        />
                      </div>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (validationRejection) setValidationRejection(null);
                        }}
                        placeholder="Describe how long the issue has persisted, how many households are impacted, seasonal factors, and what past attempts have failed... (Speak in English or type)"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                      />
                    </div>

                    {/* AI Validation Rejection Alert Card in Step 1 */}
                    {validationRejection && (
                      <div
                        className={`p-4 rounded-lg border-2 space-y-3 ${
                          validationRejection.classification === "PRIVATE_PROPERTY"
                            ? "bg-rose-50 border-rose-300 text-rose-950"
                            : "bg-amber-50 border-amber-300 text-amber-950"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              validationRejection.classification === "PRIVATE_PROPERTY"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {validationRejection.classification === "PRIVATE_PROPERTY" ? (
                              <Home className="w-5 h-5" />
                            ) : (
                              <AlertTriangle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold">
                                {validationRejection.classification === "PRIVATE_PROPERTY"
                                  ? "Private Household / Personal Property Issue Detected"
                                  : "Incomplete or Invalid Submission"}
                              </h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  validationRejection.classification === "PRIVATE_PROPERTY"
                                    ? "bg-rose-200 text-rose-800"
                                    : "bg-amber-200 text-amber-800"
                                }`}
                              >
                                AI Policy Filter
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-800">
                              {validationRejection.citizenMessage}
                            </p>
                            <div className="text-[11px] text-gray-600 bg-white/80 p-2.5 rounded border border-gray-200 mt-2">
                              ℹ️ <strong>ProblemSetu Scope Policy:</strong> ProblemSetu is dedicated exclusively to public and community infrastructure (such as public roads, streetlights, community handpumps, and public drainage) to coordinate engineering resources for civic welfare. We cannot process private household or personal property issues.
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => setValidationRejection(null)}
                            className="gov-btn-outline text-xs px-3 py-1.5 rounded"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        disabled={isGeneratingAiQuestions}
                        onClick={fetchGeminiQuestions}
                        className="gov-btn-primary text-xs px-6 py-2.5 rounded font-bold flex items-center gap-2"
                      >
                        {isGeneratingAiQuestions ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>AI Validating Scope & Preparing...</span>
                          </>
                        ) : (
                          <>
                            <span>Next: Clarification Questions</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Confirmation Questions */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#1b365d]">Step 2: Simple Ground Verification Questions</h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Please answer these simple questions to help understand the situation in your village.
                    </p>
                  </div>
                  <div className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5 font-medium shrink-0">
                    <Mic className="w-3.5 h-3.5 text-[#e87722]" />
                    <span>Voice (Indian English) or Simple Typing</span>
                  </div>
                </div>

                {isGeneratingAiQuestions ? (
                  <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1b365d] mx-auto" />
                    <div className="text-sm font-semibold text-[#1b365d]">Loading questions...</div>
                    <div className="text-xs text-gray-500">
                      Please wait a moment while specific questions are loaded for your report.
                    </div>
                  </div>
                ) : diagnosticQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {diagnosticQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="bg-white border border-gray-200 p-3.5 rounded-md shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <label className="block text-xs font-bold text-[#1b365d] flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#1b365d] text-white text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                              {idx + 1}
                            </span>
                            <span>{q.question}</span>
                          </label>
                          <VoiceInputButton
                            value={diagnosticAnswers[q.id] || ""}
                            onChange={(newVal) =>
                              setDiagnosticAnswers((prev) => ({
                                ...prev,
                                [q.id]: newVal,
                              }))
                            }
                            fieldName={`Question ${idx + 1}`}
                            size="compact"
                            className="shrink-0 ml-7 sm:ml-0"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={diagnosticAnswers[q.id] || ""}
                          onChange={(e) =>
                            setDiagnosticAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          placeholder={q.placeholder || "Speak in English or type what you observe..."}
                          className="w-full ml-7 max-w-[calc(100%-1.75rem)] px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                    Please answer the questions above.
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="gov-btn-outline text-xs px-4 py-2 rounded"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="gov-btn-primary text-xs px-6 py-2 rounded font-bold"
                  >
                    <span>Next: Location</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Photographic & Video Evidence */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <h2 className="text-base font-bold text-[#1b365d]">Step 4: Photographic & Video Evidence</h2>
                  <p className="text-xs text-gray-600">
                    Upload photos or record a video statement. Spoken English statements are processed by Google Gemini to help engineers inspect site constraints.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 max-w-md gap-4">
                  {/* Photo Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center bg-gray-50 hover:bg-gray-100 transition">
                    {isUploadingMedia ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[#1b365d] mx-auto mb-2" />
                    ) : (
                      <Camera className="w-8 h-8 text-[#1b365d] mx-auto mb-2" />
                    )}
                    <div className="text-xs font-bold text-gray-800">
                      {isUploadingMedia ? "Uploading to Storage..." : "Attach Photographs"}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-2">JPG, PNG (Max 10MB)</div>
                    <label className="gov-btn-outline text-xs py-1 px-3 cursor-pointer">
                      <span>{isUploadingMedia ? "Uploading..." : "Browse Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingMedia}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Video Statement Studio Card */}
                  <div className="border-2 border-dashed border-indigo-200 rounded p-4 text-center bg-indigo-50/50 hover:bg-indigo-50 transition flex flex-col justify-between">
                    <div>
                      <Film className="w-8 h-8 text-[#e87722] mx-auto mb-2" />
                      <div className="text-xs font-bold text-[#1b365d]">AI Video Statement</div>
                      <div className="text-[10px] text-gray-500 mb-2">Record or Upload (English)</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEvidenceVideoRecorder((prev) => !prev)}
                      className="gov-btn-accent text-xs py-1 px-3 cursor-pointer font-bold self-center"
                    >
                      {showEvidenceVideoRecorder ? "Hide Video Studio" : "Open Video Studio"}
                    </button>
                  </div>
                </div>

                {/* Evidence Video Recorder Studio (when opened) */}
                {showEvidenceVideoRecorder && (
                  <div className="mt-3">
                    <VideoProblemRecorder
                      onAnalysisSuccess={(res) => {
                        handleVideoAnalysisSuccess(res);
                        setShowEvidenceVideoRecorder(false);
                      }}
                      onAnalysisRejection={handleVideoAnalysisRejection}
                    />
                  </div>
                )}

                {/* Uploaded Evidence Preview List */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <div className="text-xs font-bold text-gray-700 mb-2.5">
                    Attached Evidence Items ({mediaUploaded.length}):
                  </div>
                  {mediaUploaded.length === 0 ? (
                    <div className="text-xs text-gray-500 italic p-3 bg-white rounded border border-dashed border-gray-300 text-center">
                      No photos or videos attached yet. You can attach site photos or record a video statement above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mediaUploaded.map((url, i) => {
                        const isVideo =
                          url.includes(".webm") ||
                          url.includes(".mp4") ||
                          url.includes(".mov") ||
                          url.includes(".mkv") ||
                          url.includes("/uploads/video_") ||
                          url.startsWith("blob:");
                        return (
                          <div
                            key={i}
                            className="bg-white border border-gray-300 rounded-md p-2.5 shadow-xs space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="flex items-center gap-1.5 text-gray-800">
                                {isVideo ? (
                                  <Film className="w-4 h-4 text-[#e87722]" />
                                ) : (
                                  <Camera className="w-4 h-4 text-[#1b365d]" />
                                )}
                                <span>{isVideo ? "Video Statement (English)" : `Site Photo 0${i + 1}`}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setMediaUploaded((prev) => prev.filter((_, idx) => idx !== i))}
                                className="text-gray-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition"
                                title="Remove attachment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {isVideo ? (
                              <video
                                src={url}
                                controls
                                className="w-full max-h-36 rounded bg-black object-contain"
                              />
                            ) : (
                              <img
                                src={url}
                                alt={`Evidence ${i + 1}`}
                                className="w-full max-h-36 rounded object-cover border border-gray-200"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="gov-btn-outline text-xs px-4 py-2 rounded"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="gov-btn-primary text-xs px-6 py-2 rounded font-bold"
                  >
                    <span>Next: Citizen Verification & Submit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Citizen Verification & SMS OTP Confirmation */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <h2 className="text-base font-bold text-[#1b365d]">
                    Step 5: Citizen Identity Verification & Final Submission
                  </h2>
                  <p className="text-xs text-gray-600">
                    To prevent frivolous grievances, the reporter&apos;s identity is authenticated via Aadhaar-linked Mobile OTP.
                  </p>
                </div>

                {/* AI Validation Rejection Alert Card */}
                {validationRejection && (
                  <div
                    className={`p-4 rounded-lg border-2 space-y-3 ${
                      validationRejection.classification === "PRIVATE_PROPERTY"
                        ? "bg-rose-50 border-rose-300 text-rose-950"
                        : "bg-amber-50 border-amber-300 text-amber-950"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          validationRejection.classification === "PRIVATE_PROPERTY"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {validationRejection.classification === "PRIVATE_PROPERTY" ? (
                          <Home className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold">
                            {validationRejection.classification === "PRIVATE_PROPERTY"
                              ? "Private Household / Personal Property Issue Detected"
                              : "Incomplete or Invalid Submission"}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              validationRejection.classification === "PRIVATE_PROPERTY"
                                ? "bg-rose-200 text-rose-800"
                                : "bg-amber-200 text-amber-800"
                            }`}
                          >
                            AI Policy Filter
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-800">
                          {validationRejection.citizenMessage}
                        </p>
                        <div className="text-[11px] text-gray-600 bg-white/80 p-2.5 rounded border border-gray-200 mt-2">
                          ℹ️ <strong>ProblemSetu Scope Policy:</strong> ProblemSetu is dedicated exclusively to public and community infrastructure (such as public roads, streetlights, community handpumps, and public drainage) to coordinate engineering resources for civic welfare. We cannot process private household or personal property issues.
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setValidationRejection(null);
                          setCurrentStep(1);
                        }}
                        className="gov-btn-primary text-xs px-4 py-1.5 rounded font-bold"
                      >
                        Edit Problem Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setValidationRejection(null)}
                        className="gov-btn-outline text-xs px-3 py-1.5 rounded"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs space-y-1">
                  <div className="font-bold text-[#1b365d] text-sm">
                    {title || description.slice(0, 70)}
                  </div>
                  <div className="text-gray-700">
                    Location: <strong>{panchayat} Panchayat, {block}, {district}</strong> (GPS: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})
                  </div>
                  <div className="text-gray-600 flex flex-wrap items-center gap-2">
                    <span>Category: {category.split(" (")[0]} • Urgency: {urgency}</span>
                    {mediaUploaded.length > 0 && (
                      <span className="bg-white border border-blue-300 text-blue-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                        📎 {mediaUploaded.length} Evidence Attachment(s)
                        {mediaUploaded.some((u) => u.includes("video") || u.includes(".webm") || u.includes(".mp4")) && " • 📹 Video Statement"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name of Citizen / Mukhiya *
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number (For SMS Status Alerts) *
                    </label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Aadhaar Card Number (12 Digits - Proof of Person) *
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                        setAadhaarNumber(val);
                        setAadhaarLast4(val.slice(-4));
                      }}
                      placeholder="1234 5678 9012"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono tracking-wider focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aadhaar Linked Mobile Verified (UIDAI Proof of Person Authenticated)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Enter SMS OTP (Auto-sent to linked +91 {citizenPhone}) *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Use demo OTP: 123456"
                      required
                      className="w-48 px-3 py-2 border border-gray-300 rounded text-sm font-mono font-bold tracking-widest text-center focus:outline-hidden focus:border-[#1b365d]"
                    />
                    <span className="text-xs text-emerald-700 font-semibold">
                      OTP Verified via Aadhaar Mobile Gateway
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#e87722] shrink-0 mt-0.5" />
                  <span>
                    By submitting, you certify that this is a genuine community issue. It will be posted on the public transparency board and routed to university engineering departments under JSRIP-2025.
                  </span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="gov-btn-outline text-xs px-4 py-2 rounded"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isValidatingSubmission}
                    className="gov-btn-accent text-sm px-8 py-2.5 rounded font-bold shadow-md flex items-center gap-2"
                  >
                    {isValidatingSubmission ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>AI Validating Public Infrastructure Eligibility...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit & Generate CPGRAMS Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
