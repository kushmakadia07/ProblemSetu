"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  GraduationCap,
  Building,
  ArrowRight,
  TrendingUp,
  Cpu,
  Coins
} from "lucide-react";

export default function AboutPolicyPage() {
  const trlStages = [
    { level: "TRL 1-2", stage: "Problem Definition & Scientific Feasibility", desc: "Citizen grievance is verified by District Nodal Officer; student team maps problem to engineering discipline." },
    { level: "TRL 3", stage: "Proof-of-Concept Lab Validation", desc: "Benchtop experiments conducted in university lab (e.g., arsenic adsorption curves or misting droplet simulation)." },
    { level: "TRL 4-5", stage: "Integrated Sub-System Testing", desc: "Bill of Materials (BOM) finalized, solar/power sub-systems integrated with IoT sensors and microcontroller firmware." },
    { level: "TRL 6", stage: "Village Prototype Demonstration", desc: "First ruggedized unit erected in the target Jharkhand panchayat for initial operational field trial." },
    { level: "TRL 7-8", stage: "Citizen Testing & NABL Certification", desc: "Full field operation under real conditions; water/air/energy quality compliance verified by state laboratories." },
    { level: "TRL 9", stage: "State-Wide Scale-Up & GeM Procurement", desc: "Transition from custom prototype to batch manufacturing via Jharkhand MSMEs and corporate CSR procurement." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-[#1b365d] text-white p-6 sm:p-8 rounded-lg shadow-md border-b-4 border-[#e87722]">
        <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 rounded-full px-3 py-1 text-xs text-amber-300 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>STATUTORY POLICY FRAMEWORK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Jharkhand Student Research & Innovation Policy-2025 (JSRIP-2025)
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
          Operationalizing the National Education Policy (NEP 2020) mandate to transition Indian higher education from theoretical rote learning to experiential, multidisciplinary societal engineering.
        </p>
      </div>

      {/* Grid: JSRIP-2025 & NEP 2020 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: JSRIP-2025 */}
        <div className="gov-card p-6 border-t-4 border-t-[#1b365d]">
          <div className="flex items-center gap-2.5 text-[#1b365d] font-bold text-base mb-3">
            <Award className="w-5 h-5 text-[#e87722]" />
            <h2>Core Tenets of JSRIP-2025</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Notified by the Department of Higher and Technical Education, JSRIP-2025 mandates that every accredited engineering college and polytechnic institute in Jharkhand dedicate at least 25% of final-year capstone projects to verified citizen grievances lodged on the CPGRAMS societal portal.
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>State Seed Grant Matching:</strong> The Government of Jharkhand provides up to ₹2.5 Lakhs in 1:1 matching grants for any CSR-backed student proposal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Patent & IPR Protection:</strong> 100% reimbursement of patent filing fees for student inventions that solve documented Jharkhand rural challenges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Faculty Mentorship Recognition:</strong> Faculty mentors receive state innovation citations and API score increments for university promotions.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: NEP 2020 Integration */}
        <div className="gov-card p-6 border-t-4 border-t-[#e87722]">
          <div className="flex items-center gap-2.5 text-[#1b365d] font-bold text-base mb-3">
            <GraduationCap className="w-5 h-5 text-[#1b365d]" />
            <h2>NEP 2020 Academic Credit Integration</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            In compliance with the University Grants Commission (UGC) National Higher Education Qualifications Framework (NHEQF), student field work is formally credited into semester transcripts.
          </p>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>10 to 16 Academic Credits:</strong> Final year engineering students earn full semester capstone credits upon achieving TRL 6+ field deployment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Multidisciplinary Teams:</strong> Mandatory cross-departmental composition (e.g. Mechanical + Electronics/IoT + Environmental) reflecting real-world engineering.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Academic Bank of Credits (ABC) Sync:</strong> Credits are digitally pushed to students&apos; DigiLocker ABC accounts upon citizen verification.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technology Readiness Level (TRL 1-9) Framework */}
      <div className="gov-card p-6 border border-gray-300">
        <div className="flex items-center gap-2.5 text-[#1b365d] font-bold text-base mb-2">
          <Layers className="w-5 h-5 text-[#e87722]" />
          <h2>Technology Readiness Level (TRL) 1 to 9 Progression Matrix</h2>
        </div>
        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
          Every project routed through the Jharkhand portal is tracked against standardized NASA/DRDO/DST Technology Readiness Levels to ensure rigorous quality control before rural deployment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trlStages.map((stage, idx) => (
            <div key={stage.level} className="bg-slate-50 border border-slate-200 rounded p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-[#1b365d] bg-blue-100 px-2.5 py-0.5 rounded">
                  {stage.level}
                </span>
                <span className="text-[11px] font-semibold text-gray-500">Stage {idx + 1}</span>
              </div>
              <h3 className="font-bold text-xs text-gray-900 mb-1.5">{stage.stage}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow Mechanism & Corporate CSR Governance */}
      <div className="gov-card p-6 border-l-4 border-l-emerald-600">
        <div className="flex items-center gap-2.5 text-[#1b365d] font-bold text-base mb-3">
          <Coins className="w-5 h-5 text-emerald-700" />
          <h2>Corporate CSR Escrow Account & Tranche Release Mechanism</h2>
        </div>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          To eliminate financial leakage and guarantee delivery, corporate CSR funds (from Tata Steel Foundation, Coal India, Jindal Steel, NTPC) are deposited into an automated tripartite Escrow Account governed by the State Innovation Council.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
            <div className="font-bold text-emerald-900 text-sm mb-1">Tranche 1 (30%)</div>
            <div className="text-emerald-700 font-semibold mb-2">Laboratory R&D Release</div>
            <p className="text-gray-600 text-[11px]">
              Disbursed immediately upon proposal approval to procure raw materials and sensors for lab proof-of-concept testing.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <div className="font-bold text-blue-900 text-sm mb-1">Tranche 2 (40%)</div>
            <div className="text-blue-700 font-semibold mb-2">Field Fabrication Release</div>
            <p className="text-gray-600 text-[11px]">
              Disbursed when lab test reports and CAD blueprints are uploaded, funding physical prototype delivery to the target panchayat.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-4">
            <div className="font-bold text-amber-900 text-sm mb-1">Tranche 3 (30%)</div>
            <div className="text-amber-700 font-semibold mb-2">Citizen Validation Sign-off</div>
            <p className="text-gray-600 text-[11px]">
              Disbursed only when the rural citizen uploads photographic proof and satisfaction rating confirming the installation works reliably.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-300">
        <Link href="/" className="gov-btn-outline text-xs">
          ← Back to Portal Home
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/analytics/leaderboard" className="gov-btn-primary text-xs">
            <span>Explore State Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
