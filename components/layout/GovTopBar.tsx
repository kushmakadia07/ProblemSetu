"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Info, Home } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function GovTopBar() {
  const { t } = useLanguage();
  const [fontSize, setFontSize] = useState<number>(100);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const changeFontSize = (delta: number) => {
    const newSize = Math.min(125, Math.max(85, fontSize + delta));
    setFontSize(newSize);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--font-scale", `${newSize}%`);
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--font-scale", `100%`);
    }
  };

  return (
    <header className="w-full">
      {/* Tricolor top strip */}
      <div className="tricolor-strip w-full" aria-hidden="true" />

      {/* Accessibility & Platform Utility Strip */}
      <div className="bg-[#11233b] text-gray-200 text-xs py-1 px-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Platform attribution */}
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide text-gray-100 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t("topBarTag")}
            </span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-gray-300 hidden md:inline text-[11px]">
              {t("topBarSub")}
            </span>
          </div>

          {/* Right: Accessibility toolbar */}
          <div className="flex items-center gap-3">
            {/* Screen reader skip link */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:bg-white focus:text-[#1b365d] px-2 py-0.5 rounded">
              {t("skipContent")}
            </a>

            {/* Home Button */}
            <Link 
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            {/* About Us Button */}
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-white font-semibold bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Us</span>
            </button>

            {/* Contact Us Button */}
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>

            <span className="text-gray-600 hidden sm:inline">|</span>

            {/* Font Resize */}
            <div className="flex items-center border border-gray-600 rounded overflow-hidden bg-slate-800">
              <button
                type="button"
                onClick={() => changeFontSize(-5)}
                title="Decrease Font Size"
                className="px-1.5 py-0.5 hover:bg-slate-700 transition font-bold"
              >
                A-
              </button>
              <button
                type="button"
                onClick={resetFontSize}
                title="Reset Font Size"
                className="px-1.5 py-0.5 hover:bg-slate-700 transition font-bold border-x border-gray-600"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize(5)}
                title="Increase Font Size"
                className="px-1.5 py-0.5 hover:bg-slate-700 transition font-bold"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Identity Masthead */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* User-Provided Circular Logo */}
            <div className="w-14 h-14 rounded-full border-2 border-[#1b365d] bg-white p-0.5 flex items-center justify-center shadow-md group-hover:border-[#e87722] transition shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="ProblemSetu Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            <div>
              <div className="text-xs font-bold text-[#e87722] uppercase tracking-wider">
                CITIZEN SUPPORT
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#1b365d] tracking-tight leading-snug">
                ProblemSetu
              </h1>
              <p className="text-xs text-gray-600 font-medium hidden sm:block">
                {t("portalSubtitle")}
              </p>
            </div>
          </Link>

          {/* Right Header Element removed as per request */}
        </div>
      </div>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200">
            <div className="bg-[#1b365d] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-amber-300" />
                HELP & SUPPORT
              </h3>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="text-gray-300 hover:text-white text-xl leading-none cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Toll-Free Helpline:</div>
                <div className="text-xl font-black text-[#1b365d] tracking-tight">1800-345-6570</div>
                <div className="text-sm text-gray-600 font-medium">(9:00 AM - 6:00 PM)</div>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Help Desk:</div>
                <div className="text-base font-bold text-[#e87722]">support@problemsetu.in</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* About Us Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1b365d] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-400" />
                ABOUT PROBLEMSETU
              </h3>
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="text-gray-300 hover:text-white text-xl leading-none cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-base font-bold text-[#e87722] mb-2 uppercase tracking-wide">Our story</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  ProblemSetu started with a simple observation: across Jharkhand, citizens know exactly what&apos;s broken in their communities — a contaminated hand pump, an unsafe road, a school without basic facilities — but have no structured way to turn that knowledge into action. At the same time, universities sit on research capacity and industry sits on funding, both looking for real problems worth solving. Nobody had built the bridge connecting them. So we did.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-base font-bold text-[#e87722] mb-2 uppercase tracking-wide">Our mission</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  To turn every citizen-reported problem into a structured, fundable, research-backed solution — and to make sure no complaint disappears into a system without a verified fix at the end.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-base font-bold text-[#e87722] mb-2 uppercase tracking-wide">Our vision</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A Jharkhand where the distance between &quot;someone noticed a problem&quot; and &quot;someone solved it&quot; is measured in weeks, not years — where universities, industry, and citizens work as one connected system instead of three isolated ones.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
