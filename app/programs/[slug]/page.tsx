import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdmissionsCta from "@/components/public/AdmissionsCta";
import FaqSection from "@/components/public/FaqSection";

import { getProgramBySlug, getPrograms } from "@/lib/data/programs";
import { getSiteSettings } from "@/lib/data/settings";
import {
  GraduationCap,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };

  return {
    alternates: { canonical: `/programs/${slug}` },
    openGraph: { url: `/programs/${slug}` },
    title: `${program.title} | Mother Glory NEET Academy`,
    description: program.tagline,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Program Hero Header */}
        <section className="bg-gradient-to-r from-[#122452] via-[#122452] to-[#1a3370] text-white py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/programs" className="text-xs text-slate-300 hover:text-white transition-colors">
                  ← All Programs
                </Link>
                <span className="text-slate-500">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold">
                  {program.targetAudience}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                {program.title}
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {program.tagline}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={`/contact?program=${encodeURIComponent(program.title)}`}
                  className="px-6 py-3 rounded-lg bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <span>Enquire for This Program</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919842823195"
                  className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold transition-colors"
                >
                  Call Admissions: +91 98428 23195
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Program Details Layout */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Main Content (8 cols) */}
              <div className="lg:col-span-8 space-y-10">
                {/* Program Overview */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#B68A35] uppercase tracking-wider block">
                    PROGRAM OVERVIEW
                  </span>
                  <h2 className="font-serif font-bold text-2xl text-[#122452]">
                    About this course
                  </h2>
                  <p className="text-sm sm:text-base text-[#596579] leading-relaxed">
                    {program.overview}
                  </p>
                </div>

                {/* Eligibility */}
                <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] p-6 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#122452] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B68A35]" />
                    <span>Eligibility Requirements</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                    {program.eligibility}
                  </p>
                </div>

                {/* Curriculum Breakdown */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#B68A35] uppercase tracking-wider block">
                    SYLLABUS & PEDAGOGY
                  </span>
                  <h2 className="font-serif font-bold text-2xl text-[#122452]">
                    Structured curriculum
                  </h2>
                  <div className="space-y-3">
                    {program.curriculum.map((curr, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl border border-[#DFE3EA] bg-[#FAF8F3]/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#172033] leading-relaxed">
                          {curr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Notice if verified */}
                {program.scheduleNotice && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-amber-900">
                        Batch Schedule & Availability:
                      </p>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {program.scheduleNotice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Card (4 cols) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-5">
                  <h3 className="font-serif font-bold text-lg text-[#122452]">
                    Quick Details
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#DFE3EA]">
                      <span className="text-[#596579]">Target Stage</span>
                      <span className="font-semibold text-[#122452] text-right">
                        {program.targetAudience}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#DFE3EA]">
                      <span className="text-[#596579]">Campuses</span>
                      <span className="font-semibold text-[#122452] text-right">
                        Puducherry & Karaikal
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#DFE3EA]">
                      <span className="text-[#596579]">Subjects</span>
                      <span className="font-semibold text-[#122452] text-right">
                        Physics, Chemistry, Biology
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#596579]">Delivery Mode</span>
                      <span className="font-semibold text-[#122452] text-right">
                        Classroom & Tests
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/contact?program=${encodeURIComponent(program.title)}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program FAQs */}
        <FaqSection />

        {/* CTA */}
        <AdmissionsCta />
      </main>

      <Footer />
    </div>
  );
}

