"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function UniversitiesPage() {
  const { language } = useLanguage();

  const stateUniversities = [
    { no: 1, name: "Central University of Jharkhand", location: "Ranchi" },
    { no: 2, name: "Ranchi University", location: "Ranchi" },
    { no: 3, name: "Kolhan University", location: "Chaibasa, West Singhbhum" },
    { no: 4, name: "Vinoba Bhave University", location: "Hazaribagh" },
    { no: 5, name: "Nilamber-Pitamber University", location: "Medininagar, Palamu" },
    { no: 6, name: "Birsa Agricultural University", location: "Ranchi" },
    { no: 7, name: "Sido Kanhu Murmu University", location: "Dumka" },
    { no: 8, name: "Binod Bihari Mahto Koyalanchal University", location: "Dhanbad" },
    { no: 9, name: "Dr. Shyama Prasad Mukherjee University", location: "Ranchi" },
    { no: 10, name: "Jharkhand University of Technology", location: "Ranchi" },
    { no: 11, name: "Jharkhand Raksha Shakti University", location: "Ranchi" },
    { no: 12, name: "Jamshedpur Women's University", location: "Jamshedpur" },
    { no: 13, name: "Jharkhand State Open University", location: "Ranchi" },
    { no: 14, name: "Pandit Raghunath Murmu Tribal University", location: "Jamshedpur" },
    { no: 15, name: "AISECT University", location: "Hazaribagh" },
    { no: 16, name: "Amity University Jharkhand", location: "Ranchi" },
    { no: 17, name: "Arka Jain University", location: "Jamshedpur" },
    { no: 18, name: "Babu Dinesh Singh University", location: "Garhwa" },
    { no: 19, name: "Capital University", location: "Koderma" },
    { no: 20, name: "Durga Soren University", location: "Deoghar" },
    { no: 21, name: "ICFAI University, Jharkhand", location: "Ranchi" },
    { no: 22, name: "Jharkhand Rai University", location: "Ranchi" },
    { no: 23, name: "Netaji Subhas University", location: "Jamshedpur" },
    { no: 24, name: "Pragyan International University", location: "Ranchi" },
    { no: 25, name: "Radha Govind University", location: "Ramgarh" },
    { no: 26, name: "RKDF University", location: "Ranchi" },
    { no: 27, name: "Ramchandra Chandravansi University", location: "Palamu" },
    { no: 28, name: "Sai Nath University", location: "Ranchi" },
    { no: 29, name: "Sarala Birla University", location: "Ranchi" },
    { no: 30, name: "Sona Devi University", location: "Ghatsila, East Singhbhum" },
    { no: 31, name: "Usha Martin University", location: "Ranchi" },
    { no: 32, name: "YBN University", location: "Ranchi" },
    { no: 33, name: "Birla Institute of Technology (BIT Mesra)", location: "Mesra, Ranchi" },
  ];

  const nationalInstitutions = [
    { no: 34, name: "IIT (Indian School of Mines) Dhanbad", location: "Dhanbad" },
    { no: 35, name: "National Institute of Technology Jamshedpur", location: "Jamshedpur" },
    { no: 36, name: "Indian Institute of Information Technology Ranchi", location: "Ranchi" },
    { no: 37, name: "Indian Institute of Management Ranchi", location: "Ranchi" },
    { no: 38, name: "AIIMS Deoghar", location: "Deoghar" },
    { no: 39, name: "National Institute of Advanced Manufacturing Technology", location: "Ranchi" },
    { no: 40, name: "National University of Study and Research in Law", location: "Ranchi" },
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
            <GraduationCap className="w-10 h-10 text-[#e87722]" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Universities Connected with Us
            </h1>
          </div>
          <p className="mt-4 text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed">
            A comprehensive list of all major state and national educational institutions in Jharkhand working with us to turn grassroots problems into technical solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
        {/* State Universities Table */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#1b365d]">
            <Building2 className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Universities in Jharkhand</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-700">No.</th>
                    <th className="px-6 py-4 font-bold text-gray-700">University Name</th>
                    <th className="px-6 py-4 font-bold text-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {stateUniversities.map((uni) => (
                    <tr key={uni.no} className="hover:bg-blue-50/50 transition">
                      <td className="px-6 py-3 font-semibold text-gray-500">{uni.no}</td>
                      <td className="px-6 py-3 font-semibold text-[#1b365d]">{uni.name}</td>
                      <td className="px-6 py-3 text-gray-600">{uni.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* National Institutions Table */}
        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2 text-[#1b365d] mb-1">
              <GraduationCap className="w-6 h-6 text-[#e87722]" />
              <h2 className="text-2xl font-bold">Major national-level higher-education institutions</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium">These are not all counted as ordinary universities.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-[#1b365d] text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">No.</th>
                    <th className="px-6 py-4 font-bold">Institution Name</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {nationalInstitutions.map((inst) => (
                    <tr key={inst.no} className="hover:bg-blue-50/50 transition">
                      <td className="px-6 py-3 font-semibold text-gray-500">{inst.no}</td>
                      <td className="px-6 py-3 font-semibold text-[#1b365d]">{inst.name}</td>
                      <td className="px-6 py-3 text-gray-600">{inst.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
