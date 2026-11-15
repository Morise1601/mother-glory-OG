"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export default function Footer() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#070e1e] text-slate-300 pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Footer Grid for Desktop / Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-slate-800/80">

            {/* Col 1: Brand Info */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative h-11 w-11 flex-shrink-0">
                  <Image
                    src="/images/logo_mg.webp"
                    alt="Mother Glory NEET Academy Logo"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-sora font-extrabold text-white text-base tracking-tight block leading-none">
                    MOTHER GLORY
                  </span>
                  <span className="font-sora font-bold text-red-500 text-sm tracking-wider block leading-none mt-1">
                    NEET ACADEMY
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Guiding passionate learners to become compassionate doctors and responsible citizens since 2008.
              </p>

              {/* Social Icons for desktop */}
              <div className="flex items-center gap-3 pt-1">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/mothergloryneetacademykaraikal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/mother_glory_official?igsh=aTVuOWNueXNqd2h6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-sora font-semibold text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-red-400 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
                <li><Link href="/programmes" className="hover:text-red-400 transition-colors">Courses</Link></li>
                <li><Link href="/testimonials" className="hover:text-red-400 transition-colors">Results</Link></li>
              </ul>
            </div>

            {/* Col 3: Explore */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-sora font-semibold text-white uppercase tracking-wider">
                Explore
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/gallery" className="hover:text-red-400 transition-colors">Campus</Link></li>
                <li><Link href="/gallery" className="hover:text-red-400 transition-colors">Gallery</Link></li>
                <li><Link href="/about" className="hover:text-red-400 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Col 4: Our Courses */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-sora font-semibold text-white uppercase tracking-wider">
                Our Courses
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/programmes" className="hover:text-red-400 transition-colors">NEET Foundation</Link></li>
                <li><Link href="/programmes" className="hover:text-red-400 transition-colors">NEET Crash Course</Link></li>
                <li><Link href="/programmes" className="hover:text-red-400 transition-colors">NEET Test Series</Link></li>
                <li><Link href="/programmes" className="hover:text-red-400 transition-colors">Repeater Program</Link></li>
              </ul>
            </div>

            {/* Col 5: Contact Us & CTA */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-sora font-semibold text-white uppercase tracking-wider">
                Contact Us
              </h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="tel:+919789043210" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span>+91 97890 43210</span>
                </a>
                <a href="mailto:info@mothergloryneet.in" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="truncate">info@mothergloryneet.in</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Pondicherry | Karaikal</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full py-2 px-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 cursor-pointer"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar matching design: Script Motto, Copyright, Socials */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">

            {/* Script Motto */}
            <div className="font-outfit italic text-base sm:text-lg text-slate-300 font-semibold tracking-wide order-2 md:order-1">
              Dream • Prepare • Achieve • Become a Doctor
            </div>

            {/* Copyright */}
            <div className="text-center md:text-left order-1 md:order-2">
              © 2025 Mother Glory NEET Academy. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-slate-400 order-3">
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
            </div>

          </div>

        </div>
      </footer>

      {/* Global Enquiry Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
