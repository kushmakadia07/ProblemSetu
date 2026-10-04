"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle, Smartphone, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { store } from "@/lib/store";
import { upsertCitizenProfileInSupabase } from "@/lib/supabase";

const JHARKHAND_DISTRICTS: string[] = [
  "Ranchi", "Dhanbad", "Bokaro", "East Singhbhum", "West Singhbhum",
  "Palamu", "Garhwa", "Chatra", "Hazaribagh", "Ramgarh", "Koderma", "Giridih",
  "Deoghar", "Dumka", "Godda", "Sahebganj", "Pakur", "Jamtara", "Lohardaga",
  "Gumla", "Simdega", "Latehar", "Khunti", "Saraikela Kharsawan"
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Citizen inputs
  const [citizenName, setCitizenName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [addressState, setAddressState] = useState("Jharkhand");
  const [addressDistrict, setAddressDistrict] = useState("Ranchi");
  const [addressLine, setAddressLine] = useState("");

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // 60-second cooldown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleAadhaarChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(digitsOnly);
    if (digitsOnly.length > 0 && digitsOnly.length < 12) {
      setAadhaarError("Aadhaar Card number must be 12 digits.");
    } else {
      setAadhaarError("");
    }
  };

  const handleMobileChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(digitsOnly);
    if (digitsOnly.length > 0 && !/^[6-9]/.test(digitsOnly)) {
      setMobileError("Indian mobile numbers should start with 6, 7, 8, or 9.");
    } else if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setMobileError("Mobile number must be exactly 10 digits.");
    } else {
      setMobileError("");
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError("");
    setLoginMessage("");
    setAadhaarError("");
    setMobileError("");

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
    const cleanMobile = mobileNumber.replace(/\D/g, "");

    if (!citizenName.trim()) {
      setOtpError("Please enter your full name.");
      return;
    }

    // Aadhaar: can be any 12 digits, treated independently
    if (cleanAadhaar.length !== 12) {
      setAadhaarError("Please enter a valid 12-digit Aadhaar Card number.");
      return;
    }

    // Phone: must be valid 10-digit Indian mobile
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setMobileError("Please enter a valid 10-digit mobile number (starting with 6, 7, 8, or 9).");
      return;
    }

    if (!addressLine.trim()) {
      setOtpError("Please enter your permanent address details.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanMobile, aadhaar: cleanAadhaar }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Failed to send OTP. Please try again.");
        setIsSendingOtp(false);
        return;
      }

      setOtpSent(true);
      setResendCooldown(60);

      if (data.smsSent) {
        setLoginMessage(`SMS OTP successfully dispatched to +91 ${cleanMobile}. (Demo code: 123456 is also active)`);
      } else {
        setLoginMessage(`OTP generated for +91 ${cleanMobile}: ${data.otp} (Demo code 123456 is also active)`);
      }
    } catch (err: any) {
      setOtpError("Network error while requesting OTP. Please check your internet connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, "");

    if (!otp.trim()) {
      setOtpError("Please enter the 6-digit OTP code sent to your phone or demo code 123456.");
      return;
    }

    setOtpError("");
    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanMobile, otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.verified) {
        setOtpError(data.error || "Invalid OTP code. Please enter the OTP sent to your phone or demo code 123456.");
        setIsVerifyingOtp(false);
        return;
      }

      // Verification succeeded -> persist or update citizen profile in Supabase profiles table
      const fullAddress = `${addressLine}, ${addressDistrict}, ${addressState}`;

      let profileId = "";
      try {
        const savedProfile = await upsertCitizenProfileInSupabase({
          fullName: citizenName,
          phone: cleanMobile,
          aadhaarNumber: aadhaarNumber,
          state: addressState,
          district: addressDistrict,
          addressLine: addressLine,
        });
        if (savedProfile?.id) {
          profileId = savedProfile.id;
        }
      } catch (profErr) {
        console.warn("Supabase profile creation error:", profErr);
      }

      store.setCitizenAuth(aadhaarNumber, mobileNumber, citizenName, fullAddress, true, profileId);
      store.setRole("citizen");

      const redirect = searchParams.get("redirect") || "/citizen/dashboard";
      router.push(redirect);
    } catch (err) {
      setOtpError("Failed to verify OTP due to a network error. Try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white text-gray-800 rounded-md shadow-xl border border-gray-300 overflow-hidden">
        {/* Box Header */}
        <div className="bg-[#10223d] text-white p-4 border-b border-blue-900 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm tracking-wide">ProblemSetu Citizen Login</h2>
            <div className="text-[11px] text-gray-300">Sign in with phone OTP verification</div>
          </div>
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>

        {/* Tab Content Form */}
        <div className="p-5">
          {otpError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{otpError}</span>
            </div>
          )}

          {loginMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{loginMessage}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleLoginSubmit : handleSendOtp} className="space-y-3.5">
            <div className="text-xs text-gray-600 mb-1 leading-relaxed">
              Enter your details below. OTP verification is performed exclusively with your mobile phone number.
            </div>

            {/* Mandatory Name Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Enter your full name"
                disabled={otpSent}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d] ${
                  otpSent ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                }`}
              />
            </div>

            {/* Independent 12-Digit Aadhaar Card Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Aadhaar Card Number (12 Digits) *
                </label>
                <span className="text-[10px] text-gray-500 font-medium">Any 12 digits (Independent ID)</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  placeholder="Enter any 12-digit Aadhaar number"
                  disabled={otpSent}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono tracking-wider focus:outline-hidden focus:border-[#1b365d] ${
                    otpSent ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
              {aadhaarError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{aadhaarError}</p>
              )}
            </div>

            {/* Phone Number Input for OTP Verification */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs text-gray-500 font-semibold">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  placeholder="10-digit mobile number"
                  disabled={otpSent}
                  required
                  className={`w-full pl-12 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d] ${
                    otpSent ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
              {mobileError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{mobileError}</p>
              )}
            </div>

            {/* Permanent Address Inputs */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Permanent Address *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                    State
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
                    District
                  </label>
                  <select
                    value={addressDistrict}
                    onChange={(e) => setAddressDistrict(e.target.value)}
                    disabled={otpSent}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d] ${
                      otpSent ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                    }`}
                  >
                    {JHARKHAND_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                  House No, Street, Area, Taluk
                </label>
                <textarea
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Enter house number, street, area..."
                  disabled={otpSent}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d] ${
                    otpSent ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            </div>

            {/* OTP Entry Section (when OTP is sent) */}
            {otpSent && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OTP Sent to +91 {mobileNumber}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">Demo: 123456</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Enter 6-Digit OTP *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setOtpError("");
                    }}
                    placeholder="123456"
                    required
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-300 rounded text-base tracking-widest text-center font-bold focus:outline-hidden focus:border-[#1b365d]"
                  />
                </div>

                {/* Resend OTP countdown (60s) */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Didn&apos;t receive the OTP?</span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={resendCooldown > 0 || isSendingOtp}
                    className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                      resendCooldown > 0 || isSendingOtp
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-700 hover:text-blue-900 cursor-pointer underline"
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? "" : "hover:rotate-180 transition-transform"}`} />
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setOtpError("");
                      setLoginMessage("");
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Change phone number or details
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSendingOtp || isVerifyingOtp}
              className="w-full gov-btn-accent text-sm py-2.5 font-bold rounded shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {(isSendingOtp || isVerifyingOtp) && <Loader2 className="w-4 h-4 animate-spin" />}
              {otpSent
                ? isVerifyingOtp ? "Verifying OTP..." : "Verify OTP & Continue"
                : isSendingOtp ? "Sending OTP..." : "Get OTP"}
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
