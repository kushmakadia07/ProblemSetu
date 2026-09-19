"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Layers,
  Calculator,
  Download,
  Building,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  PackageCheck,
  Factory
} from "lucide-react";
import { store, BOMItem } from "@/lib/store";

export default function ScaleUpPage() {
  const [selectedPrototype, setSelectedPrototype] = useState<string>("fluoride-filter");
  const [batchQuantity, setBatchQuantity] = useState<number>(500);

  // Prototype 1: Palamu Fluoride Filter
  const fluorideBOM: BOMItem[] = [
    { id: "1", item: "Food-grade HDPE Dual Filter Cylinders (200L)", quantity: 2, unitCost: 8500, totalCost: 17000, supplierType: "Local MSME (Jharkhand)" },
    { id: "2", item: "Activated Alumina (Grade AA-400 Adsorbent, 150 kg)", quantity: 150, unitCost: 180, totalCost: 27000, supplierType: "National Vendor" },
    { id: "3", item: "Pyrolyzed Bamboo Biochar Media Bed (100 kg)", quantity: 100, unitCost: 90, totalCost: 9000, supplierType: "Local MSME (Jharkhand)" },
    { id: "4", item: "IoT Solar-powered Telemetry Node (TDS/pH/Fluoride)", quantity: 1, unitCost: 22000, totalCost: 22000, supplierType: "Fabrication Lab" },
    { id: "5", item: "Heavy Duty Galvanized Steel Stand & Plumbings", quantity: 1, unitCost: 28000, totalCost: 28000, supplierType: "Local MSME (Jharkhand)" },
    { id: "6", item: "Assembly, Transport & Installation Labor", quantity: 1, unitCost: 35000, totalCost: 35000, supplierType: "Local MSME (Jharkhand)" },
  ];

  // Prototype 2: Jharia Dust Misting
  const dustBOM: BOMItem[] = [
    { id: "201", item: "Ultrasonic Ceramic Atomizer Nozzle Arrays", quantity: 12, unitCost: 4500, totalCost: 54000, supplierType: "National Vendor" },
    { id: "202", item: "High-Pressure Booster Pump (15 Bar)", quantity: 2, unitCost: 35000, totalCost: 70000, supplierType: "National Vendor" },
    { id: "203", item: "Solar PV 1.5 kW & MPPT Battery Pack", quantity: 1, unitCost: 85000, totalCost: 85000, supplierType: "Local MSME (Jharkhand)" },
    { id: "204", item: "IoT Optical Dust Sensor & Micro-controller", quantity: 2, unitCost: 28000, totalCost: 56000, supplierType: "Fabrication Lab" },
    { id: "205", item: "Water Reservoir 2000L & Anti-Clog Sand Filter", quantity: 1, unitCost: 45000, totalCost: 45000, supplierType: "Local MSME (Jharkhand)" },
    { id: "206", item: "Civil Foundation & Gantry Support Columns", quantity: 1, unitCost: 30000, totalCost: 30000, supplierType: "Local MSME (Jharkhand)" },
  ];

  const currentBOM = selectedPrototype === "fluoride-filter" ? fluorideBOM : dustBOM;
  const singlePrototypeCost = currentBOM.reduce((acc, item) => acc + item.totalCost, 0);

  // Unit economics scaling curve
  const getDiscountFactor = (qty: number): number => {
    if (qty <= 1) return 1.0;
    if (qty <= 50) return 0.72; // 28% discount from bulk raw materials
    if (qty <= 200) return 0.55; // 45% discount from injection molding
    if (qty <= 500) return 0.42; // 58% discount
    return 0.35; // 65% discount at 1,000+ units
  };

  const scaledUnitCost = Math.round(singlePrototypeCost * getDiscountFactor(batchQuantity));
  const totalBatchCost = scaledUnitCost * batchQuantity;
  const totalBeneficiaries = batchQuantity * (selectedPrototype === "fluoride-filter" ? 850 : 2200);
  const costPerCitizen = Math.round(totalBatchCost / totalBeneficiaries);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-[#1b365d] text-white p-6 rounded-lg shadow-sm border-l-4 border-[#e87722] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>COMMERCIALIZATION & STATE-WIDE SCALE-UP ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Auto-Generated Bill of Materials (BOM) & Unit Economics
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Transition proven TRL 7 university prototypes into mass rural deployment across all 24 districts of Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Auto-generated GeM (Government e-Marketplace) Requisition Specification downloaded in CSV format.")}
            className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export GeM Tender Spec</span>
          </button>
        </div>
      </div>

      {/* Prototype Selector */}
      <div className="gov-card p-4 border border-gray-300 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#1b365d] uppercase">Select Validated Prototype:</span>
          <select
            value={selectedPrototype}
            onChange={(e) => setSelectedPrototype(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm font-bold text-[#1b365d] bg-white"
          >
            <option value="fluoride-filter">Palamu Fluoride & Arsenic Water Filter (BIT Mesra - TRL 7)</option>
            <option value="dust-suppressor">Jharia Roadside Ultrasonic Coal Dust Misting (IIT ISM - TRL 5)</option>
          </select>
        </div>

        <div className="text-xs text-gray-600">
          Field Status: <span className="text-emerald-700 font-bold">Citizen Verified & NABL Certified</span>
        </div>
      </div>

      {/* Scale-Up Economics Interactive Calculator */}
      <div className="gov-card p-6 border-2 border-amber-400 rounded space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#1b365d] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#e87722]" />
              <span>Mass Fabrication Unit Economics Slider</span>
            </h2>
            <p className="text-xs text-gray-600">
              Simulate volume production discounts when scaling across Jharkhand Panchayats and Blocks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[1, 50, 200, 500, 1000].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setBatchQuantity(qty)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  batchQuantity === qty
                    ? "bg-[#1b365d] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {qty === 1 ? "1 Unit (R&D)" : `${qty} Units`}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Calculation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
            <div className="text-xs text-gray-600 font-semibold">Single R&D Prototype Cost</div>
            <div className="text-xl font-bold text-gray-700 mt-1">
              ₹{singlePrototypeCost.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-500">Fabrication lab scale</div>
          </div>

          <div className="bg-amber-50 border border-amber-300 p-4 rounded text-center">
            <div className="text-xs text-amber-900 font-semibold">Scaled Unit Cost @ {batchQuantity} Qty</div>
            <div className="text-2xl font-extrabold text-[#e87722] mt-1">
              ₹{scaledUnitCost.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              {Math.round((1 - getDiscountFactor(batchQuantity)) * 100)}% Volume Savings
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded text-center">
            <div className="text-xs text-blue-900 font-semibold">Total CSR Capital Required</div>
            <div className="text-2xl font-extrabold text-[#1b365d] mt-1">
              ₹{(totalBatchCost / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-gray-500">{batchQuantity} Villages Deployed</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded text-center">
            <div className="text-xs text-emerald-900 font-semibold">Societal ROI (S-ROI)</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              ₹{costPerCitizen} / Person
            </div>
            <div className="text-[10px] text-emerald-800 font-semibold">
              {totalBeneficiaries.toLocaleString()} Rural Citizens Protected
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Bill of Materials (BOM) Table */}
      <div className="gov-card border border-gray-300 rounded overflow-hidden">
        <div className="gov-card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#e87722]" />
            <span className="text-sm font-bold text-[#1b365d]">
              Itemized Bill of Materials (BOM) & Sourcing Specification
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Total Prototype BOM: <strong>₹{singlePrototypeCost.toLocaleString()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-3">Component / Material</th>
                <th className="p-3">Supplier Category</th>
                <th className="p-3 text-center">Qty / Unit</th>
                <th className="p-3 text-right">R&D Cost (₹)</th>
                <th className="p-3 text-right">Batch Unit Cost (₹)</th>
                <th className="p-3 text-right">Total Batch @ {batchQuantity} (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBOM.map((item) => {
                const itemScaledUnit = Math.round(item.totalCost * getDiscountFactor(batchQuantity));
                const itemBatchTotal = itemScaledUnit * batchQuantity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{item.item}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {item.supplierType}
                      </span>
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right text-gray-500">₹{item.totalCost.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold text-[#e87722]">
                      ₹{itemScaledUnit.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-[#1b365d]">
                      ₹{itemBatchTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-300 font-bold text-gray-900">
              <tr>
                <td colSpan={3} className="p-3 text-right text-xs">
                  Grand Total for {batchQuantity} Unit Deployment:
                </td>
                <td className="p-3 text-right text-gray-500">₹{singlePrototypeCost.toLocaleString()}</td>
                <td className="p-3 text-right text-[#e87722]">₹{scaledUnitCost.toLocaleString()}</td>
                <td className="p-3 text-right text-[#1b365d] text-sm">
                  ₹{totalBatchCost.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Directory of Local Jharkhand MSME Suppliers */}
      <div className="gov-card p-5 border border-gray-300 rounded space-y-3">
        <h3 className="text-sm font-bold text-[#1b365d] flex items-center gap-2">
          <Factory className="w-4 h-4 text-[#e87722]" />
          <span>Empanelled Jharkhand MSME Fabrication Directory (Local Value Addition)</span>
        </h3>
        <p className="text-xs text-gray-600">
          In alignment with JSRIP-2025, 60% of all scaled components must be procured from MSME clusters located in Jharkhand.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1">
            <div className="font-bold text-[#1b365d]">Adityapur Industrial Area (Jamshedpur)</div>
            <div className="text-gray-600">Specialization: CNC Sheet Metal, Gantry Frames & Pressure Vessels</div>
            <div className="text-[11px] text-emerald-800 font-medium">18 Vendors Empanelled</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1">
            <div className="font-bold text-[#1b365d]">Tupudana Industrial Area (Ranchi)</div>
            <div className="text-gray-600">Specialization: Solar PV structures, MPPT electronics, HDPE tanks</div>
            <div className="text-[11px] text-emerald-800 font-medium">12 Vendors Empanelled</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1">
            <div className="font-bold text-[#1b365d]">BIADA Industrial Area (Bokaro)</div>
            <div className="text-gray-600">Specialization: Heavy Duty Industrial Pumps, Sand filters, Piping</div>
            <div className="text-[11px] text-emerald-800 font-medium">14 Vendors Empanelled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
