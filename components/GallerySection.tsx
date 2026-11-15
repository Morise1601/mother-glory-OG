"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Sparkles,
  Trophy,
} from "lucide-react";

interface GalleryItem {
  id: string;
  src: string;
}

const galleryData: GalleryItem[] = [
  { id: "g1", src: "/images/achievements/1.webp" },
  { id: "g2", src: "/images/achievements/2.webp" },
  { id: "g3", src: "/images/achievements/3.webp" },
  { id: "g4", src: "/images/achievements/4.webp" },
  { id: "g5", src: "/images/achievements/5.webp" },
  { id: "g6", src: "/images/achievements/6.webp" },
  { id: "g7", src: "/images/achievements/7.webp" },
  { id: "g8", src: "/images/achievements/8.webp" },
  { id: "g9", src: "/images/achievements/9.webp" },
];

export default function GallerySection() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const autoplayPlugin = Autoplay({ delay: 3500, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplayPlugin]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    if (!autoplayPlugin) return;
    if (isPlaying) {
      autoplayPlugin.stop();
      setIsPlaying(false);
    } else {
      autoplayPlugin.play();
      setIsPlaying(true);
    }
  }, [autoplayPlugin, isPlaying]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveSlideIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Keyboard navigation for Lightbox Full View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;
      const currentIndex = galleryData.findIndex((img) => img.id === lightboxImage.id);
      if (e.key === "Escape") {
        setLightboxImage(null);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % galleryData.length;
        setLightboxImage(galleryData[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        setLightboxImage(galleryData[prevIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  const openLightboxPrev = () => {
    if (!lightboxImage) return;
    const currentIndex = galleryData.findIndex((img) => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    setLightboxImage(galleryData[prevIndex]);
  };

  const openLightboxNext = () => {
    if (!lightboxImage) return;
    const currentIndex = galleryData.findIndex((img) => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % galleryData.length;
    setLightboxImage(galleryData[nextIndex]);
  };

  return (
    <section id="gallery" className="py-10 sm:py-16 md:py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#122452]/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8 md:space-y-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold uppercase tracking-wider border border-amber-400/40 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Proven Track Record of Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
              Explore Mother Glory <span className="text-amber-400">Achievements</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              A visual showcase of our outstanding NEET toppers, government medical college admissions, and 16+ years of historic ranks.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#122452] text-white text-sm font-semibold hover:opacity-90 transition-opacity border border-amber-400/30 shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Open Full Gallery Page</span>
            </a>
          </div>
        </div>

        {/* Infinite Carousel Showcase */}
        <div className="relative">
          {/* Main Carousel Viewport */}
          <div className="overflow-hidden py-3 sm:py-6" ref={emblaRef}>
            <div className="flex touch-pan-y items-center">
              {galleryData.map((item, index) => {
                const isActive = activeSlideIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`flex-[0_0_92%] sm:flex-[0_0_75%] md:flex-[0_0_60%] lg:flex-[0_0_50%] min-w-0 px-2 sm:px-5 transition-all duration-700 ease-out transform ${isActive
                      ? "scale-100 opacity-100 z-20"
                      : "scale-90 opacity-40 hover:opacity-75 blur-[0.5px]"
                      }`}
                  >
                    <div
                      onClick={() => setLightboxImage(item)}
                      className={`relative h-[250px] sm:h-[380px] md:h-[520px] min-h-[250px] sm:min-h-[380px] md:min-h-[520px] w-full rounded-xl sm:rounded-2xl overflow-hidden group/slide cursor-pointer transition-all duration-500 shadow-xl ${isActive
                        ? "border-2 border-red-500 shadow-[0_15px_40px_rgba(220,38,38,0.4)] ring-2 ring-amber-400/50"
                        : "border border-slate-800/80"
                        }`}
                    >
                      <Image
                        src={item.src}
                        alt={`Mother Glory NEET Achievement ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover/slide:scale-105"
                      />

                      {/* Floating Full View Badge */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <div
                          className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-red-600/90 text-white border border-amber-400/40 font-medium text-sm shadow-lg backdrop-blur-md group-hover/slide:scale-105 transition-transform flex items-center gap-1.5"
                        >
                          <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                          <span>Full View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Prev Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-slate-900/90 border border-amber-400/30 text-white flex items-center justify-center shadow-2xl hover:bg-red-600 transition-all opacity-95 hover:scale-110 focus:outline-none z-30 backdrop-blur-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-slate-900/90 border border-amber-400/30 text-white flex items-center justify-center shadow-2xl hover:bg-red-600 transition-all opacity-95 hover:scale-110 focus:outline-none z-30 backdrop-blur-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Clean Dotted Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {galleryData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeSlideIndex === index
                  ? "w-8 bg-[#122452] border border-blue-400/80 shadow-md shadow-blue-500/20"
                  : "w-2.5 bg-slate-700 hover:bg-slate-500"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Lightbox Modal - Enhanced Full View Modal with Prev/Next Navigation */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full h-[90vh] bg-[#060a12] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center"
          >
            {/* Modal Top Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#122452]/90 text-white text-sm font-semibold border border-white/20 backdrop-blur-md pointer-events-auto">
                Full View • Poster {galleryData.findIndex((i) => i.id === lightboxImage.id) + 1} of {galleryData.length}
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-3 rounded-xl bg-[#122452]/90 text-white hover:bg-red-600 transition-colors border border-white/20 font-medium shadow-xl backdrop-blur-md pointer-events-auto"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Image Viewport */}
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              <Image
                src={lightboxImage.src}
                alt="Mother Glory NEET Achievement Full View"
                fill
                priority
                sizes="100vw"
                className="object-contain p-2"
              />
            </div>

            {/* Modal Prev Button */}
            <button
              onClick={openLightboxPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-[#122452]/90 text-white hover:bg-[#1b3260] transition-all border border-white/20 shadow-2xl backdrop-blur-md z-20"
              aria-label="Previous achievement poster"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Modal Next Button */}
            <button
              onClick={openLightboxNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-[#122452]/90 text-white hover:bg-[#1b3260] transition-all border border-white/20 shadow-2xl backdrop-blur-md z-20"
              aria-label="Next achievement poster"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
