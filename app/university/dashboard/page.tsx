"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Layers,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  FileText,
  AlertTriangle,
  Award
} from "lucide-react";
import { store, Grievance, Proposal } from "@/lib/store";

export default function UniversityDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("Birla Institute of Technology (BIT), Mesra");
  const [domainFilter, setDomainFilter] = useState<string>("All");

  useEffect(() => {
    store.setRole("university");
    setGrievances(store.getGrievances());
    setProposals(store.getProposals());
    const unsub = store.subscribe(() => {
      setGrievances(store.getGrievances());
      setProposals(store.getProposals());
    });
    return () => unsub();
  }, []);

  const filteredGrievances = grievances.filter((g) => {
    if (domainFilter !== "All" && !g.category.toLowerCase().includes(domainFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Institutional Banner */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-[#e87722] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>ACADEMIA & RESEARCH PORTAL (JSRIP-2025 & NEP 2020)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Routed Grassroots Problems & Capstone Innovation Hub
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-300 mt-1">
            <span>Logged in Institute:</span>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="bg-blue-950 border border-blue-700 text-amber-300 px-2 py-1 rounded font-bold text-xs"
            >
              <option value="Birla Institute of Technology (BIT), Mesra">BIT Mesra (Ranchi)</option>
              <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad</option>
              <option value="NIT Jamshedpur">NIT Jamshedpur</option>
              <option value="Birsa Agricultural University (BAU), Kanke">BAU Kanke (Ranchi)</option>
              <option value="Kolhan University Engineering College">Kolhan University (Chaibasa)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/university/proposals"
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Form Student Team & Draft Proposal</span>
          </Link>
          <Link
            href="/about"
            className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm py-2 px-3 rounded font-medium"
          >
            <span>NEP 2020 Guidelines</span>
          </Link>
        </div>
      </div>

      {/* University Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gov-card p-4 border-l-4 border-l-blue-800">
          <div className="text-xs font-semibold text-gray-600">Routed Verified Problems</div>
          <div className="text-2xl font-bold text-[#1b365d] mt-1">{grievances.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Assigned by State Council</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-amber-600">
          <div className="text-xs font-semibold text-gray-600">Submitted Proposals</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{proposals.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">TRL 4 - TRL 7 Feasibility Reports</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-emerald-600">
          <div className="text-xs font-semibold text-gray-600">CSR Matched / Funded</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {proposals.filter((p) => p.status === "FUNDED" || p.status === "CSR_MATCHED").length}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Tata Steel & Coal India Escrow</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-purple-600">
          <div className="text-xs font-semibold text-gray-600">NEP Credits Awardable</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">380 Credits</div>
          <div className="text-[10px] text-purple-700 mt-0.5">DigiLocker ABC Synchronized</div>
        </div>
      </div>

      {/* Filter and Problem Stream */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
          <div>
            <h2 className="text-base font-bold text-[#1b365d]">
              Verified Societal Problems Allocated for Engineering Feasibility
            </h2>
            <p className="text-xs text-gray-600">
              Select a citizen grievance to assemble a student capstone team and draft a TRL feasibility proposal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-gray-700">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium text-gray-800"
            >
              <option value="All">All Engineering Domains</option>
              <option value="Water">Water & Sanitation</option>
              <option value="Energy">Clean Energy & Microgrids</option>
              <option value="Agri">Agri-Tech & Forest Produce</option>
              <option value="Mining">Mining Safety & Dust Control</option>
              <option value="Health">Tribal Healthcare</option>
            </select>
          </div>
        </div>

        {/* Grid of Problem Cards */}
        {filteredGrievances.length === 0 ? (
          <div className="gov-card p-8 text-center border border-dashed border-gray-300 rounded space-y-3">
            <GraduationCap className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-[#1b365d]">No Routed Grassroots Problems Yet</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              When citizens lodge problems on the ground, state council verified issues will be routed here for engineering student capstone teams and faculty mentors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGrievances.map((grv) => {
              const hasExistingProposal = proposals.some((p) => p.grievanceId === grv.id);
              return (
                <div key={grv.id} className="gov-card p-5 border border-gray-300 rounded hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="gov-badge gov-badge-saffron">{grv.category}</span>
                      <span className="text-xs font-mono font-bold text-[#1b365d] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {grv.id}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#1b365d] leading-snug mb-2">
                      {grv.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#e87722]" />
                      <span>
                        {grv.panchayat}, {grv.block}, <strong>{grv.district} District</strong> (GPS: {grv.coordinates.lat.toFixed(3)}, {grv.coordinates.lng.toFixed(3)})
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 mb-3">
                      {grv.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200 mb-3">
                      <div>
                        <span className="text-gray-500">Urgency:</span>{" "}
                        <strong className={grv.urgency === "Critical" ? "text-red-700" : "text-gray-800"}>
                          {grv.urgency}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Beneficiaries:</span>{" "}
                        <strong>~{grv.affectedCount.toLocaleString()} Citizens</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">NEP Credits:</span>{" "}
                        <strong className="text-purple-700">12 Credits</strong>
                      </div>
                    </div>

                    {grv.assignedUniversityName && (
                      <div className="text-[11px] text-emerald-800 font-semibold mb-3 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Assigned to: {grv.assignedUniversityName} ({grv.studentTeamName})</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="gov-badge gov-badge-active">{grv.status}</span>
                    <Link
                      href={`/university/proposals?grievanceId=${grv.id}`}
                      className="gov-btn-accent text-xs py-1.5 px-3 rounded font-bold flex items-center gap-1"
                    >
                      <span>{hasExistingProposal ? "View / Edit Proposal" : "Form Team & Draft Proposal"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
