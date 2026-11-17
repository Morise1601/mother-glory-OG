import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdmissionsCta from "@/components/public/AdmissionsCta";

import { getPrograms } from "@/lib/data/programs";
import { getSiteSettings } from "@/lib/data/settings";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  Users,
  Compass,
  Calendar,
} from "lucide-react";

export const metadata = {
  alternates: { canonical: "/programs" },
  openGraph: { url: "/programs" },
  title: "NEET Programs | Mother Glory Coaching & Tutorial Centre",
  description:
    "Explore our structured medical coaching programs: NEET UG (Class 11-12), Repeaters / Dropper batch, and Class 9-10 Pre-Medical Foundation.",
};

export default async function ProgramsPage() {
  const [programs, settings] = await Promise.all([
    getPrograms(),
    getSiteSettings(),
  ]);

  const highlights = [
    { title: "Complete NEET Syllabus Coverage", desc: "Line-by-line NCERT mapping and high-yield concepts." },
    { title: "Regular Tests & Performance Analysis", desc: "Weekly unit tests, OMR diagnostics, and full mock series." },
    { title: "Disciplined & Supportive Environment", desc: "Focused study halls and structured academic schedules." },
    { title: "Experienced & Dedicated Faculty", desc: "Expert medical entrance educators in all core disciplines." },
    { title: "Personalised Academic Support", desc: "One-on-one doubt clearing and progress monitoring." },
    { title: "Centres in Puducherry & Karaikal", desc: "Accessible branches with modern teaching infrastructure." },
  ];

  const subjects = [
    {
      name: "Physics",
      icon: Atom,
      desc: "Conceptual understanding, formula maps, numerical speed techniques, and daily practice problem drills.",
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      desc: "Mastery of Organic reaction mechanisms, Inorganic periodic trends, and Physical chemistry calculations.",
    },
    {
      name: "Biology",
      icon: Dna,
      desc: "Comprehensive NCERT line-by-line coverage with high-yield diagrams, assertion-reasoning, and botany/zoology tests.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Enquire",
      desc: "Get in touch with our team via website or phone for program details and prospectus.",
    },
    {
      num: "2",
      title: "Counselling",
      desc: "Personalized academic counselling to evaluate current stage and recommend the right batch.",
    },
    {
      num: "3",
      title: "Choose a Batch",
      desc: "Complete registration and begin your disciplined learning journey at Puducherry or Karaikal.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Hero Section with Medical Coaching & Curricula Background */}
        <section className="relative overflow-hidden bg-[#122452] text-white py-16 sm:py-24">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_programs.webp"
              alt="Medical Coaching and Curricula Banner"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right lg:object-center"
            />
            {/* Left-to-right institutional gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#122452] via-[#122452]/80 sm:via-[#122452]/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 text-slate-100 text-xs font-semibold capitalize tracking-wide shadow-xs">
                Comprehensive Medical Curricula
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                A clear path to your next milestone
              </h1>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
                Focused programs for NEET aspirants at every stage of their preparation journey — from high-school foundation to intensive dropper batches.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  Enquire Now
                </Link>
                <a
                  href="#admission-process"
                  className="px-5 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors backdrop-blur-xs"
                >
                  Admission Process
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Cards Grid */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
                Our Courses
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
                Our NEET programs
              </h2>
              <p className="text-xs sm:text-sm text-[#596579]">
                Choose the right program for your current academic stage and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <article
                  key={program.id}
                  className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {program.imageUrl && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-[#DFE3EA]">
                        <Image
                          src={program.imageUrl}
                          alt={program.title}
                          fill
                          unoptimized={program.imageUrl.startsWith("https://")}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white/95 backdrop-blur-md text-[#122452] text-xs font-bold shadow-xs">
                            <GraduationCap className="w-3.5 h-3.5 text-[#B68A35]" />
                            <span>{program.targetAudience}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-7 space-y-4">
                      {!program.imageUrl && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-[#122452]/5 text-[#122452] text-xs font-semibold">
                          <GraduationCap className="w-3.5 h-3.5 text-[#B68A35]" />
                          <span>{program.targetAudience}</span>
                        </span>
                      )}

                    <h3 className="text-xl font-serif font-bold text-[#122452]">
                      {program.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                      {program.overview}
                    </p>

                    <div className="pt-3 border-t border-[#DFE3EA] space-y-2 text-xs text-[#172033]">
                      <p className="font-semibold text-[#122452]">Curriculum Highlights:</p>
                      {program.curriculum.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B68A35] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-0 border-t border-[#DFE3EA] mt-4 flex items-center justify-between gap-3">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="text-xs sm:text-sm font-semibold text-[#122452] hover:text-[#B68A35] flex items-center gap-1 transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/contact?program=${encodeURIComponent(program.title)}`}
                      className="px-4 py-2 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      Enquire
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Program Highlights */}
        <section className="py-14 sm:py-20 bg-[#FAF8F3] border-b border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
                Academic Standards
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
                Program highlights
              </h2>
              <p className="text-xs sm:text-sm text-[#596579]">
                Key features across all our programs in Puducherry and Karaikal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[8px] border border-[#DFE3EA] p-6 shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-2 font-serif font-bold text-base text-[#122452]">
                    <CheckCircle2 className="w-4 h-4 text-[#B68A35] shrink-0" />
                    <span>{h.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Focused Subject Support */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
                Subject Mastery
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
                Focused subject support
              </h2>
              <p className="text-xs sm:text-sm text-[#596579]">
                In-depth learning and rigorous practice across all three core NEET disciplines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subjects.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] p-6 sm:p-7 shadow-xs space-y-3"
                  >
                    <div className="w-10 h-10 rounded-[8px] bg-[#122452] text-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#B68A35]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#122452]">
                      {sub.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Admission Process (3 Steps) */}
        <section id="admission-process" className="py-14 sm:py-20 bg-[#FAF8F3]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block">
                Simple Enrollment Journey
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
                Admission process
              </h2>
              <p className="text-xs sm:text-sm text-[#596579]">
                A simple and guided admission journey from initial inquiry to classroom commencement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="bg-white rounded-[8px] border border-[#DFE3EA] p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-full bg-[#122452] text-white font-bold text-xs flex items-center justify-center">
                      {st.num}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#122452]">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <AdmissionsCta />
      </main>

      <Footer />
    </div>
  );
}

