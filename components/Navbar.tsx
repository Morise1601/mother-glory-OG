"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowRight, Search } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programmes", href: "/programmes" },
  { name: "Results", href: "/testimonials" },
  { name: "Campus", href: "/gallery" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/about" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuOpen = mobileMenuPath === pathname;
  const setMobileMenuOpen = (open: boolean) => setMobileMenuPath(open ? pathname : null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md shadow-slate-900/5 py-2.5 border-b border-slate-100"
          : "bg-white py-3.5 border-b border-slate-100"
          }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Logo matching exact design */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 group focus:outline-none"
              aria-label="Mother Glory NEET Academy Home"
            >
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0">
                <Image
                  src="/images/logo_mg.webp"
                  alt="Mother Glory NEET Academy Logo"
                  fill
                  priority
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-sora font-extrabold text-[#122452] text-sm sm:text-base tracking-tight leading-none">
                    MOTHER GLORY
                  </span>
                </div>
                <span className="font-sora font-bold text-red-600 text-sm tracking-wider leading-none mt-0.5">
                  NEET ACADEMY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5 lg:gap-6">
              {navLinks.slice(0, 8).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-all relative py-1 ${isActive
                      ? "text-red-600 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600 after:rounded-full"
                      : "text-slate-700 hover:text-red-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {/* Contact Link */}
              <Link
                href="/contact"
                className={`text-sm font-medium transition-all relative py-1 ${pathname === "/contact"
                  ? "text-red-600 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600 after:rounded-full"
                  : "text-slate-700 hover:text-red-600"
                  }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right side actions: Search & Enquire Now button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-slate-600 hover:text-red-600 hover:bg-slate-50 transition-colors focus:outline-none"
                aria-label="Search academy programs and courses"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setEnquiryOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-full shadow-md shadow-red-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Drawer Trigger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-800 hover:text-red-600 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

          {/* Quick Search Dropdown Bar */}
          {searchOpen && (
            <div className="py-2 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search NEET Courses, Syllabus, Results, Branches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-100 px-4 py-4 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1 max-w-md mx-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? "bg-red-50 text-red-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-red-600"
                      }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                  </Link>
                );
              })}

              <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="tel:+919789043210"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-[#122452] bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>Call Us: +91 97890 43210</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setEnquiryOpen(true);
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-md cursor-pointer"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Enquiry Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
