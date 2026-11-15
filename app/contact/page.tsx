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
        {/* Header Hero */}
        <section className="bg-gradient-to-r from-[#122452] via-[#122452] to-[#1a3370] text-white py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold uppercase tracking-wider">
                ADMISSION COUNSELLING & CENTRES
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                Let&apos;s plan your next step
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
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
