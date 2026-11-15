"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const testimonialsData = [
  {
    name: "Janaranjani R.",
    role: "NEET Top Scorer • Govt Medical College",
    campus: "Karaikal Campus",
    content: "I'm a NEET aspirant from Mother Glory Karaikal. The coaching gave me crystal clear conceptual learning in Physics & Chemistry. The daily tests gave me the exact speed and confidence to crack NEET on my first attempt!",
    rating: 5,
    score: "NEET 620",
  },
  {
    name: "Ummal Bajiriya",
    role: "Medical College Student",
    campus: "Karaikal Campus",
    content: "Excellent coaching center of Karaikal! Best teaching faculty, detailed NCERT book materials, and exhaustive model question papers. The teachers gave personal attention to each student till exam day.",
    rating: 5,
    score: "MBBS Selection",
  },
  {
    name: "K.S. Prabhu",
    role: "JIPMER & State Ranker",
    campus: "Puducherry Campus",
    content: "Mother Glory's structured DPPs and error review sessions made the biggest difference in my scores. M. Antoine sir's motivation and individual guidance kept us inspired throughout the grueling preparation journey.",
    rating: 5,
    score: "NEET 605",
  },
  {
    name: "Simi P.",
    role: "Repeater Batch Aspirant",
    campus: "Karaikal Campus",
    content: "Classes were amazing and well-structured. Joining the Repeater batch changed my study strategy completely. Highly recommended for any serious medical aspirant in Puducherry or Tamil Nadu.",
    rating: 5,
    score: "Govt Medical Seat",
  },
  {
    name: "Dr. Senthil Kumar (Parent)",
    role: "Parent of 2023 Qualifer",
    campus: "Puducherry Campus",
    content: "The discipline, moral values, and regular mock exams conducted by Mother Glory are exceptional. We are grateful to the management and faculty for securing our daughter's medical seat.",
    rating: 5,
    score: "Centac Merit Seat",
  },
  {
    name: "A. Mohamed Imran",
    role: "NEET Aspirant",
    campus: "Karaikal Campus",
    content: "Biology NCERT line-by-line teaching is unmatched here. The teachers explain diagrams, memory tricks, and high-weightage topics so simply that exam day felt like just another class mock test.",
    rating: 5,
    score: "Top Centac Rank",
  },
];

export default function TestimonialSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: false });

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
    <section id="testimonials" className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Voices of Trust &amp; Success</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sora font-semibold text-[#122452] dark:text-white tracking-tight">
              What Students &amp; Parents <span className="text-red-600 dark:text-red-400">Say About Us</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Real testimonials from medical aspirants and families who realized their doctor dream with Mother Glory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#122452] hover:text-white text-[#122452] dark:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all shadow-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#122452] hover:text-white text-[#122452] dark:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all shadow-md"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122452] text-white text-sm font-semibold hover:bg-red-600 transition-colors border border-amber-400/30 whitespace-nowrap"
            >
              <span>All Testimonials</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>

        {/* Testimonials Slider Viewport */}
        <div className="overflow-hidden py-2" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4">
            {testimonialsData.map((item, idx) => (
              <div
                key={idx}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
              >
                <div className="h-full group p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-600/50 dark:hover:border-red-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#122452]/10 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header Row: Stars + Score Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900">
                        {item.score}
                      </span>
                    </div>

                    <Quote className="w-7 h-7 text-red-600/30 dark:text-red-400/30" />

                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic font-normal">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>

                  {/* Author Row */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#122452] to-red-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {item.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-sora font-semibold text-[#122452] dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                        {item.role} • {item.campus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === index
                  ? "w-8 bg-[#122452] dark:bg-amber-400"
                  : "w-2 bg-slate-300 dark:bg-slate-700"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
