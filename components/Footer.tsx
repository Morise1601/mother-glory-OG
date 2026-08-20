"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionClick = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (targetId === "home") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/?section=${targetId}`;
    }
  };

  return (
    <footer className="bg-[#060a12] text-slate-400 border-t border-slate-800 pt-10 pb-8 sm:pt-16 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-slate-800">

          {/* Col 1: Brand Info with Prominent Enlarged Logo */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <a
              href="/"
              onClick={(e) => handleSectionClick("home", e)}
              className="inline-block focus:outline-none transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-16 w-56 sm:h-24 sm:w-80">
                <Image
                  src="/images/logo_mg.png"
                  alt="Mother Glory Coaching & Tutorial Centre Logo"
                  fill
                  sizes="(max-width: 640px) 224px, 320px"
                  className="object-contain object-left"
                />
              </div>
            </a>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              Mother Glory Coaching &amp; Tutorial Centre is the leading entrance coaching institute in Puducherry &amp; Karaikal, turning medical aspirants&apos; dreams into reality through 16+ years of academic excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/mothergloryneetacademykaraikal"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#122452] border border-white/20 flex items-center justify-center text-white hover:bg-[#1b3260] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mother_glory_official?igsh=aTVuOWNueXNqd2h6"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#122452] border border-white/20 flex items-center justify-center text-white hover:bg-[#1b3260] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-sora font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm font-normal">
              <li><a href="#home" onClick={(e) => handleSectionClick("home", e)} className="hover:text-white transition-colors cursor-pointer">Home</a></li>
              <li><a href="#about" onClick={(e) => handleSectionClick("about", e)} className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
              <li><a href="#founder" onClick={(e) => handleSectionClick("founder", e)} className="hover:text-white transition-colors cursor-pointer">Founder&apos;s Vision</a></li>
              <li><a href="#features" onClick={(e) => handleSectionClick("features", e)} className="hover:text-white transition-colors cursor-pointer">Features &amp; Campus</a></li>
              <li><a href="#gallery" onClick={(e) => handleSectionClick("gallery", e)} className="hover:text-white transition-colors cursor-pointer">Gallery Slider</a></li>
              <li><a href="#testimonials" onClick={(e) => handleSectionClick("testimonials", e)} className="hover:text-white transition-colors cursor-pointer">Testimonials</a></li>
              <li><a href="#faq" onClick={(e) => handleSectionClick("faq", e)} className="hover:text-white transition-colors cursor-pointer">FAQs</a></li>
              <li><a href="#contact" onClick={(e) => handleSectionClick("contact", e)} className="hover:text-white transition-colors cursor-pointer">Contact Admissions</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-sora font-semibold text-white uppercase tracking-wider">Legal & Policies</h3>
            <ul className="space-y-2 text-xs sm:text-sm font-normal">
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors flex items-center gap-1">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-1">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-sora font-semibold text-white uppercase tracking-wider">Newsletter</h3>
            <p className="text-xs text-slate-300 font-normal">
              Subscribe to stay updated with campus news, admission notices, and events.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 sm:py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#122452] font-normal"
              />
              <button
                type="submit"
                className="w-full py-2 sm:py-2.5 rounded-lg bg-[#122452] text-white font-medium text-xs hover:bg-[#1b3260] transition-colors border border-white/20"
              >
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits & Legal Links & Back to top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <p className="text-slate-400 text-center sm:text-left font-normal" suppressHydrationWarning>
            © {currentYear}&nbsp; Mother Glory Coaching &amp; Tutorial Centre. All Rights Reserved. Designed for Excellence.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/terms-and-conditions" className="text-slate-400 hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium rounded-lg px-2 py-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
