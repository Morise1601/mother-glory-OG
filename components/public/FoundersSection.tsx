import Image from "next/image";
import { Founder } from "@/types/content.types";
import { Quote, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FoundersSectionProps {
  founders: Founder[];
  showFullBio?: boolean;
}

export default function FoundersSection({ founders, showFullBio = false }: FoundersSectionProps) {
  if (founders.length === 0) return null;
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F3] relative overflow-hidden border-t border-[#DFE3EA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#122452]/5 border border-[#122452]/10 text-[#122452] text-xs font-bold tracking-wide capitalize">
            <ShieldCheck className="w-4 h-4 text-[#B68A35]" />
            <span>Visionary Academic Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#122452] tracking-tight">
            Leadership Dedicated to Student Success
          </h2>
          <p className="text-xs sm:text-sm text-[#596579] max-w-2xl mx-auto leading-relaxed">
            Guided by dedicated educators with over 16 years of proven commitment to disciplined medical entrance mentoring in Puducherry and Karaikal.
          </p>
        </div>

        {/* Executive Founders Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {founders.map((founder, idx) => {
            const isFounderDirector = idx === 0;
            return (
              <article
                key={founder.id}
                className="bg-white rounded-[8px] border border-[#DFE3EA] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top: Large Dignified Portrait Showcase */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={founder.portraitUrl}
                    unoptimized={founder.portraitUrl.startsWith('https://')}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    priority={idx === 0}
                    className="object-cover object-top filter contrast-[1.03] group-hover:scale-102 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Framing */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1836]/90 via-[#0c1836]/30 to-transparent pointer-events-none" />

                  {/* Top Role Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#122452]/90 backdrop-blur-md text-white border border-white/20 text-xs font-bold tracking-wide capitalize shadow-md">
                      <Award className="w-3.5 h-3.5 text-[#B68A35]" />
                      <span>{isFounderDirector ? "Founder & Managing Director" : "Chairman & Managing Trustee"}</span>
                    </span>
                  </div>

                  {/* Bottom Portrait Caption (Name & Designation) */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-sm">
                      {founder.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#B68A35] drop-shadow-xs mt-0.5">
                      {founder.title}
                    </p>
                  </div>
                </div>

                {/* Bottom: Structured Credentials & Vision */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-5 bg-white">
                  <div className="space-y-4">
                    {/* Academic Qualification Pill */}
                    {founder.qualifications && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA] text-xs font-semibold text-[#122452]">
                          {founder.qualifications}
                        </span>
                      </div>
                    )}

                    {/* Inspirational Quote Card */}
                    <div className="relative p-5 rounded-[8px] bg-[#FAF8F3] border-l-4 border-l-[#B68A35] border border-[#DFE3EA] shadow-xs">
                      <Quote className="w-5 h-5 text-[#B68A35] mb-2 opacity-80" />
                      <p className="text-xs sm:text-sm text-[#172033] font-serif italic leading-relaxed">
                        &ldquo;{founder.message}&rdquo;
                      </p>
                    </div>

                    {/* Biography / Description (Fill negative space snugly) */}
                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                      {founder.biography}
                    </p>
                  </div>

                  {/* Bottom Trust Strip */}
                  <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-between text-xs text-[#122452]">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#B68A35]" />
                      <span>Direct Guidance & Mentorship</span>
                    </div>
                    <span className="text-[#596579] text-[11px] font-medium hidden sm:inline-block">
                      Mother Glory Puducherry & Karaikal
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
