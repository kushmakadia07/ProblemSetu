"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Building,
  AlertCircle
} from "lucide-react";
import { store, FundedProject } from "@/lib/store";

export default function FundedProjectsPage() {
  const [projects, setProjects] = useState<FundedProject[]>([]);
  const [releaseNotification, setReleaseNotification] = useState<string | null>(null);

  useEffect(() => {
    store.setRole("csr");
    setProjects(store.getFundedProjects());
    const unsub = store.subscribe(() => {
      setProjects(store.getFundedProjects());
    });
    return () => unsub();
  }, []);

  const handleRelease = (projectId: string, trancheId: string, trancheTitle: string, amount: number) => {
    store.releaseTranche(projectId, trancheId);
    setReleaseNotification(
      `Escrow Tranche "${trancheTitle}" (₹${amount.toLocaleString()}) has been released directly to university innovation account!`
    );
    setTimeout(() => {
      setReleaseNotification(null);
    }, 5000);
  };

  const totalCommitted = projects.reduce((acc, p) => acc + p.committedAmount, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.disbursedAmount, 0);
  const remainingEscrow = totalCommitted - totalDisbursed;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <DollarSign className="w-4 h-4" />
            <span>STATE TRI-PARTITE ESCROW ACCOUNT MANAGEMENT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            CSR Funded Projects & Escrow Milestone Tranches
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Corporate Sponsor: <strong>Tata Steel Foundation & Coal India Consortium</strong> • Escrow Ledger ID: <strong>JH-ESCROW-2026-STC</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/csr/scale-up"
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-1.5"
          >
            <span>Auto-Generated BOM & Scale-Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {releaseNotification && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-semibold rounded flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{releaseNotification}</span>
        </div>
      )}

      {/* Escrow Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gov-card p-4 border-l-4 border-l-[#1b365d]">
          <div className="text-xs font-semibold text-gray-600">Total Escrow Capital Pledged</div>
          <div className="text-2xl font-bold text-[#1b365d] mt-1">
            ₹{totalCommitted.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Deposited in State Bank of India Escrow</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-emerald-600">
          <div className="text-xs font-semibold text-gray-600">Total Capital Disbursed to Labs</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ₹{totalDisbursed.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Backed by Verified Milestones</div>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-[#e87722]">
          <div className="text-xs font-semibold text-gray-600">Escrow Held Securely for Final Tranches</div>
          <div className="text-2xl font-bold text-[#e87722] mt-1">
            ₹{remainingEscrow.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Disbursed only on Citizen Validation</div>
        </div>
      </div>

      {/* Funded Projects List */}
      <div className="space-y-6">
        <div className="border-b border-gray-300 pb-2">
          <h2 className="text-base font-bold text-[#1b365d]">
            Active Funded Projects & Escrow Release Gates
          </h2>
          <p className="text-xs text-gray-600">
            Tranches are unlocked strictly when milestone compliance documents are uploaded by university faculty mentors.
          </p>
        </div>

        {projects.map((proj) => (
          <div key={proj.id} className="gov-card border border-gray-300 rounded overflow-hidden">
            {/* Project Header */}
            <div className="bg-slate-100 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#1b365d] bg-white px-2 py-0.5 rounded border border-gray-300">
                    {proj.id}
                  </span>
                  <span className="text-xs text-gray-600">Linked Grievance: {proj.grievanceId}</span>
                  <span className="gov-badge gov-badge-saffron">{proj.companyName}</span>
                </div>
                <h3 className="text-base font-bold text-[#1b365d] mt-1">{proj.projectTitle}</h3>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Committed Capital:</div>
                <div className="text-base font-extrabold text-[#1b365d]">
                  ₹{proj.committedAmount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Disbursed: ₹{proj.disbursedAmount.toLocaleString()} ({Math.round((proj.disbursedAmount / proj.committedAmount) * 100)}%)
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Tranche Release Milestones */}
              <div>
                <h4 className="text-xs font-bold text-[#1b365d] uppercase tracking-wider mb-2.5">
                  Milestone Escrow Tranche Release Gates:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {proj.tranches.map((tranche) => (
                    <div
                      key={tranche.id}
                      className={`p-3.5 rounded border text-xs flex flex-col justify-between ${
                        tranche.status === "Released"
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                          : tranche.status === "Awaiting Approval"
                          ? "bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-300"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs">{tranche.title.split(":")[0]}</span>
                          <span className="font-extrabold text-sm">
                            ₹{tranche.amount.toLocaleString()} ({tranche.percentage}%)
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-700 leading-relaxed mb-2">
                          <strong>Condition:</strong> {tranche.condition}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200/60 mt-2 flex items-center justify-between">
                        {tranche.status === "Released" ? (
                          <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Released on {tranche.releasedDate}</span>
                          </span>
                        ) : tranche.status === "Awaiting Approval" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleRelease(proj.id, tranche.id, tranche.title, tranche.amount)
                            }
                            className="w-full bg-[#e87722] hover:bg-[#c75e0c] text-white py-1.5 px-3 rounded font-bold text-xs shadow-xs transition flex items-center justify-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Approve & Release Tranche</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px] flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Milestone Locked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Mentor Live Progress Feed */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-bold text-[#1b365d] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-700" />
                  <span>Direct Technical Updates from University Faculty Mentors</span>
                </h4>

                <div className="space-y-2.5">
                  {proj.mentorUpdates.map((upd) => (
                    <div key={upd.id} className="bg-slate-50 border border-slate-200 p-3 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-[#1b365d] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                          <span>{upd.author}</span>
                        </div>
                        <div className="text-gray-500 text-[10px]">{upd.date}</div>
                      </div>
                      <div className="text-gray-700 leading-relaxed">{upd.updateText}</div>
                      <div className="text-[10px] text-blue-800 font-semibold mt-1">
                        Verified Milestone: {upd.milestonePhase}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
