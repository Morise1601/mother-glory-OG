"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-text"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Floating Previous & Next Navigation Arrows on Screen Edges */}
      {allAchievements.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-[8px] bg-black/70 hover:bg-black text-white shadow-2xl border border-white/20 transition-all hover:scale-110 cursor-pointer focus:outline-none"
            aria-label="Previous Poster"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-[8px] bg-black/70 hover:bg-black text-white shadow-2xl border border-white/20 transition-all hover:scale-110 cursor-pointer focus:outline-none"
            aria-label="Next Poster"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Modal Dialog: Snugly Hugs the Image (No Giant Empty Boxes) with Strict 8px Border Radius */}
      <div
        ref={modalRef}
        className="relative max-w-[94vw] max-h-[94vh] flex flex-col items-center justify-center rounded-[8px] overflow-hidden bg-slate-950 border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Controls (Close & Zoom) */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
            className="p-2 rounded-[8px] bg-black/70 hover:bg-black text-white border border-white/20 shadow-lg transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Zoom In"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-2 rounded-[8px] bg-black/70 hover:bg-black text-white border border-white/20 shadow-lg transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Zoom Out"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {zoomLevel !== 1 && (
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-[8px] bg-black/70 text-white border border-white/20 hover:bg-black transition-all"
            >
              Reset
            </button>
          )}
          {/* Close Button with strict 8px border radius */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-[8px] bg-black/70 hover:bg-red-600 text-white border border-white/20 hover:border-red-500 shadow-lg transition-all ml-1 cursor-pointer backdrop-blur-xs"
            aria-label="Close Preview"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Poster Image Stage: Huge, Centered, Crisp, Fitting Natural Proportions */}
        <div className="relative flex items-center justify-center overflow-auto max-h-[78vh] sm:max-h-[82vh] max-w-[94vw] p-2 sm:p-3 bg-slate-950">
          <img
            src={achievement.imageUrl}
            alt={achievement.altText || achievement.title}
            className="max-h-[76vh] sm:max-h-[80vh] max-w-[92vw] w-auto h-auto object-contain block rounded-[8px] shadow-2xl transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          />
        </div>

        {/* Compact Attached Caption Strip at Bottom of Modal */}
        <div className="w-full bg-slate-950/95 border-t border-white/10 px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white rounded-b-[8px] shrink-0">
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-[4px] bg-[#B68A35] text-white text-[11px] font-bold shadow-xs">
                {achievement.category}
              </span>
              <span className="text-xs text-white/80 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#B68A35]" />
                Academic Year {achievement.year}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-white/80 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#B68A35]" />
                {achievement.campus} Campus
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate mt-0.5">
              {achievement.title}
            </h3>
            {achievement.caption && (
              <p className="text-xs text-white/70 line-clamp-1">
                {achievement.caption}
              </p>
            )}
          </div>

          {achievement.verificationStatus === "verified" && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-[6px] shrink-0 self-start sm:self-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Institutional Record</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
