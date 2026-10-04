"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Trophy,
  FilePlus,
  CheckCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { store, UserRole } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [role, setRole] = useState<UserRole>("public");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole(store.getRole());
    const unsubscribe = store.subscribe(() => {
      setRole(store.getRole());
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === "public") {
      store.signOut();
      setRole("public");
      router.push("/");
    } else {
      store.setRole(newRole);
      setRole(newRole);
      if (newRole === "citizen") router.push("/citizen/dashboard");
      else router.push("/");
    }
  };

  // Dynamic Navigation Links based on active persona
  const getNavLinks = () => {
    switch (role) {
      case "citizen":
        return [
          { href: "/citizen/dashboard", label: t("myGrievances"), icon: LayoutDashboard },
          { href: "/citizen/report-issue", label: t("reportIssue"), icon: FilePlus },
          { href: "/citizen/verify-resolution", label: t("verifyResolution"), icon: CheckCircle },
          { href: "/analytics/leaderboard", label: t("leaderboard"), icon: Trophy },
          { href: "/about", label: t("policy"), icon: BookOpen },
        ];

      case "public":
      default:
        return [
          { href: "/", label: t("home"), icon: Home },
          { href: "/about", label: t("policy"), icon: BookOpen },
          { href: "/analytics/leaderboard", label: t("leaderboard"), icon: Trophy },
          { href: "/login?redirect=/citizen/report-issue", label: t("reportIssue"), icon: FilePlus },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="w-full bg-[#1b365d] shadow-md sticky top-0 z-50">

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4" aria-label="Main Navigation">
        <div className="flex items-center justify-between h-13">
          {/* Left: Role Indicator Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white font-medium bg-white/10 px-2.5 py-1 rounded border border-white/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-gray-300">Role:</span>
              <span className="uppercase font-bold tracking-wider text-amber-300">
                {role === "public" ? "GUEST" : "CITIZEN"}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs md:text-sm font-medium transition ${
                    isActive
                      ? "bg-[#e87722] text-white font-semibold shadow-xs"
                      : "text-gray-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action / Auth Button */}
          <div className="hidden sm:flex items-center gap-3">
            {role === "public" ? (
              <Link
                href="/login"
                className="gov-btn-accent text-xs py-1.5 px-3 rounded flex items-center gap-1.5 shadow-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t("loginRegister")}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300 hidden xl:inline">
                  {t("loggedInAs")} <strong className="text-white">{role.toUpperCase()}</strong>
                </span>
                <button
                  onClick={() => handleRoleChange("public")}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-300" />
                  <span>{t("signOut")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="text-gray-200 hover:text-white p-2 rounded-md focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-900/60 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                    isActive ? "bg-[#e87722] text-white" : "text-gray-100 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-blue-900/40">
              {role === "public" ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full gov-btn-accent text-xs py-2 text-center block"
                >
                  {t("loginRegister")}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleRoleChange("public");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-800 text-white text-xs py-2 rounded text-center block cursor-pointer"
                >
                  {t("signOut")}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
