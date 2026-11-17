import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FoundersSection from "@/components/public/FoundersSection";
import LearningApproach from "@/components/public/LearningApproach";
import AdmissionsCta from "@/components/public/AdmissionsCta";

import { getFounders } from "@/lib/data/founders";
import { getCampuses } from "@/lib/data/campuses";
import { getSiteSettings } from "@/lib/data/settings";
import {
  BookOpen,
  Target,
  ShieldCheck,
  Award,
  Users,
  HeartHandshake,
  MapPin,
  Phone,
  ArrowRight,
  Clock,
} from "lucide-react";

export const metadata = {
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About Us | Mother Glory Coaching & Tutorial Centre",
    description:
      "Learn about our 16+ years educational mission, expert medical mentorship, and academic leadership in Puducherry and Karaikal.",
    images: [{ url: "/images/banner_about.webp", width: 1200, height: 630, alt: "About Mother Glory Banner" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Mother Glory NEET Academy",
    description: "Learn about our educational mission and academic leadership in Puducherry and Karaikal.",
    images: ["/images/banner_about.webp"],
  },
  title: "About Us | Mother Glory Coaching & Tutorial Centre",
  description:
  "Learn about our 16+ years educational mission, expert medical mentorship, and academic leadership in Puducherry and Karaikal.",
};

export default async function AboutPage() {
  const [founders, campuses, settings] = await Promise.all([
    getFounders(),
    getCampuses(),
    getSiteSettings(),
  ]);

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Mother Glory Coaching & Tutorial Centre",
    description:
      "Learn about our 16+ years educational mission, expert medical mentorship, and academic leadership in Puducherry and Karaikal.",
    mainEntity: {
      "@type": "EducationalOrganization",
      name: settings.institutionName,
      url: "https://www.motherglory.com",
      founders: founders.map((f) => ({
        "@type": "Person",
        name: f.name,
        jobTitle: f.title,
        description: f.biography,
        image: f.portraitUrl ? `https://www.motherglory.com${f.portraitUrl}` : undefined,
      })),
    },
  };

  const values = [
    {
      title: "Student First",
      desc: "Every academic decision is guided by student understanding, wellbeing, and competitive success.",
      icon: Users,
    },
    {
      title: "Integrity & Transparency",
      desc: "Honest feedback, accurate diagnostic test reports, and ethical educational practices.",
      icon: ShieldCheck,
    },
    {
      title: "Discipline & Consistency",
      desc: "Daily revision routines, timely assessments, and structured study habits that build examination confidence.",
      icon: Target,
    },
    {
      title: "Experienced Mentorship",
      desc: "Specialized subject faculty offering personalized guidance and continuous motivation.",
      icon: Award,
    },
    {
      title: "Supportive Environment",
      desc: "Quiet study spaces, accessible doubt cabins, and constructive peer learning.",
      icon: HeartHandshake,
    },
    {
      title: "Service to Society",
      desc: "Committed to expanding medical opportunities for deserving students across Puducherry and Tamil Nadu regions.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Hero Section with Uploaded Medical Science & Biology Background */}
        <section className="relative overflow-hidden bg-[#122452] text-white py-16 sm:py-24">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_about.webp"
              alt="Mother Glory Medical Science and NEET Preparation Banner"
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
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 text-slate-100 text-xs font-semibold uppercase tracking-wider shadow-xs">
                OUR INSTITUTIONAL STORY
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                A purpose that goes beyond the classroom
              </h1>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
                At Mother Glory Coaching &amp; Tutorial Centre, we guide aspiring medical students with clarity, discipline, and care — building strong conceptual foundations for a brighter tomorrow.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/programs"
                  className="px-5 py-2.5 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  Explore Programs
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors backdrop-blur-xs"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Core Values */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Mission Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] p-6 sm:p-8 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#122452] text-white flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#B68A35]" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-[#122452]">
                  Our Mission
                </h2>
                <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                  To provide focused, high-quality guidance for NEET aspirants, nurturing fundamental knowledge, rigorous discipline, and strong moral character to help them achieve their medical dreams.
                </p>
                <div className="pt-4 border-t border-[#DFE3EA] space-y-2 text-xs text-[#172033]">
                  <p className="font-semibold text-[#122452]">Key Objectives:</p>
                  <p>• Simplify complex Physics and Chemistry problem-solving.</p>
                  <p>• Provide comprehensive, diagrammatic NCERT Biology mastery.</p>
                  <p>• Eradicate exam fear through simulated full-length mock drills.</p>
                </div>
              </div>

              {/* Core Values (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#B68A35] tracking-widest uppercase block mb-1">
                    FOUNDATIONAL PRINCIPLES
                  </span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#122452]">
                    Our core institutional values
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {values.map((v, idx) => {
                    const Icon = v.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#DFE3EA] bg-[#FAF8F3]/60 hover:bg-[#FAF8F3] transition-colors space-y-2"
                      >
                        <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#122452]">
                          <Icon className="w-4 h-4 text-[#B68A35] shrink-0" />
                          <span>{v.title}</span>
                        </div>
                        <p className="text-xs text-[#596579] leading-relaxed">
                          {v.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Founders Section */}
        <FoundersSection founders={founders} showFullBio={true} />

        {/* Learning Approach (4 Steps) */}
        <LearningApproach />

        {/* Campuses Overview */}
        <section className="py-12 sm:py-16 bg-white border-t border-[#DFE3EA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-[#B68A35] tracking-widest uppercase block">
                LEARNING SPACES
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
                Our campuses
              </h2>
              <p className="text-xs sm:text-sm text-[#596579]">
                Accessible, fully equipped coaching facilities in Puducherry and Karaikal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campuses.map((campus) => (
                <div
                  key={campus.id}
                  className="bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-slate-200">
                    <Image
                      src={campus.imageUrl}
                      alt={campus.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif font-bold text-xl text-[#122452]">
                      {campus.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                      {campus.address}, {campus.city} — {campus.postalCode}
                    </p>
                    <div className="pt-2 border-t border-[#DFE3EA] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-[#122452] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#B68A35]" />
                        {campus.phone}
                      </span>
                      <Link
                        href={`/contact?campus=${campus.name}`}
                        className="text-[#122452] hover:text-[#B68A35] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>View Centre Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
