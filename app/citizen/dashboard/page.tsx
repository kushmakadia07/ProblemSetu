"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FilePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ExternalLink,
  Camera
} from "lucide-react";
import { store, Grievance } from "@/lib/store";

export default function CitizenDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [auth, setAuth] = useState({ name: "", phone: "", aadhaar: "" });

  useEffect(() => {
    // Ensure active role is citizen
    store.setRole("citizen");
    setGrievances(store.getGrievances());
    setAuth(store.getCitizenAuth());
    const unsub = store.subscribe(() => {
      setGrievances(store.getGrievances());
      setAuth(store.getCitizenAuth());
    });
    return () => unsub();
  }, []);

  const filteredGrievances = selectedDistrict === "All"
    ? grievances
    : grievances.filter((g) => g.district.toLowerCase() === selectedDistrict.toLowerCase());

  const getStatusStepIndex = (status: Grievance["status"]): number => {
    switch (status) {
      case "LODGED": return 1;
      case "VERIFIED": return 2;
      case "ASSIGNED": return 3;
      case "PROTOTYPING": return 4;
      case "FIELD_TESTED": return 5;
      case "CITIZEN_VERIFYING": return 6;
      case "RESOLVED_CLOSED": return 7;
      case "ESCALATED": return 4;
      default: return 1;
    }
  };

  const stepsList = [
    "Lodged",
    "Admin Verified",
    "University Assigned",
    "Prototyping",
    "Field Tested",
    "Citizen Proof Required",
    "Closed"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-[#e87722] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTICATED CITIZEN PORTAL (CPGRAMS INTEGRATED)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            My Community Grievances & University Innovations
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Registered Citizen: <strong>{auth.name || "Birsa Munda Oraon"}</strong> • Phone: +91 {auth.phone ? auth.phone.replace(/.(?=.{4})/g, 'x') : "98351XXXXX"} • Aadhaar: **** {auth.aadhaar ? auth.aadhaar.slice(-4) : "4092"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/citizen/report-issue"
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-2"
          >
            <FilePlus className="w-4 h-4" />
            <span>Lodge New Grassroots Problem</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gov-card p-4 border-l-4 border-l-blue-800">
          <div className="text-xs font-semibold text-gray-600">Total Reported</div>
          <div className="text-2xl font-bold text-[#1b365d] mt-1">{grievances.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Under JSRIP-2025 track</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-amber-600">
          <div className="text-xs font-semibold text-gray-600">University Prototyping</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {grievances.filter((g) => ["ASSIGNED", "PROTOTYPING", "FIELD_TESTED"].includes(g.status)).length}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Engineering teams active</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-[#e87722]">
          <div className="text-xs font-semibold text-gray-600">Action Required by You</div>
          <div className="text-2xl font-bold text-[#e87722] mt-1">
            {grievances.filter((g) => g.status === "CITIZEN_VERIFYING").length}
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Upload Photo Proof to Close</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-emerald-600">
          <div className="text-xs font-semibold text-gray-600">Permanently Closed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {grievances.filter((g) => g.status === "RESOLVED_CLOSED").length}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Citizen Verified Solutions</div>
        </div>
      </div>

      {/* Filter and List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-300">
          <div>
            <h2 className="text-base font-bold text-[#1b365d]">Active Grievance Lifecycles</h2>
            <p className="text-xs text-gray-600">
              Each problem progresses across 7 rigorous stages with full SMS notification.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-700">Filter District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium text-gray-800"
            >
              <option value="All">All Districts</option>
              <option value="Palamu">Palamu</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="West Singhbhum">West Singhbhum</option>
              <option value="Dumka">Dumka</option>
              <option value="East Singhbhum">East Singhbhum</option>
              <option value="Sahebganj">Sahebganj</option>
            </select>
          </div>
        </div>

        {/* Tickets Cards */}
        <div className="space-y-5">
          {filteredGrievances.map((item) => {
            const stepIdx = getStatusStepIndex(item.status);
            return (
              <div key={item.id} className="gov-card p-5 border border-gray-300 rounded shadow-xs">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1b365d] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      {item.id}
                    </span>
                    <span className="gov-badge gov-badge-saffron">{item.category}</span>
                    <span className={`gov-badge ${item.urgency === "Critical" ? "bg-red-100 text-red-800 border-red-200" : "bg-gray-100 text-gray-800"}`}>
                      Urgency: {item.urgency}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>Reported: {item.submittedAt}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#1b365d] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#e87722]" />
                    <span>
                      {item.panchayat} Panchayat, {item.block} Block, <strong>{item.district} District</strong> (GPS: {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)})
                    </span>
                  </div>
                </div>

                {/* Assigned University Badge if available */}
                {item.assignedUniversityName && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#1b365d]">
                        <GraduationCap className="w-4 h-4 text-blue-700" />
                        <span>Allocated Institution: {item.assignedUniversityName}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Dept: {item.assignedDepartment}
                      </span>
                    </div>
                    <div className="text-gray-600 text-[11px] mt-1">
                      Student Lead Team: <strong>{item.studentTeamName}</strong> • Faculty Mentor: {item.facultyMentorName}
                    </div>
                  </div>
                )}

                {/* 7-Step Lifecycle Stepper */}
                <div className="py-3 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-700 mb-2">Stage-Gate Lifecycle Progress:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {stepsList.map((step, idx) => {
                      const isCompleted = stepIdx > idx + 1;
                      const isCurrent = stepIdx === idx + 1;
                      return (
                        <div
                          key={step}
                          className={`p-2 rounded text-center border text-[11px] font-semibold transition ${
                            isCompleted
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : isCurrent
                              ? "bg-amber-100 border-[#e87722] text-[#e87722] ring-2 ring-amber-300 font-bold"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                        >
                          <div className="text-[9px] uppercase tracking-wider mb-0.5">
                            Stage {idx + 1}
                          </div>
                          <div className="truncate">{step}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action / Resolution Status */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    {item.status === "CITIZEN_VERIFYING" && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Action Required: University has deployed solution. Please verify and upload proof.</span>
                      </span>
                    )}
                    {item.status === "RESOLVED_CLOSED" && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolution Verified & Signed-Off on {item.resolutionDate} (Rating: {item.citizenRating} ★)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "CITIZEN_VERIFYING" && (
                      <Link
                        href={`/citizen/verify-resolution?id=${item.id}`}
                        className="gov-btn-accent text-xs py-1.5 px-4 font-bold rounded flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Ground Proof to Close Ticket</span>
                      </Link>
                    )}
                    <Link
                      href="/citizen/report-issue"
                      className="text-xs text-[#1b365d] hover:underline font-semibold"
                    >
                      Report Related Issue
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
