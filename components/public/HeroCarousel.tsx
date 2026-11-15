"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BannerSlide } from "@/types/content.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCarouselProps {
  slides: BannerSlide[];
  onOpenEnquiry?: (program?: string) => void;
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const total = slides.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-slide effect: continuously auto-advances, with responsive speed
  useEffect(() => {
    if (total <= 1) return;

    const intervalTime = isHovered ? 3800 : 4800;
    const timer = setInterval(() => {
      if (isAutoSliding || isHovered) {
        nextSlide();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [total, isAutoSliding, isHovered, nextSlide]);

  // Touch swipe support for mobile & tablet
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) {
    return null;
  }

  return (
    <section
      aria-label="Institutional Highlights Carousel"
      className="relative w-full overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => {
        setIsHovered(true);
        setIsAutoSliding(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Width & Fit to Screen 16:9 Frame */}
      <div className="relative w-full aspect-[16/9] max-h-[85vh] overflow-hidden bg-slate-950">
        {/* Slides Track */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const imageContent = (
            <picture className="relative block w-full h-full">
              {slide.mobileImageUrl && <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />}
              <Image
                src={slide.desktopImageUrl}
                alt={slide.title || "Mother Glory Campus Highlights"}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                unoptimized={slide.desktopImageUrl.startsWith('https://')}
                style={{ objectPosition: slide.focalPoint }}
                className="object-cover object-center w-full h-full transform scale-100 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
            </picture>
          );

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.ctaUrl && slide.ctaUrl !== "#" ? (
                <Link
                  href={slide.ctaUrl}
                  tabIndex={isActive ? 0 : -1}
                  className="block w-full h-full cursor-pointer"
                  aria-label={slide.title || "View banner details"}
                >
                  {imageContent}
                </Link>
              ) : (
                imageContent
              )}
            </div>
          );
        })}

        {/* Left Arrow Navigation */}
        {total > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Right Arrow Navigation */}
        {total > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-xl opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Bottom Floating Bar: Counter & Indicators */}
        {total > 1 && (
          <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 pointer-events-none">
            {/* Slide Index Counter */}
            <div className="px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm font-semibold tracking-wider font-mono shadow-md pointer-events-auto">
              <span className="text-[#B68A35] font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-white/50 mx-1.5">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>

            {/* Interactive Navigation Dots */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/55 backdrop-blur-md border border-white/20 shadow-md pointer-events-auto">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-7 sm:w-9 h-2 bg-[#B68A35] shadow-xs"
                      : "w-2 h-2 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
