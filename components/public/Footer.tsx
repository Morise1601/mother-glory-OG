import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { getCampuses } from "@/lib/data/campuses";
import { Phone, Mail, Clock, MapPin, Award, CheckCircle2 } from "lucide-react";

export default async function Footer() {
  const [settings, campuses] = await Promise.all([getSiteSettings(), getCampuses()]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#122452] text-white border-t border-[#1b3260]">
      {/* Upper Footer: Campuses & Quick Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-12 w-12 bg-white rounded-[8px] p-1 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo_mg.webp"
                  alt="Mother Glory Coaching & Tutorial Centre Seal"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white block leading-tight">
                  {settings.institutionName}
                </span>
                <span className="text-[11px] text-[#B68A35] font-medium block">
                  NEET Institute • Puducherry & Karaikal
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed">
              Dedicated coaching and guidance for NEET medical entrance examinations. Guided by experienced mentors, conceptual clarity, and disciplined preparation in Puducherry and Karaikal.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
              <Award className="w-4 h-4 text-[#B68A35] shrink-0" />
              <span>Over a decade and a half of medical coaching guidance</span>
            </div>
          </div>

          {campuses.map(campus => (
            <div key={campus.id} className="lg:col-span-3 space-y-3">
              <h3 className="font-serif font-bold text-base text-white tracking-wide flex items-center gap-2"><MapPin className="w-4 h-4 text-[#B68A35]" /><span>{campus.name}</span></h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{campus.address}, {campus.city}, {campus.state} ? {campus.postalCode}</p>
              <div className="space-y-1.5 pt-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-slate-300"><Phone className="w-3.5 h-3.5 text-[#B68A35]" /><a href={"tel:" + campus.phone.replace(/[^+0-9]/g, "")} className="hover:text-white transition-colors">{campus.phone}</a></div>
                <div className="flex items-center gap-2 text-slate-300"><Mail className="w-3.5 h-3.5 text-[#B68A35]" /><a href={"mailto:" + settings.contactEmail} className="hover:text-white transition-colors">{settings.contactEmail}</a></div>
                <div className="flex items-center gap-2 text-slate-300"><Clock className="w-3.5 h-3.5 text-[#B68A35]" /><span>{settings.workingHours}</span></div>
              </div>
            </div>
          ))}

          {/* Col 4: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif font-bold text-base text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  NEET Programs
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Admissions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright & Legal */}
      <div className="border-t border-[#1b3260] bg-[#0c1836] py-5 px-4 text-xs text-slate-400">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-4 sm:px-6 lg:px-8">
          <p>
            © {currentYear} {settings.institutionName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

