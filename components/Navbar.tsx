"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About Us", href: "/#about" },
  { name: "Founder", href: "/#founder" },
  { name: "Features", href: "/#features" },
  { name: "Gallery", href: "/#gallery", isNew: true },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "glass-nav py-3 shadow-lg shadow-[#122452]/10 border-b border-[#122452]/15 dark:border-slate-800"
        : "bg-transparent py-4 sm:py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo Container - Perfectly Proportioned */}
          <Link
            href="/#home"
            className="flex items-center flex-shrink-0 group focus:outline-none rounded-lg py-1 transition-transform duration-300 hover:scale-105"
            aria-label="Mother Glory Home"
          >
            <div className="relative h-20 w-20">
              <Image
                src="/images/logo_mg.png"
                alt="Mother Glory Logo"
                fill
                priority
                sizes="80px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - XL screens only (1280px+) to guarantee 0 overflow */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#122452]/5 dark:bg-slate-900/90 p-1.5 rounded-lg border border-[#122452]/20 dark:border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs xl:text-sm font-normal text-[#122452] dark:text-slate-100 hover:text-white hover:bg-[#122452] transition-all duration-300 rounded-lg flex items-center gap-1.5 whitespace-nowrap shadow-xs hover:shadow-md"
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* CTA & Phone Actions - Responsive */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <a
              href="tel:+919842823195"
              className="hidden md:flex items-center gap-2 text-xs lg:text-sm font-normal text-[#122452] dark:text-slate-200 hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              <div className="p-2 rounded-lg bg-[#122452] text-white shadow-sm">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="hidden xl:inline">+91 98428 23195</span>
            </a>

            <Link
              href="/#contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#122452] hover:bg-[#1b3260] rounded-lg shadow-md shadow-[#122452]/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-white/20 whitespace-nowrap"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* Mobile & Tablet Drawer Trigger Button (Visible on screens < 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 sm:p-3 rounded-lg bg-[#122452] text-white hover:bg-[#1b3260] transition-colors focus:outline-none shadow-md font-medium"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-t border-[#122452]/20 dark:border-slate-800 mt-3 py-6 px-6 shadow-2xl animate-in slide-in-from-top duration-300 rounded-lg">
          <div className="flex flex-col gap-2.5 max-w-lg mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-base font-normal text-[#122452] dark:text-slate-100 hover:bg-[#122452] hover:text-white transition-colors"
              >
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 text-base font-medium text-white bg-[#122452] rounded-lg shadow-lg"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
