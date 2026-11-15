import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdmissionsCta from "@/components/public/AdmissionsCta";
import AchievementsGalleryClient from "@/components/public/AchievementsGalleryClient";

import { getAchievements } from "@/lib/data/achievements";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
  alternates: { canonical: "/achievements" },
  openGraph: { url: "/achievements" },
  title: "Achievements & Results | Mother Glory NEET Academy",
  description:
    "Explore our verified milestone records, NEET exam qualifiers, awards, and student recognition posters in Puducherry and Karaikal.",
};

export default async function AchievementsPage() {
  const [achievements, settings] = await Promise.all([
    getAchievements(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Header Hero */}
        <section className="bg-gradient-to-r from-[#122452] via-[#122452] to-[#1a3370] text-white py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[8px] bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold capitalize tracking-wide">
                Hall of Merit & Success
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                Every milestone tells a story
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Moments of recognition, disciplined effort, and learning excellence at Mother Glory Coaching & Tutorial Centre. Explore our verified student achievements.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <AchievementsGalleryClient initialAchievements={achievements} />
          </div>
        </section>

        {/* Admissions CTA */}
        <AdmissionsCta />
      </main>

      <Footer />
    </div>
  );
}

