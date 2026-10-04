"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart3, 
  Building2, 
  PieChart, 
  MapPin, 
  TrendingUp, 
  Briefcase,
  HeartPulse,
  GraduationCap,
  Tractor
} from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function CsrInformationPage() {
  const { language } = useLanguage();

  const totalExpenditure = [
    { year: "2021-22", amount: "₹243.95 crore" },
    { year: "2022-23", amount: "₹389.65 crore" },
    { year: "2023-24", amount: "₹414.63 crore" },
  ];

  const districtExpenditure = [
    { district: "East Singhbhum", amount: "94.20" },
    { district: "Ranchi", amount: "80.65" },
    { district: "Bokaro", amount: "31.84" },
    { district: "Dhanbad", amount: "24.84" },
    { district: "Dumka", amount: "18.62" },
    { district: "Hazaribagh", amount: "16.72" },
    { district: "Seraikela-Kharsawan", amount: "10.44" },
    { district: "Simdega", amount: "10.50" },
    { district: "West Singhbhum", amount: "8.87" },
    { district: "Godda", amount: "7.40" },
    { district: "Giridih", amount: "7.26" },
    { district: "Sahebganj", amount: "7.18" },
    { district: "Lohardaga", amount: "6.51" },
    { district: "Chatra", amount: "6.25" },
    { district: "Palamu", amount: "6.06" },
    { district: "Pakur", amount: "5.24" },
    { district: "Gumla", amount: "4.50" },
    { district: "Jamtara", amount: "4.32" },
    { district: "Latehar", amount: "4.16" },
    { district: "Koderma", amount: "2.86" },
    { district: "Deoghar", amount: "2.10" },
    { district: "Ramgarh", amount: "0.65" },
    { district: "Garhwa", amount: "0.24" },
    { district: "Khunti", amount: "—" },
    { district: "District not classified elsewhere", amount: "53.21" },
  ];

  const majorContributors = [
    { company: "Central Coalfields Limited", amount: "₹59.03 crore" },
    { company: "Tata Steel Limited", amount: "₹57.84 crore" },
    { company: "HDFC Bank Limited", amount: "₹50.89 crore" },
  ];

  const participation = [
    { year: "2023-24", companies: 106, amount: "₹92.74 crore" },
    { year: "2024-25", companies: 108, amount: "₹84.41 crore" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-[#1b365d] text-white py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col justify-center items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white mb-6 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-[#e87722]" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              CSR Expenditure & Impact in Jharkhand
            </h1>
          </div>
          <p className="mt-4 text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed">
            A comprehensive overview of Corporate Social Responsibility (CSR) investments, contributors, and the focal areas driving social development in Jharkhand.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12">

        {/* Top Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-blue-600">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Total FY23-24 Expenditure
            </div>
            <div className="text-3xl font-extrabold text-[#1b365d]">₹414.63 Cr</div>
            <div className="text-sm text-gray-600 mt-2">
              Representing a ~70% increase over a two-year period since FY2021-22 (₹243.95 Cr).
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-[#e87722]">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e87722]" /> Highest Receiving Hubs
            </div>
            <div className="text-3xl font-extrabold text-[#e87722]">42%</div>
            <div className="text-sm text-gray-600 mt-2">
              East Singhbhum and Ranchi alone received ₹174.85 crore of the state's total CSR.
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-l-emerald-600">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Top Contributors Share
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">40.5%</div>
            <div className="text-sm text-gray-600 mt-2">
              CCL, Tata Steel, and HDFC Bank accounted for ₹167.76 crore of the total expenditure.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Areas Receiving CSR */}
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6 text-[#1b365d]">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold">Main Areas Receiving Funding</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              The FY2023-24 data show that CSR spending in Jharkhand was heavily concentrated in key social development sectors. These represent a major connection between corporate CSR, universities, and social development.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-700"><GraduationCap className="w-5 h-5" /></div>
                  <span className="font-bold text-blue-900">Education</span>
                </div>
                <span className="font-extrabold text-blue-800 text-lg">₹147.08 Cr</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-full text-emerald-700"><HeartPulse className="w-5 h-5" /></div>
                  <span className="font-bold text-emerald-900">Health</span>
                </div>
                <span className="font-extrabold text-emerald-800 text-lg">₹141.75 Cr</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-700"><Tractor className="w-5 h-5" /></div>
                  <span className="font-bold text-amber-900">Rural Development</span>
                </div>
                <span className="font-extrabold text-amber-800 text-lg">₹50.72 Cr</span>
              </div>
            </div>
          </section>

          {/* Historical Growth & Participation */}
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-[#1b365d]">
                <TrendingUp className="w-5 h-5 text-[#e87722]" />
                <h2 className="text-lg font-bold">Total CSR Expenditure</h2>
              </div>
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-bold text-gray-600">Financial Year</th>
                    <th className="px-4 py-2 font-bold text-gray-600 text-right">Expenditure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {totalExpenditure.map((item) => (
                    <tr key={item.year}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{item.year}</td>
                      <td className="px-4 py-3 font-bold text-[#1b365d] text-right">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-[#1b365d]">
                <Briefcase className="w-5 h-5 text-[#e87722]" />
                <h2 className="text-lg font-bold">Companies Participation</h2>
              </div>
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-bold text-gray-600">Year</th>
                    <th className="px-4 py-2 font-bold text-gray-600">Companies</th>
                    <th className="px-4 py-2 font-bold text-gray-600 text-right">Amount Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participation.map((item) => (
                    <tr key={item.year}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{item.year}</td>
                      <td className="px-4 py-3 text-gray-600">{item.companies}</td>
                      <td className="px-4 py-3 font-bold text-[#1b365d] text-right">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* District Wise Table */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[#1b365d]">
                <MapPin className="w-5 h-5 text-[#e87722]" />
                <h2 className="text-xl font-bold">District-wise Distribution (FY2023-24)</h2>
              </div>
              <p className="text-xs text-gray-500 mt-2">CSR is heavily concentrated in major industrial/urban centres.</p>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-white sticky top-0 border-b border-gray-200 shadow-xs">
                  <tr>
                    <th className="px-6 py-3 font-bold text-gray-700">District</th>
                    <th className="px-6 py-3 font-bold text-gray-700 text-right">CSR (₹ Crore)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {districtExpenditure.map((item, idx) => (
                    <tr key={item.district} className={idx < 2 ? "bg-amber-50/50" : ""}>
                      <td className="px-6 py-3 font-medium text-gray-800">{item.district}</td>
                      <td className="px-6 py-3 font-semibold text-[#1b365d] text-right">{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td className="px-6 py-4 font-bold text-[#1b365d]">Total</td>
                    <td className="px-6 py-4 font-bold text-[#1b365d] text-right">₹414.63</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Major Contributors */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 h-fit">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[#1b365d]">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">Major CSR Contributors (FY2023-24)</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {majorContributors.map((item, index) => (
                  <div key={item.company} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-bold text-gray-800">{item.company}</span>
                    </div>
                    <span className="font-extrabold text-[#1b365d]">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
