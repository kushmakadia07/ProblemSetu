"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  GraduationCap,
  Layers,
  Calculator,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Building,
  DollarSign,
  Sparkles,
  Film,
  Camera
} from "lucide-react";
import { store, Grievance, BOMItem, Proposal } from "@/lib/store";

function UniversityProposalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGrievanceId = searchParams?.get("grievanceId") || "";

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>("");

  // Team Form
  const [institutionName, setInstitutionName] = useState("Birla Institute of Technology (BIT), Mesra");
  const [leadStudent, setLeadStudent] = useState({
    name: "Amitabh Sen",
    branch: "Chemical Engineering",
    role: "Team Lead & Adsorption Lead",
    rollNo: "BTECH/CHE/22/045"
  });
  const [member2, setMember2] = useState({
    name: "Priya Hansda",
    branch: "Civil & Environmental Engg",
    role: "Hydraulic Chamber CAD",
    rollNo: "BTECH/CIV/23/012"
  });
  const [member3, setMember3] = useState({
    name: "Rohan Kujur",
    branch: "Electronics & IoT",
    role: "Water Sensor Telemetry",
    rollNo: "BTECH/ECE/23/089"
  });

  // Faculty Mentor Form
  const [facultyMentor, setFacultyMentor] = useState({
    name: "Dr. Alok K. Verma",
    designation: "Professor & Head",
    department: "Dept of Chemical & Environmental Engineering",
    email: "akverma@bitmesra.ac.in"
  });

  // Proposal Tech details
  const [trlLevel, setTrlLevel] = useState<number>(7);
  const [proposedSolution, setProposedSolution] = useState(
    "Multi-stage zero-electricity gravity filtration utilizing locally pyrolyzed bone-char/biochar and activated alumina media bed. Incorporates simple visual chemical indicator for filter bed exhaustion and solar powered telemetry."
  );
  const [durationMonths, setDurationMonths] = useState<number>(4);

  // Bill of Materials (BOM)
  const [bomItems, setBomItems] = useState<BOMItem[]>([
    { id: "1", item: "Food-grade HDPE Filter Cylinders (200L x 3)", quantity: 3, unitCost: 8500, totalCost: 25500, supplierType: "Local MSME (Jharkhand)" },
    { id: "2", item: "Activated Alumina (Grade AA-400, 200 kg)", quantity: 200, unitCost: 180, totalCost: 36000, supplierType: "National Vendor" },
    { id: "3", item: "Engineered Bamboo Biochar Adsorbent", quantity: 150, unitCost: 90, totalCost: 13500, supplierType: "Local MSME (Jharkhand)" },
    { id: "4", item: "Submersible Low-Power Solar Sensor Node (TDS/pH)", quantity: 1, unitCost: 22000, totalCost: 22000, supplierType: "Fabrication Lab" },
    { id: "5", item: "Piping, Brass Valves & Civil Stand Fabrication", quantity: 1, unitCost: 38000, totalCost: 38000, supplierType: "Local MSME (Jharkhand)" },
    { id: "6", item: "Contingency, Lab Water Testing & Certification", quantity: 1, unitCost: 50000, totalCost: 50000, supplierType: "Fabrication Lab" }
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(5000);
  const [newItemSupplier, setNewItemSupplier] = useState<BOMItem["supplierType"]>("Local MSME (Jharkhand)");

  const [mentorSigned, setMentorSigned] = useState(true);
  const [submittedProposalId, setSubmittedProposalId] = useState<string | null>(null);

  useEffect(() => {
    store.setRole("university");
    const all = store.getGrievances();
    setGrievances(all);
    setProposals(store.getProposals());

    if (preselectedGrievanceId) {
      setSelectedGrievanceId(preselectedGrievanceId);
    } else if (all.length > 0) {
      setSelectedGrievanceId(all[0].id);
    }

    const unsub = store.subscribe(() => {
      setGrievances(store.getGrievances());
      setProposals(store.getProposals());
    });
    return () => unsub();
  }, [preselectedGrievanceId]);

  const selectedGrievance = grievances.find((g) => g.id === selectedGrievanceId);

  // BOM calculations
  const totalBOMCost = bomItems.reduce((sum, item) => sum + item.totalCost, 0);

  const handleAddBOMItem = () => {
    if (!newItemName.trim()) return;
    const newItem: BOMItem = {
      id: String(Date.now()),
      item: newItemName.trim(),
      quantity: Number(newItemQty),
      unitCost: Number(newItemPrice),
      totalCost: Number(newItemQty) * Number(newItemPrice),
      supplierType: newItemSupplier
    };
    setBomItems([...bomItems, newItem]);
    setNewItemName("");
    setNewItemQty(1);
    setNewItemPrice(5000);
  };

  const handleRemoveBOMItem = (id: string) => {
    setBomItems(bomItems.filter((b) => b.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const newProposal = store.addProposal({
      grievanceId: selectedGrievance.id,
      grievanceTitle: selectedGrievance.title,
      district: selectedGrievance.district,
      institutionName,
      leadStudentName: `${leadStudent.name} (${leadStudent.branch})`,
      teamMembers: [leadStudent, member2, member3],
      facultyMentor,
      trlLevel,
      proposedSolution,
      estimatedDurationMonths: durationMonths,
      totalBudget: totalBOMCost,
      bom: bomItems,
      milestonePhases: [
        { phase: "Phase 1: Lab Proof-of-Concept", description: "Design & laboratory characterization", durationWeeks: 4, amount: Math.round(totalBOMCost * 0.3), status: "Upcoming" },
        { phase: "Phase 2: Panchayat Field Fabrication", description: "Fabricate and install unit in village", durationWeeks: 8, amount: Math.round(totalBOMCost * 0.4), status: "Upcoming" },
        { phase: "Phase 3: Citizen Handover & Water Audit", description: "Citizen verification & lab certification", durationWeeks: 4, amount: Math.round(totalBOMCost * 0.3), status: "Upcoming" }
      ],
      nepCreditsAwarded: 12
    });

    setSubmittedProposalId(newProposal.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-[#e87722]">
        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>JSRIP-2025 ACADEMIC CAPSTONE & FEASIBILITY ENGINE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Multidisciplinary Team Builder & Proposal Drafter
        </h1>
        <p className="text-xs text-gray-300 mt-1">
          Assemble cross-departmental engineering student teams, allocate accredited faculty mentors, and generate automated BOMs for corporate CSR escrow matching.
        </p>
      </div>

      {submittedProposalId ? (
        <div className="gov-card p-8 text-center border-2 border-emerald-500 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1b365d]">
            Feasibility Proposal Successfully Submitted!
          </h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded max-w-md mx-auto text-xs">
            <div className="text-gray-500 font-semibold">Proposal Code:</div>
            <div className="text-2xl font-mono font-extrabold text-[#1b365d] my-1">
              {submittedProposalId}
            </div>
            <div className="text-gray-600">
              Total Budget: <strong>₹{totalBOMCost.toLocaleString()}</strong> • NEP Credits: <strong>12 Credits</strong>
            </div>
          </div>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            Your proposal is now listed on the Corporate CSR Escrow Marketplace for financial sponsorship by Tata Steel Foundation, Coal India, and partner public enterprises.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/csr/dashboard" className="gov-btn-accent text-xs py-2 px-5 rounded font-bold">
              <span>View in CSR Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/university/dashboard" className="gov-btn-outline text-xs py-2 px-4 rounded">
              Back to Routed Problems
            </Link>
          </div>
        </div>
      ) : grievances.length === 0 ? (
        <div className="gov-card p-8 text-center border border-dashed border-gray-300 rounded space-y-3">
          <GraduationCap className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-[#1b365d]">No Routed Grievances Available</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            There are currently no citizen problems in the system to draft proposals for. Once citizens lodge community grievances on the ground, they will appear here for student teams to engineer solutions.
          </p>
          <div className="pt-2">
            <Link href="/citizen/report-issue" className="gov-btn-accent text-xs font-semibold py-2 px-4 rounded inline-flex items-center gap-1.5">
              <span>Lodge a Problem Report</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* 1. Target Grievance Selection */}
          <div className="gov-card p-5 border border-gray-300 rounded">
            <h2 className="text-sm font-bold text-[#1b365d] uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#e87722]" />
              <span>1. Target Grievance to Address</span>
            </h2>
            <div className="space-y-2">
              <select
                value={selectedGrievanceId}
                onChange={(e) => setSelectedGrievanceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white font-semibold text-[#1b365d] focus:outline-hidden focus:border-[#1b365d]"
              >
                {grievances.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.id} — {g.title} ({g.district} District)
                  </option>
                ))}
              </select>

              {selectedGrievance && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-2 mt-2">
                  <div className="font-semibold text-gray-900">{selectedGrievance.title}</div>
                  <div className="text-gray-600">{selectedGrievance.description}</div>
                  <div className="text-gray-500 text-[11px]">
                    Location: {selectedGrievance.panchayat}, {selectedGrievance.district} • Urgency: {selectedGrievance.urgency}
                  </div>

                  {selectedGrievance.mediaUrls && selectedGrievance.mediaUrls.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
                        <Film className="w-3.5 h-3.5 text-[#e87722]" />
                        <span>Citizen Video Statement & Ground Evidence ({selectedGrievance.mediaUrls.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {selectedGrievance.mediaUrls.map((url, mi) => {
                          const isVideo =
                            url.includes(".webm") ||
                            url.includes(".mp4") ||
                            url.includes(".mov") ||
                            url.includes(".mkv") ||
                            url.includes("/uploads/video_") ||
                            url.startsWith("blob:");
                          return (
                            <div key={mi} className="bg-white border border-gray-200 rounded p-2 text-[10px]">
                              <div className="font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                {isVideo ? <Film className="w-3 h-3 text-[#e87722]" /> : <Camera className="w-3 h-3 text-blue-700" />}
                                <span>{isVideo ? "Citizen Video Statement (English)" : `Evidence Photo 0${mi + 1}`}</span>
                              </div>
                              {isVideo ? (
                                <video src={url} controls className="w-full max-h-32 rounded bg-black object-contain" />
                              ) : (
                                <img src={url} alt={`Evidence ${mi + 1}`} className="w-full max-h-32 rounded object-cover" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedGrievance.aiDiagnosticQa && selectedGrievance.aiDiagnosticQa.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>AI Technical Diagnostic Parameters (Google Gemini Intake)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {selectedGrievance.aiDiagnosticQa.map((qa, i) => (
                          <div key={i} className="bg-white p-2 rounded border border-indigo-100 text-[11px]">
                            <div className="font-semibold text-gray-700">{qa.question}</div>
                            <div className="text-indigo-950 mt-0.5">{qa.answer || "No response recorded"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. Multidisciplinary Student Team Builder */}
          <div className="gov-card p-5 border border-gray-300 rounded space-y-4">
            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1b365d] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#e87722]" />
                  <span>2. Multidisciplinary Student Team (NEP 2020 Compliant)</span>
                </h2>
                <p className="text-xs text-gray-500">
                  NEP 2020 requires multi-branch collaboration (e.g. Chemical + Civil + IoT).
                </p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-900 px-2.5 py-1 rounded font-bold">
                12 NEP Credits per Student
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Lead Student */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded space-y-2">
                <div className="font-bold text-[#1b365d]">Student Lead</div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={leadStudent.name}
                    onChange={(e) => setLeadStudent({ ...leadStudent, name: e.target.value })}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Branch / Discipline</label>
                  <input
                    type="text"
                    value={leadStudent.branch}
                    onChange={(e) => setLeadStudent({ ...leadStudent, branch: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Roll / Registration No.</label>
                  <input
                    type="text"
                    value={leadStudent.rollNo}
                    onChange={(e) => setLeadStudent({ ...leadStudent, rollNo: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Member 2 */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
                <div className="font-bold text-gray-800">Team Member 2</div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={member2.name}
                    onChange={(e) => setMember2({ ...member2, name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Branch / Discipline</label>
                  <input
                    type="text"
                    value={member2.branch}
                    onChange={(e) => setMember2({ ...member2, branch: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Roll / Registration No.</label>
                  <input
                    type="text"
                    value={member2.rollNo}
                    onChange={(e) => setMember2({ ...member2, rollNo: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Member 3 */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
                <div className="font-bold text-gray-800">Team Member 3</div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={member3.name}
                    onChange={(e) => setMember3({ ...member3, name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Branch / Discipline</label>
                  <input
                    type="text"
                    value={member3.branch}
                    onChange={(e) => setMember3({ ...member3, branch: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Roll / Registration No.</label>
                  <input
                    type="text"
                    value={member3.rollNo}
                    onChange={(e) => setMember3({ ...member3, rollNo: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Faculty Mentor Sign-Off */}
          <div className="gov-card p-5 border border-gray-300 rounded space-y-4">
            <h2 className="text-sm font-bold text-[#1b365d] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#e87722]" />
              <span>3. Assigned Faculty Mentor (JSRIP-2025 Principal Investigator)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Faculty Mentor Name *</label>
                <input
                  type="text"
                  value={facultyMentor.name}
                  onChange={(e) => setFacultyMentor({ ...facultyMentor, name: e.target.value })}
                  required
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Designation</label>
                <input
                  type="text"
                  value={facultyMentor.designation}
                  onChange={(e) => setFacultyMentor({ ...facultyMentor, designation: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Department</label>
                <input
                  type="text"
                  value={facultyMentor.department}
                  onChange={(e) => setFacultyMentor({ ...facultyMentor, department: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Official Email</label>
                <input
                  type="email"
                  value={facultyMentor.email}
                  onChange={(e) => setFacultyMentor({ ...facultyMentor, email: e.target.value })}
                  required
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* 4. Feasibility Proposal & TRL Target */}
          <div className="gov-card p-5 border border-gray-300 rounded space-y-4">
            <h2 className="text-sm font-bold text-[#1b365d] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#e87722]" />
              <span>4. Technical Feasibility & TRL Progression</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Technology Readiness Level (TRL) *
                </label>
                <select
                  value={trlLevel}
                  onChange={(e) => setTrlLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white font-semibold text-[#1b365d]"
                >
                  <option value={4}>TRL 4: Component / Subsystem Validation in Lab</option>
                  <option value={5}>TRL 5: Subsystem Validation in Relevant Environment</option>
                  <option value={6}>TRL 6: Prototype Demonstration in Jharkhand Village</option>
                  <option value={7}>TRL 7: Field Tested & NABL Certified Prototype</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Timeline to Field Deployment (Months)
                </label>
                <input
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Proposed Engineering Methodology & Ground Suitability *
              </label>
              <textarea
                rows={4}
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-hidden focus:border-[#1b365d]"
              />
            </div>
          </div>

          {/* 5. Interactive Bill of Materials (BOM) & Budget Estimator */}
          <div className="gov-card p-5 border border-gray-300 rounded space-y-4">
            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1b365d] uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#e87722]" />
                  <span>5. Automated Bill of Materials (BOM) & Escrow Budget</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Detailed component line-items audited by Corporate CSR before milestone escrow release.
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Escrow Budget:</div>
                <div className="text-lg font-extrabold text-emerald-800">
                  ₹{totalBOMCost.toLocaleString()}
                </div>
              </div>
            </div>

            {/* BOM Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-2 border-b">Component / Material Description</th>
                    <th className="p-2 border-b">Supplier Type</th>
                    <th className="p-2 border-b text-center">Qty</th>
                    <th className="p-2 border-b text-right">Unit Price (₹)</th>
                    <th className="p-2 border-b text-right">Total (₹)</th>
                    <th className="p-2 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bomItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">{item.item}</td>
                      <td className="p-2 text-gray-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {item.supplierType}
                        </span>
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">₹{item.unitCost.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-[#1b365d]">
                        ₹{item.totalCost.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveBOMItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Item Row */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs">
              <div className="font-semibold text-gray-700 mb-2">Add Component to BOM:</div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Solar Inverter 1kVA)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                />
                <select
                  value={newItemSupplier}
                  onChange={(e) => setNewItemSupplier(e.target.value as BOMItem["supplierType"])}
                  className="px-2 py-1.5 border border-gray-300 rounded bg-white text-[11px]"
                >
                  <option value="Local MSME (Jharkhand)">Local MSME (Jharkhand)</option>
                  <option value="National Vendor">National Vendor</option>
                  <option value="Fabrication Lab">Fabrication Lab</option>
                </select>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded bg-white text-center"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-24 px-2 py-1.5 border border-gray-300 rounded bg-white text-right"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddBOMItem}
                  className="gov-btn-primary text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mentor Sign-off Checkbox & Submit */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded flex items-start gap-3">
            <input
              type="checkbox"
              id="mentor-sign"
              checked={mentorSigned}
              onChange={(e) => setMentorSigned(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded mt-0.5 cursor-pointer"
            />
            <label htmlFor="mentor-sign" className="text-xs text-emerald-950 cursor-pointer">
              <strong>Faculty Mentor Digital Sign-Off:</strong> I, {facultyMentor.name}, certify that this engineering proposal conforms to JSRIP-2025 standards and is technically feasible within the target budget. I agree to supervise student field demonstrations and submit milestone progress reports.
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/university/dashboard" className="gov-btn-outline text-xs px-4 py-2.5 rounded">
              Cancel & Return
            </Link>
            <button
              type="submit"
              disabled={!mentorSigned}
              className={`gov-btn-accent text-sm px-8 py-2.5 rounded font-bold shadow-md flex items-center gap-2 ${
                !mentorSigned ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Proposal to CSR Escrow Marketplace</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function UniversityProposalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-[#1b365d]">Loading Proposal Feasibility Builder...</div>}>
      <UniversityProposalsContent />
    </Suspense>
  );
}
