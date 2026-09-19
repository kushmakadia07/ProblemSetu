import type { Metadata } from "next";
import "./globals.css";
import GovTopBar from "@/components/layout/GovTopBar";
import Navbar from "@/components/layout/Navbar";
import GovFooter from "@/components/layout/GovFooter";
import { LanguageProvider } from "@/lib/language";

export const metadata: Metadata = {
  title: "ProblemSetu | Connecting Problems to Solutions",
  description:
    "ProblemSetu: Collaborative ecosystem connecting rural citizens, university engineering students, and corporate CSR partners for grassroots community problem-solving and NEP 2020 experiential credits.",
  keywords: [
    "ProblemSetu",
    "Grassroots Innovation",
    "Rural Innovation",
    "CSR Escrow Funding",
    "University Engineering",
    "Proof of Person",
    "Community Grievance"
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f4f5f7] text-[#1f2937]">
        <LanguageProvider>
          <GovTopBar />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <GovFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
