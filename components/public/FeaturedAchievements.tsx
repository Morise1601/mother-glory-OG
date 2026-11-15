"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Achievement } from "@/types/content.types";
import PosterLightbox from "./PosterLightbox";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Maximize2, Trophy, Award } from "lucide-react";

interface FeaturedAchievementsProps {
  achievements: Achievement[];
}

export default function FeaturedAchievements({ achievements }: FeaturedAchievementsProps) {
  const [activeLightbox, setActiveLightbox] = useState<Achievement | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = achievements.length;

  const updateScrollButtons = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const cardWidth = sliderRef.current.children[0]?.clientWidth || 340;
    const current = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(Math.max(0, current), total - 1));
  }, [total]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();

    return () => {
      slider.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollByCard = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.children[0]?.clientWidth || 340;
    const shift = (cardWidth + 24) * (direction === "left" ? -1 : 1);
    sliderRef.current.scrollBy({ left: shift, behavior: "smooth" });
  };

  if (achievements.length === 0) return null;

  return (
    <>
      <section className="py-12 sm:py-16 bg-white border-y border-[#DFE3EA] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Slider Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10 pb-5 border-b border-[#DFE3EA]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-[#B68A35]/10 border border-[#B68A35]/20 text-[#B68A35] text-xs font-bold tracking-wide capitalize mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>Verified Hall of Excellence</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#122452] tracking-tight">
                Featured Achievements
              </h2>
              <p className="text-sm sm:text-base text-[#596579] mt-1 max-w-xl">
                Moments of dedication, discipline and medical entrance success from our students across Puducherry and Karaikal.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/achievements"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#122452] hover:text-[#B68A35] transition-colors group mr-2"
              >
                <span>View All ({total})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByCard("left")}
                  disabled={!canScrollLeft}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${canScrollLeft
                      ? "bg-[#FAF8F3] hover:bg-[#122452] hover:text-white border-[#DFE3EA] text-[#122452] shadow-xs"
                      : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                    }`}
                  aria-label="Previous Achievement"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard("right")}
                  disabled={!canScrollRight}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${canScrollRight
                      ? "bg-[#FAF8F3] hover:bg-[#122452] hover:text-white border-[#DFE3EA] text-[#122452] shadow-xs"
                      : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                    }`}
                  aria-label="Next Achievement"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Horizontal Slider Track */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {achievements.map((item) => (
              <div
                key={item.id}
                className="w-[280px] sm:w-[320px] md:w-[350px] aspect-[3/4] shrink-0 snap-start bg-slate-900 rounded-[8px] border border-[#DFE3EA] overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 relative group cursor-pointer"
                onClick={() => setActiveLightbox(item)}
              >
                {/* Only Image in Normal State */}
                <Image
                  src={item.imageUrl}
                  unoptimized={item.imageUrl.startsWith("https://")}
                  alt={item.altText || item.title}
                  fill
                  sizes="(max-width: 768px) 280px, 350px"
                  className="object-cover object-center w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* On Hover: Elegant Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white pointer-events-none">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-[8px] bg-[#B68A35] text-white font-bold text-[10px] capitalize tracking-wide">
                        {item.category}
                      </span>
                      <span className="text-white/80 text-xs font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B68A35]" />
                        {item.year}
                      </span>
                      <span className="text-white/50 text-xs">• {item.campus}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-white leading-snug drop-shadow-md line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#B68A35]">
                      <span className="flex items-center gap-1.5 group-hover:underline">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Click to preview poster</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Pagination Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {achievements.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${idx === activeIndex
                    ? "w-6 h-2 bg-[#B68A35]"
                    : "w-2 h-2 bg-[#DFE3EA]"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full Resolution Poster Lightbox Modal */}
      <PosterLightbox
        achievement={activeLightbox}
        allAchievements={achievements}
        onClose={() => setActiveLightbox(null)}
        onNavigate={(item) => setActiveLightbox(item)}
      />
    </>
  );
}
