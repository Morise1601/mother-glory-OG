"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { GooglePlaceReviewsResponse, GoogleReviewItem } from "@/types/content.types";
import { Star, ExternalLink, ChevronLeft, ChevronRight, MessageSquare, MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface CampusDefaultInfo {
  rating: number;
  userRatingCount: number;
  googleMapsUrl: string;
}

const CAMPUS_INFO: Record<"puducherry" | "karaikal", CampusDefaultInfo> = {
  puducherry: {
    rating: 4.9,
    userRatingCount: 184,
    googleMapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJu_bO33dhUzoR6ULpTx3jkbk",
  },
  karaikal: {
    rating: 4.9,
    userRatingCount: 142,
    googleMapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ0RMnMEwRVToRx6r0pDqIJRo",
  },
};

export default function GoogleReviewsSection() {
  const [data, setData] = useState<GooglePlaceReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCampus, setActiveCampus] = useState<"puducherry" | "karaikal">("puducherry");
  const [activeSlide, setActiveSlide] = useState(0);

  // Embla Carousel with Autoplay (4.5s interval)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
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
      try {
        setActiveSlide(emblaApi.selectedScrollSnap());
      } catch {
        // Fallback
      }
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const selectCampus = (campus: "puducherry" | "karaikal") => {
    if (campus === activeCampus) return;
    setLoading(true);
    setData(null);
    setActiveCampus(campus);
  };

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/reviews?campus=${activeCampus}`)
      .then((res) => res.json())
      .then((resData: GooglePlaceReviewsResponse) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCampus]);

  const campusDefaults = CAMPUS_INFO[activeCampus];
  const reviews: GoogleReviewItem[] = data?.reviews || [];
  const ratingValue = data?.rating || campusDefaults.rating;
  const reviewCount = data?.userRatingCount || campusDefaults.userRatingCount;
  const mapsUrl =
    data?.googleMapsUrl ||
    (activeCampus === "karaikal"
      ? "https://www.google.com/maps/place/?q=place_id:ChIJ0RMnMEwRVToRx6r0pDqIJRo"
      : "https://www.google.com/maps/place/?q=place_id:ChIJu_bO33dhUzoR6ULpTx3jkbk");

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F3] border-t border-[#DFE3EA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#DFE3EA]">
          <div>
            <span className="text-xs font-bold text-[#B68A35] tracking-wide capitalize block mb-1">
              Student & Parent Experiences
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#122452]">
              Verified Google feedback
            </h2>
            <p className="text-xs sm:text-sm text-[#596579] mt-1">
              Real feedback and ratings directly from our Google Business Profiles in Puducherry and Karaikal.
            </p>
          </div>

          {/* Campus Switcher */}
          <div className="inline-flex p-1 bg-white rounded-[8px] border border-[#DFE3EA] self-start sm:self-auto shadow-xs">
            <button
              type="button"
              onClick={() => selectCampus("puducherry")}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                activeCampus === "puducherry"
                  ? "bg-[#122452] text-white shadow-xs"
                  : "text-[#596579] hover:text-[#122452]"
              }`}
            >
              Puducherry
            </button>
            <button
              type="button"
              onClick={() => selectCampus("karaikal")}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                activeCampus === "karaikal"
                  ? "bg-[#122452] text-white shadow-xs"
                  : "text-[#596579] hover:text-[#122452]"
              }`}
            >
              Karaikal
            </button>
          </div>
        </div>

        {/* Aggregate Stats Card */}
        <div className="bg-white rounded-[8px] border border-[#DFE3EA] p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#122452]">
              {ratingValue.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(ratingValue) ? "fill-current text-amber-500" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#596579] mt-0.5">
                Based on {reviewCount} verified reviews on Google Maps
              </p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#FAF8F3] hover:bg-[#122452] text-[#122452] hover:text-white border border-[#DFE3EA] text-xs font-semibold transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
            <span>Read all {reviewCount} reviews on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reviews Content: Testimonial Slider or Fallback Notice */}
        {loading ? (
          <div className="text-center py-12 text-[#596579] text-sm">
            Loading verified reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative group">
            {/* Embla Carousel Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 sm:pl-6 min-w-0"
                  >
                    <article className="h-full bg-white rounded-[8px] border border-[#DFE3EA] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#B68A35]/40 transition-colors">
                      <div className="space-y-3">
                        {/* Rating Stars & Relative Time */}
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? "fill-current text-amber-500" : "text-slate-200"
                              }`}
                            />
                          ))}
                          <span className="text-[11px] text-[#596579] font-medium ml-1">
                            {rev.relativeTimeDescription || "Verified Review"}
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-xs sm:text-sm text-[#172033] leading-relaxed line-clamp-4">
                          &ldquo;{rev.text}&rdquo;
                        </p>
                      </div>

                      {/* Author Info & Attribution */}
                      <div className="pt-3 border-t border-[#DFE3EA] flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          {rev.authorPhotoUrl ? (
                            <div className="relative w-8 h-8 rounded-[8px] overflow-hidden bg-slate-100 shrink-0">
                              <Image
                                src={rev.authorPhotoUrl}
                                unoptimized
                                alt={rev.authorName}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-[8px] bg-[#122452] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {rev.authorName?.charAt(0) || "G"}
                            </div>
                          )}
                          <span className="font-semibold text-[#122452] truncate">
                            {rev.authorName}
                          </span>
                        </div>

                        <a
                          href={rev.sourceUrl || mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#596579] hover:text-[#B68A35] font-medium capitalize tracking-wider flex items-center gap-1 shrink-0"
                        >
                          <span>Google Review</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation Controls */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-between pt-6">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollTo(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        (activeSlide ?? 0) === idx
                          ? "w-6 bg-[#B68A35]"
                          : "w-2 bg-[#DFE3EA] hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Previous review"
                    className="w-8 h-8 rounded-[8px] bg-white border border-[#DFE3EA] hover:bg-[#122452] text-[#122452] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Next review"
                    className="w-8 h-8 rounded-[8px] bg-white border border-[#DFE3EA] hover:bg-[#122452] text-[#122452] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#596579]">
            Google reviews are temporarily unavailable for this campus. Please view our feedback on{' '}
            <a
              className="underline font-semibold text-[#122452] hover:text-[#B68A35]"
              target="_blank"
              rel="noopener noreferrer"
              href={mapsUrl}
            >
              Google Maps
            </a>.
          </div>
        )}
      </div>
    </section>
  );
}
