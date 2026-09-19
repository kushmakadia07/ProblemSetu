"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  GraduationCap,
  Building2,
  Download,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import {
  LEADERBOARD_UNIVERSITIES,
  LEADERBOARD_COMPANIES,
  LeaderboardUniversity,
  LeaderboardCompany
} from "@/lib/store";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"universities" | "companies" | "districts">("universities");

  const districtData = [
    { district: "Ranchi", reported: 184, resolved: 142, rate: "77.1%", topCollege: "BIT Mesra" },
    { district: "Dhanbad", reported: 162, resolved: 128, rate: "79.0%", topCollege: "IIT (ISM) Dhanbad" },
    { district: "East Singhbhum", reported: 139, resolved: 106, rate: "76.2%", topCollege: "NIT Jamshedpur" },
    { district: "Palamu", reported: 115, resolved: 88, rate: "76.5%", topCollege: "GLA University Node" },
    { district: "West Singhbhum", reported: 98, resolved: 71, rate: "72.4%", topCollege: "Kolhan University" },
    { district: "Dumka", reported: 84, resolved: 65, rate: "77.3%", topCollege: "Sido Kanhu Murmu Univ" },
    { district: "Bokaro", reported: 76, resolved: 59, rate: "77.6%", topCollege: "Bokaro Steel City College" },
    { district: "Hazaribagh", reported: 68, resolved: 51, rate: "75.0%", topCollege: "Vinoba Bhave Univ" },
  ];

  const handleDownloadCsv = () => {
    alert("Jharkhand State Innovation Index (JSRIP-2025) Official Transparency Report exported to CSV format.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-[#1b365d] text-white p-6 sm:p-8 rounded-lg shadow-sm border-l-4 border-amber-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <Trophy className="w-4 h-4" />
            <span>PUBLIC TRANSPARENCY & STATE GAMIFICATION INDEX</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Jharkhand Societal Innovation Leaderboard
          </h1>
          <p className="text-xs text-gray-300 mt-1 max-w-2xl">
            Live competitive ranking of universities, engineering student teams, and corporate CSR partners based on societal problems solved under JSRIP-2025 and NEP 2020.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank 1 Gold */}
        <div className="gov-card p-5 border-2 border-amber-400 bg-linear-to-b from-amber-50 to-white text-center relative shadow-sm">
          <div className="absolute top-3 right-3 text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>RANK #1 GOLD</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-400 text-white font-extrabold text-xl mx-auto flex items-center justify-center shadow-xs mb-3">
            1
          </div>
          <h3 className="font-bold text-base text-[#1b365d] mb-1">
            Birla Institute of Technology (BIT), Mesra
          </h3>
          <div className="text-xs text-gray-600 mb-2">District: Ranchi</div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-amber-200 text-gray-700">
            <div>
              <div className="font-bold text-base text-[#1b365d]">19</div>
              <div className="text-[10px] text-gray-500">Problems Solved</div>
            </div>
            <div>
              <div className="font-bold text-base text-emerald-700">340</div>
              <div className="text-[10px] text-gray-500">NEP Credits</div>
            </div>
          </div>
        </div>

        {/* Rank 2 Silver */}
        <div className="gov-card p-5 border-2 border-slate-300 bg-linear-to-b from-slate-50 to-white text-center relative shadow-sm">
          <div className="absolute top-3 right-3 text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Medal className="w-3.5 h-3.5 text-slate-500" />
            <span>RANK #2 SILVER</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-400 text-white font-extrabold text-xl mx-auto flex items-center justify-center shadow-xs mb-3">
            2
          </div>
          <h3 className="font-bold text-base text-[#1b365d] mb-1">
            IIT (ISM) Dhanbad
          </h3>
          <div className="text-xs text-gray-600 mb-2">District: Dhanbad</div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 text-gray-700">
            <div>
              <div className="font-bold text-base text-[#1b365d]">17</div>
              <div className="text-[10px] text-gray-500">Problems Solved</div>
            </div>
            <div>
              <div className="font-bold text-base text-emerald-700">280</div>
              <div className="text-[10px] text-gray-500">NEP Credits</div>
            </div>
          </div>
        </div>

        {/* Rank 3 Bronze */}
        <div className="gov-card p-5 border-2 border-orange-300 bg-linear-to-b from-orange-50 to-white text-center relative shadow-sm">
          <div className="absolute top-3 right-3 text-xs font-bold text-orange-900 bg-orange-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Medal className="w-3.5 h-3.5 text-orange-700" />
            <span>RANK #3 BRONZE</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-400 text-white font-extrabold text-xl mx-auto flex items-center justify-center shadow-xs mb-3">
            3
          </div>
          <h3 className="font-bold text-base text-[#1b365d] mb-1">
            NIT Jamshedpur
          </h3>
          <div className="text-xs text-gray-600 mb-2">District: East Singhbhum</div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-orange-200 text-gray-700">
            <div>
              <div className="font-bold text-base text-[#1b365d]">14</div>
              <div className="text-[10px] text-gray-500">Problems Solved</div>
            </div>
            <div>
              <div className="font-bold text-base text-emerald-700">220</div>
              <div className="text-[10px] text-gray-500">NEP Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="gov-card border border-gray-300 rounded overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300 text-xs sm:text-sm font-semibold text-center">
          <button
            type="button"
            onClick={() => setActiveTab("universities")}
            className={`py-3 px-2 border-b-2 transition ${
              activeTab === "universities"
                ? "border-[#e87722] bg-white text-[#1b365d] font-bold"
                : "border-transparent text-gray-600 hover:bg-gray-200"
            }`}
          >
            University Innovation Index
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("companies")}
            className={`py-3 px-2 border-b-2 transition ${
              activeTab === "companies"
                ? "border-[#e87722] bg-white text-[#1b365d] font-bold"
                : "border-transparent text-gray-600 hover:bg-gray-200"
            }`}
          >
            Corporate CSR Champions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("districts")}
            className={`py-3 px-2 border-b-2 transition ${
              activeTab === "districts"
                ? "border-[#e87722] bg-white text-[#1b365d] font-bold"
                : "border-transparent text-gray-600 hover:bg-gray-200"
            }`}
          >
            District Resolution Performance
          </button>
        </div>

        {/* Tab 1: Universities Table */}
        {activeTab === "universities" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3 text-center">Rank</th>
                  <th className="p-3">Engineering Institution</th>
                  <th className="p-3">District</th>
                  <th className="p-3 text-center">Grievances Solved</th>
                  <th className="p-3 text-center">Active Prototypes</th>
                  <th className="p-3 text-center">Patents Filed</th>
                  <th className="p-3 text-center">NEP Credits</th>
                  <th className="p-3 text-right">State Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {LEADERBOARD_UNIVERSITIES.map((univ) => (
                  <tr key={univ.name} className="hover:bg-gray-50">
                    <td className="p-3 text-center font-bold">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                        univ.rank === 1 ? "bg-amber-400 text-white" :
                        univ.rank === 2 ? "bg-slate-300 text-gray-800" :
                        univ.rank === 3 ? "bg-orange-300 text-orange-950" : "text-gray-600"
                      }`}>
                        {univ.rank}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#1b365d]">{univ.name}</td>
                    <td className="p-3 text-gray-600">{univ.district}</td>
                    <td className="p-3 text-center font-semibold text-emerald-700">{univ.problemsSolved}</td>
                    <td className="p-3 text-center font-semibold text-blue-800">{univ.activePrototypes}</td>
                    <td className="p-3 text-center font-semibold text-purple-700">{univ.patentsFiled}</td>
                    <td className="p-3 text-center font-semibold text-gray-800">{univ.nepCreditsGranted}</td>
                    <td className="p-3 text-right font-extrabold text-amber-700 text-sm">{univ.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Companies Table */}
        {activeTab === "companies" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3 text-center">Rank</th>
                  <th className="p-3">Corporate CSR Entity</th>
                  <th className="p-3 text-right">Funds Deployed (₹ Lakhs)</th>
                  <th className="p-3 text-center">Projects Backed</th>
                  <th className="p-3 text-center">Villages Impacted</th>
                  <th className="p-3 text-center">ESG Social Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {LEADERBOARD_COMPANIES.map((comp) => (
                  <tr key={comp.name} className="hover:bg-gray-50">
                    <td className="p-3 text-center font-bold">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                        comp.rank === 1 ? "bg-amber-400 text-white" :
                        comp.rank === 2 ? "bg-slate-300 text-gray-800" :
                        comp.rank === 3 ? "bg-orange-300 text-orange-950" : "text-gray-600"
                      }`}>
                        {comp.rank}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#1b365d]">{comp.name}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-800 text-sm">
                      ₹{comp.fundsDeployedLakhs} L
                    </td>
                    <td className="p-3 text-center font-semibold text-blue-800">{comp.projectsBacked}</td>
                    <td className="p-3 text-center font-semibold text-gray-800">{comp.villagesImpacted}</td>
                    <td className="p-3 text-center">
                      <span className="gov-badge gov-badge-resolved">{comp.esgRating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: District Resolution Table */}
        {activeTab === "districts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3">Jharkhand District</th>
                  <th className="p-3 text-center">Grievances Reported</th>
                  <th className="p-3 text-center">Citizen Verified Closed</th>
                  <th className="p-3 text-center">Resolution Rate (%)</th>
                  <th className="p-3">Primary University Partner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {districtData.map((dist) => (
                  <tr key={dist.district} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#1b365d]">{dist.district}</td>
                    <td className="p-3 text-center font-medium text-gray-700">{dist.reported}</td>
                    <td className="p-3 text-center font-semibold text-emerald-700">{dist.resolved}</td>
                    <td className="p-3 text-center font-extrabold text-blue-800">{dist.rate}</td>
                    <td className="p-3 text-gray-600">{dist.topCollege}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Navigation CTA */}
      <div className="bg-slate-100 border border-gray-300 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-gray-600">
          Rankings updated every 24 hours pursuant to JSRIP-2025 State Innovation Audits.
        </span>
        <Link href="/" className="gov-btn-primary text-xs py-1.5 px-4 rounded font-bold">
          <span>Return to Portal Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
