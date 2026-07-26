import Image from "next/image";
import { Quote, Sparkles, HeartHandshake, BookOpen, GraduationCap, Award } from "lucide-react";

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#122452] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1e3a8a] rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Badge & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-medium uppercase tracking-wider border border-white/20 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Leadership &amp; Heritage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight text-white">
            The Vision Behind <span className="text-white">Mother Glory</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Meet our visionary Founders whose exceptional academic qualifications, dedicated leadership, and moral values laid the cornerstone of our institution.
          </p>
        </div>

        {/* Founders Showcase Grid (Side-by-Side Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">

          {/* 1. Founder Card */}
          <div className="relative group flex flex-col h-full">
            <div className="relative rounded-lg overflow-hidden p-4 shadow-2xl border-2 border-[#1e293b] bg-[#0c1427] transition-all duration-500 hover:border-blue-500/60 flex flex-col justify-between h-full">

              {/* Photo Showcase */}
              <div className="relative h-[380px] sm:h-[440px] w-full rounded-lg overflow-hidden mb-5 bg-[#060a12]">
                <Image
                  src="/images/founder-final.jpeg"
                  alt="M. Antoine@Prabhu - Founder & Managing Director"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-transparent opacity-85" />

                {/* Floating Role Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#122452] text-amber-300 text-xs font-semibold border border-amber-400/40 shadow-xl">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    Founder &amp; Managing Director
                  </span>
                </div>
              </div>

              {/* Structured Info Block Below Photo */}
              <div className="space-y-3 px-2 pb-2">
                <div>
                  <h3 className="text-2xl font-sora font-semibold text-white tracking-tight">
                    M. Antoine@Prabhu
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-300 font-mono font-semibold">
                    <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>M.Sc., B.Ed., M.Phil (Maths)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Co-Founder / Chairman Card */}
          <div className="relative group flex flex-col h-full">
            <div className="relative rounded-lg overflow-hidden p-4 shadow-2xl border-2 border-[#1e293b] bg-[#0c1427] transition-all duration-500 hover:border-blue-500/60 flex flex-col justify-between h-full">

              {/* Photo Showcase */}
              <div className="relative h-[380px] sm:h-[440px] w-full rounded-lg overflow-hidden mb-5 bg-[#060a12]">
                <Image
                  src="/images/cofounder-final.png"
                  alt="Mr. Robert Clyive - Chairman & Managing Trustee"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-transparent opacity-85" />

                {/* Floating Role Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#122452] text-amber-300 text-xs font-semibold border border-amber-400/40 shadow-xl">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    Chairman &amp; Managing Trustee
                  </span>
                </div>
              </div>

              {/* Structured Info Block Below Photo */}
              <div className="space-y-3 px-2 pb-2">
                <div>
                  <h3 className="text-2xl font-sora font-semibold text-white tracking-tight">
                    Mr. Robert Clyive
                  </h3>
                  <div className="flex items-start gap-1.5 mt-2 text-xs text-sky-300 font-mono font-semibold leading-relaxed">
                    <GraduationCap className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>MSW (Medical &amp; Psychiatry), M.Com., M.A. English, DHRM (Australia)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Unified Founders' Message */}
        <div className="mb-12">
          <div className="relative p-8 sm:p-10 rounded-lg bg-[#122452] border border-white/20 shadow-2xl space-y-4">
            <Quote className="w-10 h-10 text-white opacity-80" />
            <p className="text-lg sm:text-xl text-white font-normal leading-relaxed italic">
              &quot;Mother Glory NEET Academy is the best and leading institute in Puducherry &amp; Karaikal. We are the pioneer institution training students to face all competitive entrance exams. In the span of 16 years, more than 3,000+ students have cleared their eligibility marks and more than 1,000+ students secured medical courses. With God&apos;s grace and our glorious Mother Mary&apos;s blessings, many students&apos; dreams have come true and have secured seats in leading institutions like JIPMER, AIIMS, CMC, etc. We sincerely thank our team of Faculties, Teachers, Students &amp; Parents for their valuable support.&quot;
            </p>
            <div className="pt-4 flex items-center justify-between border-t border-white/20 mt-4">
              <span className="text-sm font-semibold text-white">— M. Antoine@Prabhu &amp; Mr. Robert Clyive</span>
              <span className="text-xs text-slate-300 font-mono">Founders&apos; Message</span>
            </div>
          </div>
        </div>

        {/* Key Pillars & Impact Metrics */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-[#0c1427] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-sora font-semibold text-base">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span>16+ Years Legacy</span>
              </div>
              <p className="text-sm text-slate-300 font-normal">
                Over two decades of pioneering educational innovations and building world-class learning infrastructure across Puducherry and Karaikal.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#0c1427] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-sora font-semibold text-base">
                <HeartHandshake className="w-5 h-5 text-sky-400" />
                <span>Student-Centric Mentorship</span>
              </div>
              <p className="text-sm text-slate-300 font-normal">
                Championing inclusive learning where every student receives personalized attention, mock tests, and psychological motivation.
              </p>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">16+</p>
              <p className="text-xs text-slate-400 font-normal">Years of Service</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">3,000+</p>
              <p className="text-xs text-slate-400 font-normal">Eligible Students</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-sora font-semibold text-white">1,000+</p>
              <p className="text-xs text-slate-400 font-normal">Medical &amp; Top College Seats</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
