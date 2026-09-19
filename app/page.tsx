"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  FilePlus,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Phone,
  Lock,
  User,
  Smartphone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { store, Grievance, UserRole } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Grievance | null | undefined>(undefined);

  // Login form state
  const [activeTab, setActiveTab] = useState<"citizen" | "university" | "csr" | "officer">("citizen");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [role, setRole] = useState<UserRole>("public");

  // Carousel state
  const carouselImages = [
    "/carousel/slide1.jpg",
    "/carousel/slide2.jpg",
    "/carousel/slide3.jpg"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    setGrievances(store.getGrievances());
    setRole(store.getRole());
    const unsub = store.subscribe(() => {
      setGrievances(store.getGrievances());
      setRole(store.getRole());
    });
    return () => unsub();
  }, []);

  // Stats calculation
  const totalIssues = grievances.length + 1840; // realistic aggregate figure
  const activeProposals = 38;
  const verifiedClosures = grievances.filter((g) => g.status === "RESOLVED_CLOSED").length + 612;
  const csrFundsLakhs = 769.5;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = grievances.find((g) => g.id.toLowerCase() === searchId.trim().toLowerCase());
    setSearchResult(found || null);
  };

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
    if (activeTab === "citizen") {
      store.setCitizenAuth(aadhaarNumber, mobileNumber, "Citizen User", "Jharkhand", true);
      store.setRole("citizen");
      router.push("/citizen/dashboard");
    } else if (activeTab === "university") {
      store.setRole("university");
      router.push("/university/dashboard");
    } else if (activeTab === "csr") {
      store.setRole("csr");
      router.push("/csr/dashboard");
    } else {
      store.setRole("admin");
      router.push("/analytics/leaderboard");
    }
  };

  return (
    <div className="w-full">

      {/* Image Carousel Banner */}
      <div className="relative w-full h-[150px] sm:h-[250px] md:h-[350px] lg:h-[450px] overflow-hidden bg-gray-100">
        {carouselImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors cursor-pointer shadow-sm ${
                index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section with Dual Layout: Welcome & Search on Left, Login Widget on Right */}
      <section className="bg-linear-to-b from-[#1b365d] to-[#122642] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (12 cols): Hero Banner, Description & Grievance Tracker */}
          <div className="lg:col-span-12 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 rounded-full px-3 py-1 text-xs text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("heroBadge")}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {t("heroTitle")}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={role === "public" ? "/login?redirect=/citizen/report-issue" : "/citizen/report-issue"}
                className="gov-btn-accent text-sm py-2.5 px-5 font-semibold rounded shadow-md hover:shadow-lg transition"
              >
                <FilePlus className="w-4 h-4" />
                <span>{t("btnLodge")}</span>
              </Link>
              <Link
                href="/about"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm py-2.5 px-5 rounded font-medium transition"
              >
                <span>{t("btnExplore")}</span>
              </Link>
              <Link
                href="/analytics/leaderboard"
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-sm py-2.5 px-4 rounded font-medium transition flex items-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{t("btnRankings")}</span>
              </Link>
            </div>

            {/* Information Portals */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/universities"
                className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-bold text-sm sm:text-base shadow-lg transition-colors border border-blue-600"
              >
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span className="text-center">University Connected with Us</span>
              </Link>
              
              <Link
                href="/csr-information"
                className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-bold text-sm sm:text-base shadow-lg transition-colors border border-emerald-600"
              >
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-center">CSR Information</span>
              </Link>
            </div>

            {/* Track Grievance Status Box */}
            <div id="track" className="bg-white text-gray-800 p-5 rounded-md shadow-lg border-2 border-amber-400 mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2 font-bold text-[#1b365d] text-sm">
                  <Search className="w-4 h-4 text-[#e87722]" />
                  <span>{t("trackTitle")}</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">{t("trackSubtitle")}</span>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder={t("trackPlaceholder")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-hidden focus:border-[#1b365d]"
                  />
                </div>
                <button
                  type="submit"
                  className="gov-btn-primary text-sm py-2 px-6 shrink-0 rounded cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("btnCheckStatus")}</span>
                </button>
              </form>

              {/* Live Search Result */}
              {searchResult !== undefined && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {searchResult ? (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1b365d] text-sm">{searchResult.id}</span>
                        <span className="gov-badge gov-badge-active">{searchResult.status}</span>
                      </div>
                      <div className="font-semibold text-gray-900">{searchResult.title}</div>
                      <div className="text-gray-600">
                        Location: {searchResult.panchayat}, {searchResult.block}, {searchResult.district}
                      </div>
                      {searchResult.assignedUniversityName && (
                        <div className="text-emerald-800 font-medium">
                          {t("assignedInstitution")} {searchResult.assignedUniversityName} ({searchResult.studentTeamName})
                        </div>
                      )}
                      <div className="pt-1 text-right">
                        <Link
                          href="/citizen/dashboard"
                          className="text-[#e87722] font-semibold hover:underline flex items-center justify-end gap-1"
                        >
                          <span>{t("viewTimeline")}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                      {t("noGrievanceFound")} &ldquo;{searchId}&rdquo;. {t("verifyCode")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Live Statistics Dashboard (Counters) */}
      <section className="bg-white border-y border-gray-300 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#e87722] uppercase tracking-widest">
              {t("statsTag")}
            </span>
            <h2 className="text-xl font-extrabold text-[#1b365d]">
              {t("statsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="gov-card p-4 text-center border-l-4 border-l-[#1b365d]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1b365d]">
                {totalIssues.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{t("statGrievances")}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{t("statGrievancesSub")}</div>
            </div>

            <div className="gov-card p-4 text-center border-l-4 border-l-[#e87722]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#e87722]">
                {activeProposals}
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{t("statPrototypes")}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{t("statPrototypesSub")}</div>
            </div>

            <div className="gov-card p-4 text-center border-l-4 border-l-emerald-600">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                ₹{csrFundsLakhs} L
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{t("statCsrFunds")}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{t("statCsrFundsSub")}</div>
            </div>

            <div className="gov-card p-4 text-center border-l-4 border-l-blue-600">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">
                {verifiedClosures.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{t("statResolutions")}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{t("statResolutionsSub")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How the 4-Pillar Ecosystem Operates */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#e87722] uppercase tracking-wider">
              {t("workflowTag")}
            </span>
            <h2 className="text-2xl font-bold text-[#1b365d] mt-1">
              {t("workflowTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {t("workflowSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="gov-card p-5 relative border-t-4 border-t-[#1b365d]">
              <div className="w-8 h-8 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-[#1b365d] text-sm mb-1.5">{t("step1Title")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("step1Desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="gov-card p-5 relative border-t-4 border-t-[#e87722]">
              <div className="w-8 h-8 rounded-full bg-[#e87722] text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-[#1b365d] text-sm mb-1.5">{t("step2Title")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("step2Desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="gov-card p-5 relative border-t-4 border-t-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-[#1b365d] text-sm mb-1.5">{t("step3Title")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("step3Desc")}
              </p>
            </div>

            {/* Step 4 */}
            <div className="gov-card p-5 relative border-t-4 border-t-emerald-600">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-[#1b365d] text-sm mb-1.5">{t("step4Title")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("step4Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Active Grassroots Innovations */}
      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
            <div>
              <span className="text-xs font-bold text-[#e87722] uppercase tracking-wider">
                {t("fieldDemonstratorsTag")}
              </span>
              <h2 className="text-2xl font-bold text-[#1b365d] mt-1">
                {t("featuredTitle")}
              </h2>
            </div>
            <Link
              href="/analytics/leaderboard"
              className="text-xs font-bold text-[#1b365d] hover:text-[#e87722] flex items-center gap-1"
            >
              <span>{t("viewAllDistricts")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grievances.slice(0, 3).map((item) => (
              <div key={item.id} className="gov-card flex flex-col justify-between hover:shadow-md transition">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="gov-badge gov-badge-saffron">{item.category}</span>
                    <span className="text-[11px] font-mono text-gray-500 font-semibold">{item.id}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#1b365d] leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e87722]" />
                    <span>
                      {item.panchayat}, {item.block}, <strong>{item.district}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                    {item.description}
                  </p>

                  {item.assignedUniversityName && (
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded text-[11px] space-y-1">
                      <div className="font-semibold text-[#1b365d] flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                        <span className="truncate">{item.assignedUniversityName}</span>
                      </div>
                      <div className="text-gray-500 text-[10px]">
                        Team: {item.studentTeamName}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="gov-badge gov-badge-active">{item.status}</span>
                  <Link
                    href={`/citizen/dashboard`}
                    className="text-[#1b365d] font-semibold hover:text-[#e87722] flex items-center gap-1"
                  >
                    <span>{t("viewLifecycle")}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Call to Action Banner */}
      <section className="bg-[#1b365d] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {t("ctaTitle")}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {t("ctaSub")}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/csr/dashboard"
              className="gov-btn-accent text-xs sm:text-sm py-2 px-4 rounded font-bold"
            >
              {t("btnBrowseProposals")}
            </Link>
            <Link
              href="/about"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs sm:text-sm py-2 px-4 rounded font-medium"
            >
              {t("btnPolicyGuide")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
