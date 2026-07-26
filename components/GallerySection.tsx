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
} from "lucide-react";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: "Classrooms" | "Science & Labs" | "Library" | "Seminars" | "Campus";
  description: string;
}

const galleryData: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/gallery/gallery-1.png",
    title: "Interactive NEET Coaching Classroom",
    category: "Classrooms",
    description: "Sunlit ergonomic spaces integrated with interactive touch displays for medical entrance lectures.",
  },
  {
    id: "g2",
    src: "/images/gallery/gallery-2.png",
    title: "NEET Study & Reference Library",
    category: "Library",
    description: "Serene reading hubs with extensive physical and digital NCERT & NEET entrance question archives.",
  },
  {
    id: "g3",
    src: "/images/gallery/gallery-3.png",
    title: "Advanced Biology & Chemistry Lab",
    category: "Science & Labs",
    description: "Hands-on medical science experiments, 3D anatomical models, and chemistry mechanisms.",
  },
  {
    id: "g4",
    src: "/images/gallery/gallery-4.png",
    title: "Motivational Seminar & Examination Hall",
    category: "Seminars",
    description: "Dedicated hall for NEET mock examinations, strategy sessions, and rank award ceremonies.",
  },
  {
    id: "g5",
    src: "/images/gallery/gallery-5.png",
    title: "Puducherry & Karaikal Campus",
    category: "Campus",
    description: "Inspiring campus environment designed for focused study, peace of mind, and academic success.",
  },
];

const categories = ["All", "Classrooms", "Science & Labs", "Library", "Seminars", "Campus"] as const;

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? galleryData
    : galleryData.filter((item) => item.category === selectedCategory);

  const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: false });

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

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#122452]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#122452] text-white text-xs font-normal uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Interactive Campus Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight">
            Explore Mother Glory <span className="text-white">Gallery Slider</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Take a visual tour through our state-of-the-art NEET coaching centers, interactive classrooms, science labs, and vibrant campus life.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                scrollTo(0);
              }}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#122452] text-white border-2 border-white shadow-xl shadow-[#122452]/60 scale-105"
                  : "bg-slate-900 text-slate-300 hover:bg-[#122452] hover:text-white border border-slate-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Carousel Viewport */}
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] md:flex-[0_0_85%] lg:flex-[0_0_75%] min-w-0 px-3 sm:px-4 py-4"
                >
                  <div className="relative h-[380px] sm:h-[480px] md:h-[540px] w-full rounded-lg overflow-hidden group/slide shadow-xl border border-slate-800/80">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 75vw"
                      className="object-cover transition-transform duration-700 group-hover/slide:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-slate-950/20 to-transparent opacity-90" />

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-5 right-5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#122452] text-white text-xs font-normal border border-white/20">
                        {item.category}
                      </span>
                      <button
                        onClick={() => setLightboxImage(item)}
                        className="p-2.5 rounded-lg bg-[#122452] text-white hover:bg-[#1b3260] transition-colors border border-white/20 font-medium"
                        title="View Fullscreen"
                        aria-label="Expand image in lightbox"
                      >
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                      <h3 className="text-xl sm:text-2xl font-sora font-semibold tracking-tight text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Prev Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[#122452] border border-white/20 text-white flex items-center justify-center shadow-xl hover:bg-[#1b3260] transition-all opacity-90 hover:scale-110 focus:outline-none font-medium"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[#122452] border border-white/20 text-white flex items-center justify-center shadow-xl hover:bg-[#1b3260] transition-all opacity-90 hover:scale-110 focus:outline-none font-medium"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slider Controls Bar (Dots & Play/Pause) */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4 glass-panel p-4 rounded-lg border border-slate-800 bg-slate-900">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {filteredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2.5 rounded-lg transition-all duration-300 ${
                  activeSlideIndex === index
                    ? "w-8 bg-[#122452] border border-white"
                    : "w-2.5 bg-slate-700 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Count & Play/Pause Button */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-normal text-slate-300">
              Slide <strong className="text-white font-semibold">{activeSlideIndex + 1}</strong> of {filteredItems.length}
            </span>
            <button
              onClick={toggleAutoplay}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#122452] border border-white/20 text-white text-xs font-medium hover:bg-[#1b3260] transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-white" />
                  <span>Autoplay</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-lg bg-[#122452] text-white hover:bg-slate-800 transition-colors border border-white/20 font-medium"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[65vh] w-full bg-black">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 space-y-2 border-t border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#122452] text-white text-xs font-normal border border-white/20">
                {lightboxImage.category}
              </div>
              <h3 className="text-2xl font-sora font-semibold text-white">{lightboxImage.title}</h3>
              <p className="text-slate-300 text-sm font-normal">{lightboxImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
