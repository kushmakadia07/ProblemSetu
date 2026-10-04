"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  DollarSign,
  GraduationCap,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Users
} from "lucide-react";
import { store, Proposal } from "@/lib/store";

export default function CsrDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activePartner, setActivePartner] = useState<string>("Tata Steel Foundation (TSF)");
  const [pledgedSuccess, setPledgedSuccess] = useState<string | null>(null);

  useEffect(() => {
    store.setRole("csr");
    setProposals(store.getProposals());
    const unsub = store.subscribe(() => {
      setProposals(store.getProposals());
    });
    return () => unsub();
  }, []);

  const handlePledge = (proposalId: string, title: string) => {
    setPledgedSuccess(`₹ Escrow successfully pledged for "${title}"! Redirecting to Escrow Milestones...`);
    setTimeout(() => {
      setPledgedSuccess(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* CSR Header */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-[#e87722] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <Briefcase className="w-4 h-4" />
            <span>CORPORATE SOCIAL RESPONSIBILITY (CSR) ESCROW MARKETPLACE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            University Proposals Awaiting CSR Escrow Sponsorship
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
            <span>Active Corporate Entity:</span>
            <select
              value={activePartner}
              onChange={(e) => setActivePartner(e.target.value)}
              className="bg-blue-950 border border-blue-700 text-amber-300 px-2.5 py-1 rounded font-bold text-xs"
            >
              <option value="Tata Steel Foundation (TSF)">Tata Steel Foundation (TSF)</option>
              <option value="Coal India / CCL / BCCL CSR">Coal India / Central Coalfields Ltd</option>
              <option value="Jindal Steel & Power CSR">Jindal Steel & Power Foundation</option>
              <option value="NTPC North Karanpura CSR">NTPC North Karanpura</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/csr/funded-projects"
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Manage Escrow Milestones</span>
          </Link>
          <Link
            href="/csr/scale-up"
            className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm py-2 px-3 rounded font-medium"
          >
            <span>Unit Economics & BOM</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {pledgedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-semibold rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{pledgedSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gov-card p-4 border-l-4 border-l-blue-800">
          <div className="text-xs font-semibold text-gray-600">Proposals Awaiting Backing</div>
          <div className="text-2xl font-bold text-[#1b365d] mt-1">{proposals.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Vetted by State Innovation Cell</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-[#e87722]">
          <div className="text-xs font-semibold text-gray-600">Total Capital Requirement</div>
          <div className="text-2xl font-bold text-[#e87722] mt-1">
            ₹{(proposals.reduce((sum, p) => sum + p.totalBudget, 0) / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Itemized university prototypes</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-emerald-600">
          <div className="text-xs font-semibold text-gray-600">Govt 1:1 Matching Grant</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">Up to ₹2.5 L</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Guaranteed by JSRIP-2025</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-purple-600">
          <div className="text-xs font-semibold text-gray-600">Tax Exemption Status</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">100% (80G)</div>
          <div className="text-[10px] text-purple-700 mt-0.5">Direct MCA CSR Compliant</div>
        </div>
      </div>

      {/* Proposal Marketplace Stream */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-300">
          <div>
            <h2 className="text-base font-bold text-[#1b365d]">
              Curated Engineering Feasibility Proposals Ready for Funding
            </h2>
            <p className="text-xs text-gray-600">
              Each proposal features itemized Bill of Materials (BOM), student teams, and faculty mentor supervision.
            </p>
          </div>
          <Link
            href="/csr/scale-up"
            className="text-xs font-bold text-[#1b365d] hover:text-[#e87722] flex items-center gap-1"
          >
            <span>Explore Mass Scale-Up Economics</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="gov-card p-8 text-center border border-dashed border-gray-300 rounded space-y-3">
            <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-[#1b365d]">No University Proposals Awaiting Funding</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              When engineering universities submit solution proposals for citizen grievances, they will be listed here for corporate CSR escrow sponsorship.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {proposals.map((prop) => (
            <div key={prop.id} className="gov-card p-5 border border-gray-300 rounded flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#1b365d] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {prop.id}
                  </span>
                  <span className="gov-badge gov-badge-saffron">TRL {prop.trlLevel}</span>
                </div>

                <h3 className="font-bold text-sm text-[#1b365d] leading-snug mb-1.5">
                  {prop.grievanceTitle}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e87722]" />
                  <span>Target District: <strong>{prop.district}</strong></span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-3">
                  {prop.proposedSolution}
                </p>

                {/* Institution & Team Info */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs space-y-1 mb-3">
                  <div className="font-semibold text-[#1b365d] flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                    <span className="truncate">{prop.institutionName}</span>
                  </div>
                  <div className="text-gray-600 text-[11px]">
                    Student Lead: {prop.leadStudentName}
                  </div>
                  <div className="text-gray-500 text-[10px]">
                    Mentor: {prop.facultyMentor.name} ({prop.facultyMentor.department})
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded text-xs mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500">Escrow Capital Needed:</div>
                    <div className="text-base font-extrabold text-emerald-800">
                      ₹{prop.totalBudget.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Timeline:</div>
                    <div className="font-semibold text-gray-800">{prop.estimatedDurationMonths} Months</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                <Link
                  href="/csr/scale-up"
                  className="text-xs text-[#1b365d] hover:underline font-semibold"
                >
                  View BOM ({prop.bom.length} items)
                </Link>

                <button
                  type="button"
                  onClick={() => handlePledge(prop.id, prop.grievanceTitle)}
                  className="gov-btn-accent text-xs py-1.5 px-3 rounded font-bold flex items-center gap-1 shadow-xs"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Pledge Escrow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
