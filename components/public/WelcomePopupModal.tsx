"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WelcomePopupSettings } from "@/types/content.types";
import { X } from "lucide-react";

interface WelcomePopupModalProps {
  popup: WelcomePopupSettings | null;
  onOpenEnquiry?: (program?: string) => void;
}

export default function WelcomePopupModal({
  popup,
  onOpenEnquiry,
}: WelcomePopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(
    popup?.posterImageUrl || "/images/hero_banner_mg.webp"
  );

  // Synchronize image source if popup changes
  useEffect(() => {
    if (popup?.posterImageUrl) {
      setImgSrc(popup.posterImageUrl);
    }
  }, [popup?.posterImageUrl]);

  // Check display eligibility and trigger entrance delay
  useEffect(() => {
    if (!popup || !popup.isEnabled) return;

    // Check preview query override
    const isPreview =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("preview_popup");

    if (!isPreview && popup.frequency === "once_per_session") {
      try {
        const sessionKey = `mg_welcome_popup_v${popup.version || 1}_${popup.updatedAt || ""}`;
        const seen = sessionStorage.getItem(sessionKey);
        if (seen) return;
      } catch {
        // Fallback if sessionStorage is restricted
      }
    }

    // Smooth 300ms entrance delay for page arrival
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [popup]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (popup && popup.frequency === "once_per_session") {
      try {
        const sessionKey = `mg_welcome_popup_v${popup.version || 1}_${popup.updatedAt || ""}`;
        sessionStorage.setItem(sessionKey, "true");
      } catch {
        // Ignore storage errors
      }
    }
  }, [popup]);

  // Handle escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !popup || !popup.isEnabled) {
    return null;
  }

  const handleEnquiryClick = () => {
    handleClose();
    if (onOpenEnquiry) {
      onOpenEnquiry();
    }
  };

  const posterImg = (
    <img
      src={imgSrc}
      alt={popup.posterAltText || popup.title || "Mother Glory Announcement"}
      onError={() => setImgSrc("/images/hero_banner_mg.webp")}
      className="block w-auto h-auto max-h-[88vh] max-w-[min(92vw,620px)] object-contain rounded-[8px] shadow-2xl"
    />
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none"
      onClick={handleClose}
    >
      {/* Modal Dialog Container - Hugs the image tightly with zero dead space or bars */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-fit h-fit max-h-[90vh] max-w-[min(92vw,620px)] rounded-[8px] overflow-hidden shadow-2xl border border-white/20 bg-transparent animate-in zoom-in-95 fade-in duration-300 flex items-center justify-center"
      >
        {/* Floating Close Button X - Positioned cleanly on the top-right corner of the poster */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close welcome advertisement"
          className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-[8px] bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-md cursor-pointer shadow-lg transition-transform hover:scale-105 border border-white/25"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Full Poster Display (Zero Text Overlay) */}
        {popup.ctaUrl && popup.ctaUrl !== "#" ? (
          <Link
            href={popup.ctaUrl}
            onClick={handleClose}
            className="block cursor-pointer rounded-[8px] overflow-hidden"
            aria-label={popup.title || "View details"}
          >
            {posterImg}
          </Link>
        ) : popup.showEnquiryButton ? (
          <div
            onClick={handleEnquiryClick}
            className="block cursor-pointer rounded-[8px] overflow-hidden"
            title="Click to Enquire"
          >
            {posterImg}
          </div>
        ) : (
          <div className="block rounded-[8px] overflow-hidden">
            {posterImg}
          </div>
        )}
      </div>
    </div>
  );
}
