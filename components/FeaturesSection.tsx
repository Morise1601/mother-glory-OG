"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  Bus,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Clock,
  Target,
} from "lucide-react";

export const featuresData = [
  {
    icon: GraduationCap,
    title: "NEET & Medical Entrance Batches",
    category: "Coaching",
    highlight: "16+ Years Medical Legacy",
    description: "Specialized, high-yield coaching for NEET UG, JIPMER, AIIMS, and Centac quota with intensive test drills and chapter-wise question analysis.",
  },
  {
    icon: BookOpen,
    title: "Exhaustive NCERT Modules & DPPs",
    category: "Academics",
    highlight: "Daily Practice Problems",
    description: "Comprehensive NCERT line-by-line study material, error logs, formulas masterbooks, and 15+ years solved medical entrance exam papers.",
  },
  {
    icon: Award,
    title: "All-India Simulated Mock Tests",
    category: "Assessment",
    highlight: "OMR & Negative Marking Analysis",
    description: "Weekly part-tests, monthly revision exams, and 30+ full syllabus mock tests simulating actual NEET exam pressure with detailed rankings.",
  },
  {
    icon: Users,
    title: "Renowned Medical Faculty Team",
    category: "Mentorship",
    highlight: "1-on-1 Doubt Clearing",
    description: "Decades of combined teaching experience in Physics, Chemistry, Botany, and Zoology with personal mentorship for each student.",
  },
  {
    icon: FlaskConical,
    title: "Smart High-Tech Classrooms",
    category: "Infrastructure",
    highlight: "Visual 3D Bio Models",
    description: "Interactive smart boards, 3D anatomical animations, clear chemical reaction mechanisms, and air-conditioned learning spaces.",
  },
  {
    icon: Bus,
    title: "Safe & Extensive Transport Network",
    category: "Campus",
    highlight: "Karaikal & Puducherry Routes",
    description: "Dedicated campus transport covering all major stops across Karaikal, Puducherry, and neighboring districts for secure daily transit.",
  },
  {
    icon: Target,
    title: "Repeater / Dropper Intensive Batch",
    category: "Coaching",
    highlight: "Rank Booster Strategy",
    description: "Full-day rigorous schedule designed specifically for dropper students to convert prior attempts into guaranteed government MBBS seats.",
  },
  {
    icon: Clock,
    title: "Foundation Batches (Class 9 & 10)",
    category: "Academics",
    highlight: "Early Medical Foundation",
    description: "Conceptual clarity and critical thinking development to prepare high school students early for Olympiads, NTSE, and NEET foundations.",
  },
];

export default function FeaturesSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const autoplayPlugin = Autoplay({ delay: 3500, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
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
    <section id="features" className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-[#060a12] text-white">
      {/* Background Subtle Mesh Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#122452]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Academy Features &amp; Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sora font-semibold tracking-tight text-white">
              Designed to <span className="text-amber-400">Inspire &amp; Empower</span> Future Doctors
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Explore our proven teaching methodologies, rigorous test series, and student-focused facilities.
            </p>
          </div>

          {/* Navigation Controls & Link to Full Page */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-red-600 border border-slate-700 text-white flex items-center justify-center transition-all shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-red-600 border border-slate-700 text-white flex items-center justify-center transition-all shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#122452] to-red-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity border border-amber-400/30 whitespace-nowrap"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Slider Viewport */}
        <div className="overflow-hidden py-2" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4">
            {featuresData.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
                >
                  <div className="h-full group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#0c1427] to-slate-950 border border-slate-800 hover:border-red-600/70 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-red-600/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-[#122452] text-white flex items-center justify-center font-semibold border border-amber-400/30 group-hover:bg-red-600 transition-colors shadow-md">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-amber-300 px-3 py-1 rounded-full bg-slate-900 border border-amber-400/30">
                          {item.category}
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-red-400 mb-1">
                        {item.highlight}
                      </div>

                      <h3 className="text-lg sm:text-xl font-sora font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-slate-300 text-sm leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-sm text-slate-400">Available in Puducherry &amp; Karaikal</span>
                      <Link
                        href="/features"
                        className="text-sm font-semibold text-amber-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {featuresData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === index
                  ? "w-8 bg-red-600 border border-amber-400"
                  : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
