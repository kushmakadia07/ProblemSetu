"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

export const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar
    topBarTag: "PROBLEMSETU | HELP CENTER",
    topBarSub: "Connecting Your Problems to Solutions",
    skipContent: "Skip to Main Content",
    tollFree: "Toll Free: 1800-345-6570",
    portalName: "ProblemSetu",
    portalHindiName: "प्रॉब्लम सेतु",
    portalTagline: "Connecting Your Problems to Solutions",
    portalSubtitle: "Samasya se Samadhan tak",

    // Navbar
    personaSwitcher: "CHOOSE USER TYPE:",
    personaHint: "Choose your role to see how the site works for you:",
    role: "Role:",
    rolePublic: "Public / Guest",
    roleCitizen: "Citizen",
    roleUniversity: "College / University",
    roleCsr: "Company / Funder",
    home: "Home",
    reportIssue: "Report a Problem",
    leaderboard: "Leaderboard",
    policy: "Rules & Guidelines",
    myGrievances: "My Problems",
    verifyResolution: "Verify Resolution (Proof)",
    routedProblems: "Assigned Problems",
    proposals: "Proposals & Teams",
    marketplace: "Proposals Marketplace",
    escrowProjects: "Funded Projects",
    scaleUp: "Materials & Costs",
    loginRegister: "Login / Register",
    signOut: "Sign Out",
    loggedInAs: "Logged in as",

    // Ticker & Hero
    announcementBadge: "ANNOUNCEMENT",
    announcementText: "ProblemSetu: Students earn credit for solving problems • Funds provided for building solutions • Proof of resolution required.",
    heroBadge: "Problem Solving Platform",
    heroTitle: "Turning Local Challenges into College Projects",
    heroSubtitle: "A place where citizens can report local problems, college students build solutions, and companies provide the funds.",
    btnLodge: "Report a Problem",
    btnExplore: "Learn How It Works",
    btnRankings: "See Rankings",

    // Track Status Box
    trackTitle: "CHECK PROBLEM STATUS",
    trackSubtitle: "ProblemSetu Tracker",
    trackPlaceholder: "Enter Tracking No. (e.g. JH-SOC-2026-1042)",
    btnCheckStatus: "Check Status",
    assignedInstitution: "Assigned To:",
    viewTimeline: "View Full History",
    noGrievanceFound: "No problem found matching",
    verifyCode: "Please verify your tracking code.",

    // Login Widget
    ssoTitle: "PROBLEMSETU LOGIN",
    ssoSubtitle: "Sign in to your account",
    tabCitizen: "Citizen (Aadhaar)",
    tabAcademia: "College",
    tabCsr: "Company",
    tabOfficer: "Officer",
    citizenNote: "Citizens sign in with their 12-digit Aadhaar Card and linked Mobile Number to verify identity.",
    aadhaarLabel: "Aadhaar Card Number (12 Digits) *",
    aadhaarPlaceholder: "1234 5678 9012",
    mobileLabel: "Mobile Number (Linked with Aadhaar) *",
    mobilePlaceholder: "9835100000",
    aadhaarVerificationNotice: "OTP will be sent to the mobile linked to your Aadhaar card.",
    otpLabel: "Enter 6-Digit OTP received on Aadhaar-linked Mobile *",
    btnGetOtp: "Get OTP",
    btnVerifyOtp: "Verify and Login",
    aadhaarVerifiedBadge: "Aadhaar Verified Successfully",
    firstTimeReporting: "First time reporting?",
    reportDirectly: "Report issue directly without login",
    academiaNote: "College students & teachers log in with college emails.",
    institutionalEmail: "College Email (.ac.in / .edu)",
    password: "Password",
    btnAcademiaLogin: "Login to College Portal",
    csrNote: "Companies sign in to provide funds for projects.",
    csrEmail: "Company Email",
    btnCsrLogin: "Login to Company Portal",
    officerNote: "Government officers login.",
    govEmail: "Official Email ID",
    egovPin: "Password",
    btnOfficerLogin: "Officer Login",

    // Statistics Section
    statsTag: "LIVE UPDATES",
    statsTitle: "ProblemSetu Impact",
    statGrievances: "Problems Reported",
    statGrievancesSub: "From across villages",
    statPrototypes: "Solutions in Progress",
    statPrototypesSub: "Currently being built",
    statCsrFunds: "Funds Provided",
    statCsrFundsSub: "Money given for projects",
    statResolutions: "Problems Solved",
    statResolutionsSub: "Verified by citizens",

    // 4-Pillar Workflow
    workflowTag: "HOW IT WORKS",
    workflowTitle: "From Reporting to Resolution",
    workflowSub: "Instead of letting complaints sit around, we turn real problems into college projects that get built.",
    step1Title: "1. Report the Problem",
    step1Desc: "Citizens report problems using Aadhaar for proof, adding location, photos, and voice notes.",
    step2Title: "2. College Assignment",
    step2Desc: "Problems are sent to engineering colleges where student teams design solutions.",
    step3Title: "3. Project Funding",
    step3Desc: "Companies review the material costs and provide money to build the solution.",
    step4Title: "4. Final Approval",
    step4Desc: "The problem is only marked solved when the citizen takes a photo of the working solution.",

    // Featured section
    fieldDemonstratorsTag: "RECENT SUCCESSES",
    featuredTitle: "Recent Solutions to Local Problems",
    viewAllDistricts: "View All Areas",
    viewLifecycle: "View Details",

    // Banner CTA
    ctaTitle: "Are you a College or a Company?",
    ctaSub: "Join ProblemSetu to provide funds or build solutions.",
    btnBrowseProposals: "Browse Projects",
    btnPolicyGuide: "Read Guidelines",

    // Footer
    footerAboutTitle: "ABOUT PROBLEMSETU",
    footerAboutDesc: "ProblemSetu connects local problems with college students who build solutions, funded by companies.",
    footerFrameworkTitle: "RULES & GUIDELINES",
    footerEcosystemTitle: "OTHER LINKS",
    footerHelpTitle: "HELP & SUPPORT",
    footerTollFree: "Toll-Free Helpline:",
    footerDesk: "Help Desk:",
    footerAddress: "ProblemSetu Center",
    footerCopyright: "ProblemSetu Platform.",
    footerTerms: "Terms of Use • Privacy Policy"
  },
  hi: {
    // Top Bar
    topBarTag: "समस्या सेतु | सहायता केंद्र",
    topBarSub: "आपकी समस्याओं का समाधान",
    skipContent: "मुख्य सामग्री पर जाएं",
    tollFree: "टोल फ्री: 1800-345-6570",
    portalName: "समस्या सेतु (ProblemSetu)",
    portalHindiName: "प्रॉब्लम सेतु",
    portalTagline: "आपकी समस्याओं का समाधान",
    portalSubtitle: "समस्या से समाधान तक",

    // Navbar
    personaSwitcher: "यूजर चुनें:",
    personaHint: "यह देखने के लिए अपनी भूमिका चुनें कि साइट आपके लिए कैसे काम करती है:",
    role: "भूमिका:",
    rolePublic: "अतिथि",
    roleCitizen: "नागरिक",
    roleUniversity: "कॉलेज / विश्वविद्यालय",
    roleCsr: "कंपनी",
    home: "मुख्य पृष्ठ",
    reportIssue: "समस्या बताएं",
    leaderboard: "रैंकिंग",
    policy: "नियम",
    myGrievances: "मेरी समस्याएं",
    verifyResolution: "समाधान जांचें",
    routedProblems: "मिली हुई समस्याएं",
    proposals: "प्रोजेक्ट्स",
    marketplace: "प्रोजेक्ट्स देखें",
    escrowProjects: "फंड किए गए प्रोजेक्ट्स",
    scaleUp: "सामग्री का खर्च",
    loginRegister: "लॉगिन / रजिस्टर",
    signOut: "लॉग आउट",
    loggedInAs: "लॉगिन:",

    // Ticker & Hero
    announcementBadge: "सूचना",
    announcementText: "समस्या सेतु: छात्र समस्याओं को सुलझाने के लिए काम करते हैं • प्रोजेक्ट्स के लिए फंड दिए जाते हैं • समस्या सुलझने का प्रमाण जरूरी है।",
    heroBadge: "समस्या समाधान मंच",
    heroTitle: "आपकी समस्याओं को कॉलेज प्रोजेक्ट्स में बदलना",
    heroSubtitle: "एक ऐसी जगह जहाँ नागरिक अपनी समस्या बता सकते हैं, कॉलेज के छात्र समाधान बना सकते हैं और कंपनियाँ मदद दे सकती हैं।",
    btnLodge: "समस्या बताएं",
    btnExplore: "यह कैसे काम करता है",
    btnRankings: "रैंकिंग देखें",

    // Track Status Box
    trackTitle: "समस्या की स्थिति जांचें",
    trackSubtitle: "समस्या सेतु ट्रैकर",
    trackPlaceholder: "नंबर दर्ज करें (उदा. JH-SOC-2026-1042)",
    btnCheckStatus: "स्थिति जांचें",
    assignedInstitution: "इन्हें सौंपा गया:",
    viewTimeline: "पूरी जानकारी देखें",
    noGrievanceFound: "इस नंबर से कोई समस्या नहीं मिली:",
    verifyCode: "कृपया अपना नंबर जांचें।",

    // Login Widget
    ssoTitle: "समस्या सेतु लॉगिन",
    ssoSubtitle: "अपने खाते में लॉगिन करें",
    tabCitizen: "नागरिक (आधार)",
    tabAcademia: "कॉलेज",
    tabCsr: "कंपनी",
    tabOfficer: "अधिकारी",
    citizenNote: "नागरिक अपनी पहचान के लिए 12-अंकीय आधार और उससे जुड़े मोबाइल नंबर से लॉगिन करते हैं।",
    aadhaarLabel: "आधार कार्ड नंबर (12 अंक) *",
    aadhaarPlaceholder: "1234 5678 9012",
    mobileLabel: "मोबाइल नंबर (आधार से जुड़ा हुआ) *",
    mobilePlaceholder: "9835100000",
    aadhaarVerificationNotice: "आपके आधार से जुड़े मोबाइल नंबर पर ओटीपी (OTP) भेजा जाएगा।",
    otpLabel: "आधार वाले मोबाइल पर मिला 6 अंकों का ओटीपी (OTP) दर्ज करें *",
    btnGetOtp: "ओटीपी (OTP) पाएं",
    btnVerifyOtp: "जांचें और लॉगिन करें",
    aadhaarVerifiedBadge: "आधार की जांच सफल रही",
    firstTimeReporting: "पहली बार समस्या बता रहे हैं?",
    reportDirectly: "बिना लॉगिन के सीधे समस्या बताएं",
    academiaNote: "कॉलेज के छात्र और शिक्षक अपने कॉलेज ईमेल से लॉगिन करें।",
    institutionalEmail: "कॉलेज ईमेल (.ac.in / .edu)",
    password: "पासवर्ड",
    btnAcademiaLogin: "कॉलेज पोर्टल में लॉगिन करें",
    csrNote: "कंपनियाँ प्रोजेक्ट्स के लिए फंड देने के लिए लॉगिन करें।",
    csrEmail: "कंपनी का ईमेल",
    btnCsrLogin: "कंपनी पोर्टल में लॉगिन करें",
    officerNote: "सरकारी अधिकारी यहाँ लॉगिन करें।",
    govEmail: "सरकारी ईमेल आईडी",
    egovPin: "पासवर्ड",
    btnOfficerLogin: "अधिकारी लॉगिन",

    // Statistics Section
    statsTag: "लाइव अपडेट्स",
    statsTitle: "समस्या सेतु का प्रभाव",
    statGrievances: "बताई गई समस्याएं",
    statGrievancesSub: "गांवों से",
    statPrototypes: "समाधान बन रहे हैं",
    statPrototypesSub: "निर्माण कार्य जारी है",
    statCsrFunds: "फंड दिए गए",
    statCsrFundsSub: "प्रोजेक्ट्स के लिए पैसे दिए गए",
    statResolutions: "समस्याएं सुलझीं",
    statResolutionsSub: "नागरिकों द्वारा जांची गईं",

    // 4-Pillar Workflow
    workflowTag: "यह कैसे काम करता है",
    workflowTitle: "समस्या बताने से समाधान तक",
    workflowSub: "हम आपकी समस्याओं को सिर्फ दर्ज नहीं करते, बल्कि उन्हें सुलझाने के लिए कॉलेज के छात्रों को सौंपते हैं।",
    step1Title: "1. समस्या बताएं",
    step1Desc: "नागरिक आधार, लोकेशन, फोटो और आवाज के जरिए अपनी समस्या बताते हैं।",
    step2Title: "2. कॉलेज को सौंपना",
    step2Desc: "समस्याएं इंजीनियरिंग कॉलेजों को भेजी जाती हैं जहाँ छात्र समाधान बनाते हैं।",
    step3Title: "3. प्रोजेक्ट के लिए फंड",
    step3Desc: "कंपनियाँ सामान का खर्च देखकर समाधान बनाने के लिए पैसे देती हैं।",
    step4Title: "4. अंतिम मंजूरी",
    step4Desc: "समस्या तभी सुलझी हुई मानी जाती है जब नागरिक काम करते हुए समाधान की फोटो डालता है।",

    // Featured section
    fieldDemonstratorsTag: "हाल की सफलताएं",
    featuredTitle: "स्थानीय समस्याओं के हाल के समाधान",
    viewAllDistricts: "सभी जगहें देखें",
    viewLifecycle: "जानकारी देखें",

    // Banner CTA
    ctaTitle: "क्या आप कॉलेज या कंपनी हैं?",
    ctaSub: "फंड देने या समाधान बनाने के लिए समस्या सेतु से जुड़ें।",
    btnBrowseProposals: "प्रोजेक्ट्स देखें",
    btnPolicyGuide: "नियम पढ़ें",

    // Footer
    footerAboutTitle: "समस्या सेतु के बारे में",
    footerAboutDesc: "समस्या सेतु आपकी समस्याओं को कॉलेज के छात्रों से जोड़ता है जो कंपनियों के फंड से समाधान बनाते हैं।",
    footerFrameworkTitle: "नियम और शर्तें",
    footerEcosystemTitle: "अन्य लिंक",
    footerHelpTitle: "मदद और सहायता",
    footerTollFree: "टोल-फ्री हेल्पलाइन:",
    footerDesk: "सहायता डेस्क:",
    footerAddress: "समस्या सेतु केंद्र",
    footerCopyright: "समस्या सेतु मंच।",
    footerTerms: "उपयोग की शर्तें • गोपनीयता नीति"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("problemsetu_lang") as Language;
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      try {
        localStorage.setItem("problemsetu_lang", lang);
      } catch {
        // ignore
      }
    }
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    const currentDict = DICTIONARY[language];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    const enDict = DICTIONARY.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
