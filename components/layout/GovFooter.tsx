"use client";

import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, ExternalLink, Award } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function GovFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="w-full bg-[#10223d] text-gray-300 text-xs border-t-4 border-[#e87722] mt-auto">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About Portal */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{t("footerAboutTitle")}</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-[11px] mb-3">
            {t("footerAboutDesc")}
          </p>
          <div className="text-[10px] text-amber-300 font-medium">
            ProblemSetu Project
          </div>
        </div>

        {/* Col 2: Policy Directives */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t("footerFrameworkTitle")}</span>
          </div>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/about" className="hover:text-amber-300 transition flex items-center gap-1">
                <span>{language === "hi" ? "एनईपी 2020: व्यावहारिक एवं सामुदायिक क्रेडिट" : "NEP 2020: Experiential & Community Credits"}</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-300 transition flex items-center gap-1">
                <span>{language === "hi" ? "नियम और नीतियां" : "Rules & Guidelines"}</span>
              </Link>
            </li>
            <li>
              <Link href="/analytics/leaderboard" className="hover:text-amber-300 transition">
                {language === "hi" ? "रैंकिंग और आंकड़े" : "Rankings & Data"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal Roles */}
        <div>
          <div className="text-white font-bold text-sm mb-3">{t("footerEcosystemTitle")}</div>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/citizen/dashboard" className="hover:text-amber-300 transition">
                {language === "hi" ? "नागरिक पोर्टल: आधार सत्यापित समस्या निवारण" : "Citizen Portal: Aadhaar Verified Grievances"}
              </Link>
            </li>
            <li>
              <Link href="/citizen/verify-resolution" className="hover:text-amber-300 transition">
                {language === "hi" ? "नागरिक गेटवे: फील्ड प्रोटोटाइप सत्यापन" : "Citizen Stage-Gate: Verify Field Prototypes"}
              </Link>
            </li>
            <li>
              <Link href="/university/dashboard" className="hover:text-amber-300 transition">
                {language === "hi" ? "विश्वविद्यालय: बहुविषयक इंजीनियरिंग टीमें" : "Academia: Multidisciplinary Engineering Teams"}
              </Link>
            </li>
            <li>
              <Link href="/csr/dashboard" className="hover:text-amber-300 transition">
                {language === "hi" ? "सीएसआर भागीदार: एस्क्रो फंडिंग एवं स्केल-अप" : "CSR Partners: Escrow Funding & Scale-Up"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: State Contact & Helplines */}
        <div>
          <div className="text-white font-bold text-sm mb-3">{t("footerHelpTitle")}</div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">{t("footerTollFree")}</div>
                <div className="text-amber-300">1800-345-6570 (9:00 AM - 6:00 PM)</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">{t("footerDesk")}</div>
                <div className="text-gray-300">support@problemsetu.in</div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-950/60 rounded border border-blue-900 text-[10px] text-gray-300">
              {t("footerAddress")}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Copyright bar */}
      <div className="bg-[#0b172a] py-3 px-4 border-t border-gray-800 text-[11px] text-gray-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {t("footerCopyright")}
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>{t("footerTerms")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
