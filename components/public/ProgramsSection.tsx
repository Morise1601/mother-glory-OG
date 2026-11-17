import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types/content.types";
import { GraduationCap, ArrowRight, CheckCircle2, Clock, Calendar, Users, Sparkles, BookOpen } from "lucide-react";

interface ProgramsSectionProps {
  programs: Program[];
  onOpenEnquiry?: (programSlug: string) => void;
}

export default function ProgramsSection({ programs, onOpenEnquiry }: ProgramsSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F3]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12 pb-5 border-b border-[#DFE3EA]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-[#122452]/5 text-[#122452] text-xs font-bold tracking-wide capitalize">
              <Sparkles className="w-3.5 h-3.5 text-[#B68A35]" />
              <span>Structured Medical Entrance Preparation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#122452] tracking-tight">
              Programs Built for Ranks
            </h2>
            <p className="text-sm sm:text-base text-[#596579] max-w-xl">
              Concept clarity, daily doubt resolution, and rigorous mock test series designed to elevate scores with discipline and confidence.
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#122452] hover:text-[#B68A35] transition-colors shrink-0 group"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Enhanced Programs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => {
            const isFeatured = program.category === "repeater";
            return (
              <article
                key={program.id}
                className={`bg-white rounded-[8px] border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 ${isFeatured
                  ? "border-[#B68A35] shadow-md hover:shadow-2xl ring-1 ring-[#B68A35]/30"
                  : "border-[#DFE3EA] shadow-xs hover:shadow-xl hover:border-[#122452]/30"
                  }`}
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={program.imageUrl || "/images/hero_banner_mg.webp"}
                      unoptimized={program.imageUrl?.startsWith("https://")}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category Pill Over Image */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white/90 backdrop-blur-md text-[#122452] text-xs font-bold shadow-xs">
                        <GraduationCap className="w-3.5 h-3.5 text-[#B68A35]" />
                        <span>
                          {program.category === "neet_ug"
                            ? "Class 11 & 12"
                            : program.category === "repeater"
                              ? "Dropper Batch"
                              : "Foundation (9 & 10)"}
                        </span>
                      </span>
                    </div>

                    {/* Campus Availability Pill */}
                    <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B68A35] animate-pulse" />
                      <span>Puducherry & Karaikal</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#122452] group-hover:text-[#B68A35] transition-colors leading-snug">
                        {program.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#596579] mt-2 line-clamp-2 leading-relaxed">
                        {program.tagline}
                      </p>
                    </div>

                    {/* Key Highlights */}
                    <div className="pt-3 border-t border-[#DFE3EA]/70 space-y-2.5">
                      {program.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172033]">
                          <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-between gap-3">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="text-xs sm:text-sm font-semibold text-[#122452] hover:text-[#B68A35] flex items-center gap-1 transition-colors"
                    >
                      <span>Curriculum & Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/contact?program=${encodeURIComponent(program.title)}`}
                      className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition-all cursor-pointer shadow-xs ${isFeatured
                        ? "bg-[#B68A35] hover:bg-[#9c7328] text-white"
                        : "bg-[#122452] hover:bg-[#1b3472] text-white"
                        }`}
                    >
                      Enquire Now
                    </Link>
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
