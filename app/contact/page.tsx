import Image from "next/image";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import ContactForm from "@/components/public/ContactForm";

import { getPrograms } from "@/lib/data/programs";
import { getCampuses } from "@/lib/data/campuses";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
  title: "Contact & Admissions | Mother Glory Coaching & Tutorial Centre",
  description:
    "Contact Mother Glory NEET Academy in Puducherry and Karaikal. Inquire about admissions, batch schedules, fees, and counselling support.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; campus?: string }>;
}) {
  const { program, campus } = await searchParams;
  const [campuses, settings, programs] = await Promise.all([
    getCampuses(),
    getSiteSettings(),
    getPrograms(),
  ]);

  const defaultCampus = campus?.toLowerCase() === "karaikal" ? "Karaikal" : "Puducherry";
  const defaultProgram = programs.some(p => p.title === program) ? program! : programs[0]?.title || "Admissions information";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Header Hero with Admissions & Counselling Background */}
        <section className="relative overflow-hidden bg-[#122452] text-white py-16 sm:py-24">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_contact.webp"
              alt="Admissions Consultation and Campus Office Banner"
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
                ADMISSION COUNSELLING &amp; CENTRES
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                Let&apos;s plan your next step
              </h1>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
                Admissions, programs and guidance for NEET preparation at our centres in Puducherry and Karaikal. Reach out to our academic counsellors today.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Enquiry Form Section (C01) */}
        <section className="py-12 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm
              campuses={campuses}
              programs={programs}
              defaultProgram={defaultProgram}
              defaultCampus={defaultCampus}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
