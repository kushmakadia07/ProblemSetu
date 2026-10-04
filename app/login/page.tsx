"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle } from "lucide-react";
import { store } from "@/lib/store";
import { useLanguage } from "@/lib/language";

const JHARKHAND_DISTRICTS: string[] = [
  "Ranchi", "Dhanbad", "Bokaro", "East Singhbhum", "West Singhbhum",
  "Palamu", "Garhwa", "Chatra", "Hazaribagh", "Ramgarh", "Koderma", "Giridih",
  "Deoghar", "Dumka", "Godda", "Sahebganj", "Pakur", "Jamtara", "Lohardaga",
  "Gumla", "Simdega", "Latehar", "Khunti", "Saraikela Kharsawan"
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  // Login form state
  const [activeTab, setActiveTab] = useState<"citizen" | "university" | "csr" | "officer">("citizen");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [addressState, setAddressState] = useState("Jharkhand");
  const [addressDistrict, setAddressDistrict] = useState("Ranchi");
  const [addressLine, setAddressLine] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleAadhaarChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(digitsOnly);
    if (digitsOnly.length > 0 && digitsOnly.length < 12) {
      setAadhaarError(language === "hi" ? "आधार संख्या 12 अंकों की होनी चाहिए।" : "Aadhaar Card number must be exactly 12 digits.");
    } else {
      setAadhaarError("");
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
    const cleanMobile = mobileNumber.replace(/\D/g, "");

    if (cleanAadhaar.length !== 12) {
      setAadhaarError(language === "hi" ? "कृपया 12-अंकीय आधार कार्ड संख्या दर्ज करें (व्यक्ति पहचान प्रमाण)।" : "Please enter a valid 12-digit Aadhaar Card number for mandatory proof of person.");
      return;
    }
    if (cleanMobile.length < 10) {
      setLoginMessage(language === "hi" ? "कृपया आधार से लिंक 10-अंकीय मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number linked with your Aadhaar.");
      return;
    }
    if (!citizenName.trim() || !addressLine.trim()) {
      setLoginMessage(language === "hi" ? "कृपया अपना नाम और पूरा पता (मकान नंबर, सड़क आदि) दर्ज करें।" : "Please enter your Name and complete Address details.");
      return;
    }

    setAadhaarError("");
    setOtpSent(true);
    setLoginMessage(
      language === "hi"
        ? `आधार संख्या (XXXX-XXXX-${cleanAadhaar.slice(8)}) लिंक मोबाइल +91 ${cleanMobile} से सत्यापित। यूआईडीएआई ओटीपी भेजा गया (डेमो कोड: 123456)`
        : `Aadhaar (XXXX-XXXX-${cleanAadhaar.slice(8)}) verified with linked mobile +91 ${cleanMobile}. Demo OTP sent: 123456`
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${addressLine}, ${addressDistrict}, ${addressState}`;
    store.setCitizenAuth(aadhaarNumber, mobileNumber, citizenName, fullAddress, true);
    store.setRole("citizen");
    const redirect = searchParams.get("redirect") || "/citizen/dashboard";
    router.push(redirect);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white text-gray-800 rounded-md shadow-xl border border-gray-300 overflow-hidden">
        {/* Box Header */}
        <div className="bg-[#10223d] text-white p-4 border-b border-blue-900 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm tracking-wide">{t("ssoTitle")}</h2>
            <div className="text-[11px] text-gray-300">{t("ssoSubtitle")}</div>
          </div>
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>

        {/* Tab Content Form */}
        <div className="p-5">
          {loginMessage && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded">
              {loginMessage}
            </div>
          )}

          <form onSubmit={otpSent ? handleLoginSubmit : handleSendOtp} className="space-y-3.5">
              <div className="text-xs text-gray-600 mb-1 leading-relaxed">
                {t("citizenNote")}
              </div>

              {/* Mandatory Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === "hi" ? "पूरा नाम" : "Full Name"} *
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={language === "hi" ? "अपना पूरा नाम दर्ज करें" : "Enter your full name"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                />
              </div>

              {/* Mandatory 12-Digit Aadhaar Card Number Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("aadhaarLabel")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => handleAadhaarChange(e.target.value)}
                    placeholder={t("aadhaarPlaceholder")}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono tracking-wider focus:outline-hidden focus:border-[#1b365d]"
                  />
                </div>
                {aadhaarError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{aadhaarError}</p>
                )}
              </div>

              {/* Mandatory Aadhaar-Linked Mobile Number Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("mobileLabel")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs text-gray-500 font-semibold">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder={t("mobilePlaceholder")}
                    required
                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                  />
                </div>
              </div>

              {/* Mandatory Permanent Address Inputs */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">
                  {language === "hi" ? "स्थायी पता" : "Permanent Address"} *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                      {language === "hi" ? "राज्य" : "State"}
                    </label>
                    <select
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 text-gray-800 font-medium focus:outline-hidden cursor-not-allowed"
                    >
                      <option value="Jharkhand">Jharkhand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                      {language === "hi" ? "ज़िला" : "District"}
                    </label>
                    <select
                      value={addressDistrict}
                      onChange={(e) => setAddressDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-hidden focus:border-[#1b365d]"
                    >
                      {JHARKHAND_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                    {language === "hi" ? "मकान नंबर, सड़क, क्षेत्र, तालुक" : "House No, Street, Area, Taluk"}
                  </label>
                  <textarea
                    rows={2}
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder={language === "hi" ? "अपना पता दर्ज करें..." : "Enter house number, street..."}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                  />
                </div>
              </div>

              {/* Proof-of-Person UIDAI notice */}
              <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200 p-2 rounded flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t("aadhaarVerificationNotice")}</span>
              </div>

              {/* Aadhaar Verification Confirmed Badge & OTP Entry */}
              {otpSent && (
                <div className="space-y-2 pt-1 border-t border-gray-200">
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("aadhaarVerifiedBadge")}</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t("otpLabel")}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm tracking-widest text-center font-bold focus:outline-hidden focus:border-[#1b365d]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full gov-btn-accent text-sm py-2.5 font-bold rounded shadow-xs cursor-pointer"
              >
                {otpSent ? t("btnVerifyOtp") : t("btnGetOtp")}
              </button>


            </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
