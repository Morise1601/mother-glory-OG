import Image from "next/image";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdmissionsCta from "@/components/public/AdmissionsCta";
import AchievementsGalleryClient from "@/components/public/AchievementsGalleryClient";

import { getAchievements } from "@/lib/data/achievements";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = {
  alternates: { canonical: "/achievements" },
  openGraph: {
    url: "/achievements",
    title: "NEET Achievements & Results | Mother Glory NEET Academy",
    description:
      "Explore verified milestone records, NEET exam qualifiers, awards, and student recognition posters in Puducherry and Karaikal.",
    images: [{ url: "/images/banner_achievements.webp", width: 1200, height: 630, alt: "Mother Glory Achievements Banner" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEET Achievements & Results | Mother Glory NEET Academy",
    description: "Explore verified milestone records and NEET exam qualifiers from Mother Glory.",
    images: ["/images/banner_achievements.webp"],
  },
  title: "NEET Achievements & Results | Mother Glory NEET Academy",
  description:
  "Explore verified milestone records, NEET exam qualifiers, awards, and student recognition posters in Puducherry and Karaikal.",
};

export default async function AchievementsPage() {
  const [achievements, settings] = await Promise.all([
    getAchievements(),
    getSiteSettings(),
  ]);

  const achievementsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mother Glory NEET Achievements & Verified Qualifiers",
    description: "Verified institutional milestone records, student recognition posters, and medical college admissions.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: achievements.slice(0, 30).map((a, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "ImageObject",
          name: a.title,
          caption: a.caption || a.summary,
          contentUrl: `https://www.motherglory.com${a.imageUrl}`,
          url: `https://www.motherglory.com/achievements/${a.slug}`,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(achievementsJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow">
        {/* Header Hero with Uploaded Trophy & Academic Books Background */}
        <section className="relative overflow-hidden bg-[#122452] text-white py-16 sm:py-24">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_achievements.webp"
              alt="Academic Achievements and Awards Banner"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right lg:object-center"
            />
            {/* Left-to-right institutional gradient overlay ensuring high contrast for text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#122452] via-[#122452]/80 sm:via-[#122452]/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/20 text-slate-100 text-xs font-semibold capitalize tracking-wide shadow-xs">
                Hall of Merit &amp; Success
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                Every milestone tells a story
              </h1>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
                Moments of recognition, disciplined effort, and learning excellence at Mother Glory Coaching &amp; Tutorial Centre. Explore our verified student achievements.
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
