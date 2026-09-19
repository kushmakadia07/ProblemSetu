"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Camera,
  Star,
  ShieldCheck,
  GraduationCap,
  MapPin,
  ArrowRight,
  Upload,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import { store, Grievance } from "@/lib/store";

export default function VerifyResolutionPage() {
  const router = useRouter();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>(
    "The filtration unit is installed at our primary school handpump. Water has no bad odor or fluoride bitterness now, and our children drink safely. Thank you to the BIT Mesra student team and Jharkhand Govt!"
  );
  const [proofPhotoAttached, setProofPhotoAttached] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    store.setRole("citizen");
    const all = store.getGrievances();
    setGrievances(all);
    // Auto-select first verifying or default to the Palamu Fluoride grievance
    const verifying = all.find((g) => g.status === "CITIZEN_VERIFYING") || all[0];
    if (verifying) setSelectedTicketId(verifying.id);

    const unsub = store.subscribe(() => {
      setGrievances(store.getGrievances());
    });
    return () => unsub();
  }, []);

  const selectedGrievance = grievances.find((g) => g.id === selectedTicketId);

  const handlePermanentClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId) return;

    store.verifyResolution(
      selectedTicketId,
      rating,
      feedback,
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
    );

    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500">
        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>STAGE-GATE 6 OF 7: CITIZEN FINAL RESOLUTION GATE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Citizen Verification & Photographic Sign-Off
        </h1>
        <p className="text-xs text-gray-300 mt-1 max-w-2xl">
          Under the Government of Jharkhand policy, no grievance ticket can be closed by officials or universities until the affected citizen confirms the solution works on ground with photographic proof.
        </p>
      </div>

      {isSuccess ? (
        <div className="gov-card p-8 text-center border-2 border-emerald-500 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1b365d]">
            Grievance Permanently Closed & Verified!
          </h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Your photographic proof and satisfaction rating of <strong>{rating} Stars</strong> have been recorded in the public ledger. Final academic credits are now released to the university student team.
          </p>
          <div className="pt-2">
            <Link href="/citizen/dashboard" className="gov-btn-primary text-xs px-6 py-2.5 rounded font-bold">
              <span>Return to Citizen Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Select Grievance */}
          <div className="gov-card p-4">
            <label className="block text-xs font-bold text-[#1b365d] mb-1.5 uppercase">
              Select Grievance Requiring Your Final Closure:
            </label>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white font-semibold text-[#1b365d] focus:outline-hidden focus:border-[#1b365d]"
            >
              {grievances.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.id} — {g.title} ({g.district}) [{g.status}]
                </option>
              ))}
            </select>
          </div>

          {selectedGrievance && (
            <div className="gov-card border border-gray-300 rounded overflow-hidden">
              {/* University Delivered Prototype Report */}
              <div className="gov-card-header flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#1b365d]">
                  University Innovation Delivery Report: {selectedGrievance.id}
                </span>
                <span className="gov-badge gov-badge-active">{selectedGrievance.status}</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Grievance context */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1">
                  <div className="font-bold text-gray-900">{selectedGrievance.title}</div>
                  <div className="text-gray-600">
                    Location: {selectedGrievance.panchayat}, {selectedGrievance.block}, <strong>{selectedGrievance.district}</strong>
                  </div>
                  <div className="text-gray-600">{selectedGrievance.description}</div>
                </div>

                {/* Delivered Solution by University */}
                <div className="border border-blue-200 bg-blue-50/70 p-4 rounded text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#1b365d]">
                    <GraduationCap className="w-4 h-4 text-blue-800" />
                    <span>
                      Solution Fabricated by: {selectedGrievance.assignedUniversityName || "Birla Institute of Technology (BIT), Mesra"}
                    </span>
                  </div>
                  <div className="text-gray-800 leading-relaxed">
                    <strong>Technical Summary: </strong>
                    {selectedGrievance.resolutionSummary ||
                      "Installed modular gravity filtration chamber with activated alumina and local biochar adsorbent. Field water test certificate confirms fluoride drop to 0.65 mg/L."}
                  </div>
                  <div className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>NABL Accredited Water Quality Lab Test Passed • Tested on: {selectedGrievance.resolutionDate || "2026-09-02"}</span>
                  </div>
                </div>

                {/* Citizen Verification Form */}
                <form onSubmit={handlePermanentClose} className="space-y-4 pt-2 border-t border-gray-200">
                  <h3 className="font-bold text-sm text-[#1b365d]">
                    Citizen Physical Inspection & Satisfaction Rating
                  </h3>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Rate Solution Effectiveness (1 = Poor, 5 = Excellent) *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 text-2xl transition ${
                            star <= rating ? "text-amber-500 scale-110" : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-700 ml-2">
                        {rating} out of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Citizen Feedback & Ground Operational Notes *
                    </label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>

                  {/* Photographic Proof Upload */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs space-y-2">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#e87722]" />
                      <span>Photographic Proof of Working Prototype on Ground (Mandatory)</span>
                    </div>
                    <p className="text-gray-600 text-[11px]">
                      Take a live photograph showing the installed filtration unit / solar setup in active use in the village.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <label className="gov-btn-outline text-xs py-1.5 px-3 rounded cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Ground Inspection Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={() => setProofPhotoAttached(true)}
                          className="hidden"
                        />
                      </label>
                      {proofPhotoAttached && (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chhatauna_Panchayat_Water_Unit_Active.jpg (Geotagged & Verified)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => alert("Grievance disputed. University mentor has been notified to inspect and rectify defects within 7 working days.")}
                      className="w-full sm:w-auto text-xs text-red-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Dispute Resolution / Request Revision from University</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm py-2 px-6 rounded font-bold shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Permanently Close & Sign-Off Grievance</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
