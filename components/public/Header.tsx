"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "./SiteSettingsProvider";
import { Menu, X, Phone, ArrowRight, MapPin } from "lucide-react";

interface HeaderProps {
  onOpenEnquiry?: (program?: string) => void;
  announcement?: string;
}

export default function Header({ onOpenEnquiry, announcement }: HeaderProps) {
  const settings = useSiteSettings();
  announcement = settings.showAnnouncement ? (announcement ?? settings.announcementNotice) : undefined;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Achievements", href: "/achievements" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* 1. Optional Admissions Notice Strip */}
      {announcement && (
        <aside
          aria-label="Admissions Announcement"
          className="bg-[#122452] text-white text-xs sm:text-sm py-2 px-4 border-b border-[#1b3260]"
        >
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <p className="flex items-center gap-2 truncate font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#B68A35] animate-pulse shrink-0" />
              <span className="truncate">{announcement}</span>
            </p>
            <div className="hidden md:flex items-center gap-4 shrink-0 text-xs text-slate-300">
              <a
                href={"tel:" + (settings.contactPhones?.[0] || "+919842823195").replace(/[^+0-9]/g, "")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
                aria-label="Call Puducherry Centre"
              >
                <Phone className="w-3.5 h-3.5 text-[#B68A35]" />
                <span>Puducherry: {settings.contactPhones?.[0] || "+91 98428 23195"}</span>
              </a>
              <span className="text-slate-500">|</span>
              <a
                href={"tel:" + (settings.contactPhones?.[1] || "+919894423195").replace(/[^+0-9]/g, "")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
                aria-label="Call Karaikal Centre"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
                <span>Karaikal: {settings.contactPhones?.[1] || "+91 98944 23195"}</span>
              </a>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Main Public Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled
          ? "bg-[#FAF8F3]/95 backdrop-blur-md shadow-sm border-b border-[#DFE3EA] py-2.5"
          : "bg-[#FAF8F3] border-b border-[#DFE3EA] py-3.5"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Identity */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Mother Glory Coaching & Tutorial Centre Home"
            >
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-[8px] p-1 shadow-xs border border-[#DFE3EA] flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo_mg.webp"
                  alt="Mother Glory Logo"
                  width={48}
                  height={48}
                  priority
                  loading="eager"
                  className="object-contain h-full w-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-base sm:text-lg text-[#122452] leading-tight tracking-tight group-hover:text-[#B68A35] transition-colors ">
                  {settings.institutionName}
                </span>
                {/* <span className="text-[11px] sm:text-xs font-semibold text-[#596579] tracking-wide uppercase whitespace-nowrap">
                  {settings.tagline}
                </span> */}
                <span className="hidden xl:inline-block text-[10px] text-[#B68A35] font-medium tracking-wider whitespace-nowrap">
                  NEET INSTITUTE • PUDUCHERRY & KARAIKAL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Visible on lg 1024px+ where ample space is guaranteed) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${isActive
                      ? "text-[#122452] font-semibold bg-white shadow-xs border border-[#DFE3EA]"
                      : "text-[#596579] hover:text-[#122452] hover:bg-white/60"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTA & Tablet/Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {onOpenEnquiry ? (
                <button
                  type="button"
                  onClick={() => onOpenEnquiry()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Tablet & Mobile menu trigger (< 1024px) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#122452] hover:bg-white border border-[#DFE3EA] focus:outline-none transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DFE3EA] bg-[#FAF8F3] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "text-[#122452] font-semibold bg-white border border-[#DFE3EA]"
                      : "text-[#596579] hover:bg-white/60 hover:text-[#122452]"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#B68A35] text-white font-semibold text-sm shadow-xs"
                >
                  <span>Enquire for Admissions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DFE3EA] text-xs text-[#596579]">
                  <a
                    href={"tel:" + (settings.contactPhones?.[0] || "+919842823195").replace(/[^+0-9]/g, "")}
                    className="p-2 rounded-lg bg-white border border-[#DFE3EA] text-center font-medium hover:text-[#122452]"
                  >
                    Call Puducherry
                  </a>
                  <a
                    href={"tel:" + (settings.contactPhones?.[1] || "+919894423195").replace(/[^+0-9]/g, "")}
                    className="p-2 rounded-lg bg-white border border-[#DFE3EA] text-center font-medium hover:text-[#122452]"
                  >
                    Call Karaikal
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

