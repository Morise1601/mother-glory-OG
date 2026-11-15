"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Achievement } from "@/types/content.types";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar, MapPin } from "lucide-react";

interface PosterLightboxProps {
  achievement: Achievement | null;
  allAchievements?: Achievement[];
  onClose: () => void;
  onNavigate?: (achievement: Achievement) => void;
}

export default function PosterLightbox({
  achievement,
  allAchievements = [],
  onClose,
  onNavigate,
}: PosterLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = allAchievements.findIndex((a) => a.id === achievement?.id);

  const handlePrev = useCallback(() => {
    if (!onNavigate || allAchievements.length <= 1 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + allAchievements.length) % allAchievements.length;
    setZoomLevel(1);
    onNavigate(allAchievements[prevIdx]);
  }, [allAchievements, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (!onNavigate || allAchievements.length <= 1 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % allAchievements.length;
    setZoomLevel(1);
    onNavigate(allAchievements[nextIdx]);
  }, [allAchievements, currentIndex, onNavigate]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!achievement) return;

    // Save previous active element to restore focus
    const previousActive = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActive?.focus();
    };
  }, [achievement, onClose, handlePrev, handleNext]);

  if (!achievement) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Achievement Poster: ${achievement.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-white/20"
      >
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFE3EA] bg-[#FAF8F3]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-[#122452] text-white text-xs font-semibold">
              {achievement.category}
            </span>
            <span className="text-xs text-[#596579] font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#B68A35]" />
              {achievement.year}
            </span>
            <span className="hidden sm:inline-flex text-xs text-[#596579] font-medium items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
              {achievement.campus} Campus
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
              className="p-1.5 rounded-lg hover:bg-white text-[#596579] hover:text-[#122452] border border-[#DFE3EA]"
              aria-label="Zoom In"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-1.5 rounded-lg hover:bg-white text-[#596579] hover:text-[#122452] border border-[#DFE3EA]"
              aria-label="Zoom Out"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-50 text-[#596579] hover:text-red-600 border border-[#DFE3EA] transition-colors ml-2"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Viewer Container */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[440px] max-h-[60vh] bg-slate-900 overflow-auto flex items-center justify-center p-4">
          <div
            className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="relative max-w-full max-h-[56vh] w-auto h-auto">
              <Image
                src={achievement.imageUrl}
                unoptimized={achievement.imageUrl.startsWith('https://')}
                alt={achievement.altText || achievement.title}
                width={800}
                height={1100}
                className="object-contain max-h-[56vh] w-auto rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Previous / Next Overlays */}
          {allAchievements.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white shadow-lg border border-white/20 transition-all focus:outline-none"
                aria-label="Previous Achievement Poster"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white shadow-lg border border-white/20 transition-all focus:outline-none"
                aria-label="Next Achievement Poster"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Poster Caption / Details */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#DFE3EA] space-y-2">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#122452]">
            {achievement.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
            {achievement.caption || achievement.summary}
          </p>
          {achievement.verificationStatus === "verified" && (
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verified Institutional Record • Puducherry & Karaikal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

