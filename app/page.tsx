import Header from "@/components/public/Header";
import HeroCarousel from "@/components/public/HeroCarousel";
import TrustStrip from "@/components/public/TrustStrip";
import ProgramsSection from "@/components/public/ProgramsSection";
import FeaturedAchievements from "@/components/public/FeaturedAchievements";
import FoundersSection from "@/components/public/FoundersSection";
import LearningApproach from "@/components/public/LearningApproach";
import GoogleReviewsSection from "@/components/public/GoogleReviewsSection";
import FaqSection from "@/components/public/FaqSection";
import AdmissionsCta from "@/components/public/AdmissionsCta";
import Footer from "@/components/public/Footer";
import EntryTransition from "@/components/public/EntryTransition";
import WelcomePopupModal from "@/components/public/WelcomePopupModal";

import { getActiveBanners } from "@/lib/data/banners";
import { getPrograms } from "@/lib/data/programs";
import { getFeaturedAchievements } from "@/lib/data/achievements";
import { getFounders } from "@/lib/data/founders";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublicWelcomePopup } from "@/lib/data/popup";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [banners, programs, achievements, founders, settings, welcomePopup] = await Promise.all([
    getActiveBanners(),
    getPrograms(),
    getFeaturedAchievements(),
    getFounders(),
    getSiteSettings(),
    getPublicWelcomePopup(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#172033]">
      {/* 1. Header with Slim Admissions Notice */}
      <Header
        announcement={settings.showAnnouncement ? settings.announcementNotice : undefined}
      />

      <main className="flex-grow">
        {/* Primary Accessible & SEO Heading */}
        <h1 className="sr-only">
          Mother Glory Coaching &amp; Tutorial Centre — Best NEET Coaching in Puducherry &amp; Karaikal
        </h1>

        {/* 2. Full-Width & Fit-to-Screen Banner Slider */}
        <EntryTransition delay={50} className="w-full">
          <HeroCarousel slides={banners} />
        </EntryTransition>

        {/* 3. Verified Campus / Trust Strip */}
        <EntryTransition delay={100}>
          <TrustStrip />
        </EntryTransition>

        {/* 4. Enhanced Programs Cards */}
        <EntryTransition delay={150}>
          <ProgramsSection programs={programs} />
        </EntryTransition>

        {/* 5. Featured Achievements Horizontal Slider & Full Lightbox */}
        <EntryTransition delay={150}>
          <FeaturedAchievements achievements={achievements} />
        </EntryTransition>

        {/* 6. Enhanced Founder Showcase */}
        <EntryTransition delay={150}>
          <FoundersSection founders={founders} />
        </EntryTransition>

        {/* 7. Learning Approach (4-Step Methodology) */}
        <EntryTransition delay={150}>
          <LearningApproach />
        </EntryTransition>

        {/* 8. Google Reviews Section (Server-backed, no public connect button) */}
        <EntryTransition delay={150}>
          <GoogleReviewsSection />
        </EntryTransition>

        {/* 9. FAQs */}
        <EntryTransition delay={150}>
          <FaqSection />
        </EntryTransition>

        {/* 10. Enhanced Admissions CTA Banner */}
        <EntryTransition delay={150}>
          <AdmissionsCta />
        </EntryTransition>
      </main>

      {/* 11. Public Footer */}
      <Footer />

      {/* 12. Homepage Welcome Modal / Advertisement Poster */}
      <WelcomePopupModal popup={welcomePopup} />
    </div>
  );
}
