import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdmissionsCta from "@/components/public/AdmissionsCta";

import { getAchievementBySlug, getAchievements } from "@/lib/data/achievements";
import { getSiteSettings } from "@/lib/data/settings";
import { Calendar, Tag, MapPin, ArrowLeft, ShieldCheck, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const achievement = await getAchievementBySlug(slug);
  if (!achievement) return { title: "Achievement Not Found" };

  return {
    alternates: { canonical: `/achievements/${slug}` },
    openGraph: { url: `/achievements/${slug}` },
    title: `${achievement.title} | Mother Glory Achievements`,
    description: achievement.summary,
  };
}

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const achievement = await getAchievementBySlug(slug);

  if (!achievement) {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      <Header announcement={settings.showAnnouncement ? settings.announcementNotice : undefined} />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <div className="mb-6">
            <Link
              href="/achievements"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#122452] hover:text-[#B68A35] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Achievements Gallery</span>
            </Link>
          </div>

          {/* Main Card */}
          <article className="bg-white rounded-3xl border border-[#DFE3EA] overflow-hidden shadow-sm">
            {/* Poster Header Display */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 flex items-center justify-center p-4 sm:p-8">
              <Image
                src={achievement.imageUrl}
                unoptimized={achievement.imageUrl.startsWith('https://')}
                alt={achievement.altText || achievement.title}
                width={900}
                height={1200}
                className="object-contain max-h-[70vh] w-auto rounded-xl shadow-2xl"
                priority
              />
            </div>

            {/* Poster Details */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-[#122452] text-white text-xs font-semibold">
                  {achievement.category}
                </span>
                <span className="flex items-center gap-1 text-xs sm:text-sm text-[#596579] font-medium">
                  <Calendar className="w-4 h-4 text-[#B68A35]" />
                  {achievement.year}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-xs sm:text-sm text-[#596579] font-medium">
                  <MapPin className="w-4 h-4 text-[#B68A35]" />
                  {achievement.campus} Campus
                </span>
              </div>

              <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#122452] leading-tight">
                {achievement.title}
              </h1>

              <p className="text-sm sm:text-base text-[#172033] leading-relaxed">
                {achievement.summary}
              </p>

              {achievement.caption && (
                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#DFE3EA] text-xs sm:text-sm text-[#596579] leading-relaxed">
                  <p className="font-semibold text-[#122452] mb-1">Official Event Caption:</p>
                  <p>{achievement.caption}</p>
                </div>
              )}

              {achievement.verificationStatus === "verified" && (
                <div className="pt-4 border-t border-[#DFE3EA] flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Institutional Record • Mother Glory Coaching & Tutorial Centre</span>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

