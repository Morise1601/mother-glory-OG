import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { ArrowRight, Phone, MapPin, Sparkles, CheckCircle2, Clock } from "lucide-react";

export default async function AdmissionsCta() {
  const settings = await getSiteSettings();
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF8F3] to-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#122452] to-[#1a3370] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#DFE3EA]/30 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B68A35]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1a3370]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#B68A35]/20 border border-[#B68A35]/40 text-[#B68A35] text-xs font-bold tracking-wider capitalize">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings.announcementNotice || "Contact our admissions team"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Ready to take the next step towards your medical career?
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with our academic counsellors in Puducherry or Karaikal to discuss batch schedules, syllabus coverage, and your personalized NEET preparation path.
              </p>

              {/* Trust Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-200 text-left">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[8px] p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0" />
                  <span className="font-medium">1-on-1 Faculty Mentorship</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[8px] p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0" />
                  <span className="font-medium">Daily Doubt Resolution</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[8px] p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0" />
                  <span className="font-medium">OMR Test Series</span>
                </div>
              </div>
            </div>

            {/* Right Action Deck (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-[8px] p-6 sm:p-7 border border-white/15 space-y-5 shadow-inner">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[#B68A35] font-bold capitalize tracking-wider block">
                    Direct Admissions Support
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-1">
                    Book a Free Academic Counselling Session
                  </h3>
                </div>

                {/* Primary Button */}
                <Link
                  href="/contact"
                  className="w-full py-3.5 px-6 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Enquire Online Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Direct Dial Campus Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/15">
                  <a
                    href={"tel:" + (settings.contactPhones?.[0] || "+919842823195").replace(/[^+0-9]/g, "")}
                    className="flex flex-col p-3 rounded-[8px] bg-white/5 hover:bg-white/15 border border-white/10 transition-colors group"
                  >
                    <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B68A35]" />
                      Puducherry Centre
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B68A35] transition-colors mt-0.5">
                      {settings.contactPhones?.[0] || "+91 98428 23195"}
                    </span>
                  </a>

                  <a
                    href={"tel:" + (settings.contactPhones?.[1] || "+919894423195").replace(/[^+0-9]/g, "")}
                    className="flex flex-col p-3 rounded-[8px] bg-white/5 hover:bg-white/15 border border-white/10 transition-colors group"
                  >
                    <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B68A35]" />
                      Karaikal Centre
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B68A35] transition-colors mt-0.5">
                      {settings.contactPhones?.[1] || "+91 98944 23195"}
                    </span>
                  </a>
                </div>

                {/* Timings Note */}
                <p className="text-[11px] text-slate-300 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Clock className="w-3 h-3 text-[#B68A35]" />
                  <span>Mon–Sat: 8:00 AM – 5:00 PM IST • Walk-in consults welcome</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
