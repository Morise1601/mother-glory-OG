"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Sparkles,
  Award,
  ArrowRight,
  GraduationCap,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AchievementBanner {
  id: string;
  src: string;
  title: string;
  year: string;
  highlight: string;
}

const achievementBanners: AchievementBanner[] = [
  {
    id: "ach-1",
    src: "/images/achievements/1.webp",
    title: "2022-2023 NEET Top Rankers",
    year: "2022-23",
    highlight: "JIPMER & State Govt Medical Seats",
  },
  {
    id: "ach-2",
    src: "/images/achievements/2.webp",
    title: "2023-2024 Outstanding Medical Results",
    year: "2023-24",
    highlight: "Historic High Scores & MBBS Selections",
  },
  {
    id: "ach-3",
    src: "/images/achievements/3.webp",
    title: "2021-2022 NEET Medical Selection Board",
    year: "2021-22",
    highlight: "Top Centac & All India Quota Ranks",
  },
  {
    id: "ach-4",
    src: "/images/achievements/4.webp",
    title: "2020-2021 Premier Coaching Laurels",
    year: "2020-21",
    highlight: "100% Focused Aspirant Outcomes",
  },
  {
    id: "ach-5",
    src: "/images/achievements/5.webp",
    title: "2019-2020 Medical College Entrants",
    year: "2019-20",
    highlight: "Government Medical College Admissions",
  },
  {
    id: "ach-6",
    src: "/images/achievements/6.webp",
    title: "2018-2019 NEET Milestone Scorers",
    year: "2018-19",
    highlight: "Puducherry & Karaikal Top Scorers",
  },
  {
    id: "ach-7",
    src: "/images/achievements/7.webp",
    title: "2017-2018 Pioneer Batch Doctors",
    year: "2017-18",
    highlight: "16+ Years Medical Legacy Established",
  },
  {
    id: "ach-8",
    src: "/images/achievements/8.webp",
    title: "2016-2017 Medical College Champions",
    year: "2016-17",
    highlight: "Unbroken Record of Medical Admissions",
  },
  {
    id: "ach-9",
    src: "/images/achievements/9.webp",
    title: "16+ Years Grand Achievement Legacy",
    year: "Legacy",
    highlight: "3,000+ Qualifiers & 1,000+ MBBS Doctors",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<AchievementBanner | null>(null);

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
      setActiveSlide(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      id="home"
      className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#122452]/10 via-white to-slate-50 dark:from-[#081024] dark:via-slate-950 dark:to-[#060a12]"
    >
      {/* Decorative Glow Orbs matching Brand Crest theme */}
      <div className="absolute top-10 left-1/4 w-[360px] sm:w-[600px] h-[360px] sm:h-[600px] bg-red-600/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] bg-[#122452]/15 dark:bg-[#122452]/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Admissions Alert Pill */}
        <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-red-500/30 text-sm font-semibold text-[#122452] dark:text-slate-100 shadow-md shadow-red-500/10">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-sm">
              Admissions Open 2026 - 2027
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span className="hidden sm:inline font-medium text-slate-600 dark:text-slate-300">
              Karaikal &amp; Puducherry
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Main Grid: Headline + Banner Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              Empowering Minds, <br />
              <span className="bg-gradient-to-r from-red-600 via-amber-500 to-[#122452] dark:from-red-400 dark:via-amber-300 dark:to-blue-300 bg-clip-text text-transparent">
                Inspiring Excellence
              </span>
              <br />&amp; Shaping Future Doctors
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Welcome to <strong className="text-[#122452] dark:text-amber-400 font-semibold">Mother Glory Coaching &amp; Tutorial Centre</strong>. For over 16+ years, we have guided more than 3,000+ medical aspirants with proven NEET coaching, comprehensive study modules, and rigorous test series.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                href="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-red-600 via-[#122452] to-[#122452] hover:from-[#122452] hover:to-red-600 rounded-xl shadow-lg shadow-red-600/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-amber-400/30"
              >
                <span>View All Achievements</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#122452] dark:text-white bg-white dark:bg-slate-900 border-2 border-[#122452]/20 dark:border-slate-700 hover:border-[#122452] dark:hover:border-amber-400 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <span>Enroll for 2026-27</span>
              </Link>
            </div>

            {/* Trust Metrics Grid */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-3 text-center lg:text-left">
              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">4.9/5</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">520+ Reviews</p>
              </div>

              <div className="space-y-1 border-x border-slate-200 dark:border-slate-800 px-2">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-red-600">
                  <Award className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">1,000+</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">MBBS Seats</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#122452] dark:text-sky-400">
                  <GraduationCap className="w-4 h-4 text-[#122452] dark:text-sky-400" />
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">3,000+</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">NEET Qualifiers</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Homepage Banner Carousel */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#122452] via-[#0b1736] to-slate-950 p-2 sm:p-3 shadow-2xl border-2 border-[#122452] dark:border-amber-400/40">

              {/* Carousel Top Control Bar */}
              <div className="flex items-center justify-between px-3 py-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    Achievements Showcase
                  </span>
                  <span className="text-sm text-amber-300 font-mono font-medium hidden sm:inline">
                    {activeSlide + 1} of {achievementBanners.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAutoplay}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => setLightboxImage(achievementBanners[activeSlide])}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Open Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Carousel Viewport */}
              <div className="overflow-hidden rounded-xl bg-black relative" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {achievementBanners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="flex-[0_0_100%] min-w-0 relative"
                    >
                      <div
                        onClick={() => setLightboxImage(banner)}
                        className="relative h-[280px] sm:h-[400px] md:h-[480px] w-full cursor-pointer group"
                      >
                        <Image
                          src={banner.src}
                          alt={banner.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 650px"
                          className="object-contain transition-transform duration-700 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

                        {/* Slide Caption Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-3 text-white">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-sm">
                              {banner.year}
                            </span>
                            <h3 className="text-sm sm:text-lg font-sora font-semibold text-white drop-shadow-md">
                              {banner.title}
                            </h3>
                            <p className="text-sm text-slate-200 hidden sm:block">
                              {banner.highlight}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md text-sm font-semibold border border-white/20 group-hover:bg-red-600 transition-colors">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left Arrow Button */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md shadow-lg"
                  aria-label="Previous achievement banner"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Arrow Button */}
                <button
                  onClick={scrollNext}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md shadow-lg"
                  aria-label="Next achievement banner"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails / Dots Pagination Strip */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 pb-1">
                {achievementBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === index
                        ? "w-8 bg-amber-400 border border-amber-300 shadow-md shadow-amber-500/50"
                        : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Achievement Poster Zoom */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center"
          >
            {/* Modal Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#122452]/90 text-white text-sm font-semibold border border-amber-400/40 backdrop-blur-md">
                {lightboxImage.title} ({lightboxImage.year})
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2.5 rounded-xl bg-[#122452] text-white hover:bg-red-600 transition-colors border border-white/20 shadow-xl"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                priority
                sizes="100vw"
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
