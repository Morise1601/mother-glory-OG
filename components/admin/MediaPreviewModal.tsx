"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MediaAsset } from "@/lib/data/media";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  Archive,
  Lock,
  Maximize2,
  Sparkles,
} from "lucide-react";

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (asset: MediaAsset) => void;
}

export default function MediaPreviewModal({
  asset,
  isOpen,
  onClose,
  onDelete,
}: MediaPreviewModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<"contain" | "cover">("contain");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  const copyToClipboard = async (text: string, type: "link" | "name" | "alt") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else if (type === "name") {
        setCopiedName(true);
        setTimeout(() => setCopiedName(false), 2000);
      } else {
        setCopiedAlt(true);
        setTimeout(() => setCopiedAlt(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const formattedSize =
    asset.bytes > 1024 * 1024
      ? `${(asset.bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(asset.bytes / 1024)} KB`;

  const formattedDate = new Date(asset.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c1836]/75 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FAF8F3] border border-[#DFE3EA] shadow-2xl z-10 overflow-hidden transition-all duration-200 animate-in zoom-in-95">
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 px-6 border-b border-[#DFE3EA] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#122452]/5 border border-[#122452]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#B68A35]" />
            </div>
            <div className="min-w-0">
              <h2
                id="media-preview-title"
                className="font-serif font-bold text-base sm:text-lg text-[#122452] truncate"
                title={asset.filename}
              >
                {asset.filename}
              </h2>
              <p className="text-[11px] text-[#596579]">
                Media Asset Details & High-Resolution Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#596579] hover:text-[#122452] hover:bg-slate-100 border border-transparent hover:border-[#DFE3EA] transition-all cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Big Visual Showcase (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-[#DFE3EA] shadow-inner flex items-center justify-center group select-none">
                {asset.mimeType.startsWith('video/') ? <video src={asset.url} controls className="w-full h-full object-contain" preload="metadata" /> : <Image
                  src={asset.url}
                  unoptimized
                  alt={asset.altText || asset.filename}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className={`${
                    zoomLevel === "contain" ? "object-contain p-2" : "object-cover"
                  } transition-all duration-300`}
                />}

                {/* View Controls Pill */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/15 text-white text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((prev) => (prev === "contain" ? "cover" : "contain"))
                    }
                    className="px-2 py-1 rounded hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#B68A35]" />
                    <span>Fit: {zoomLevel === "contain" ? "Contain" : "Cover"}</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {asset.referencesCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" />
                      In use ({asset.referencesCount} locations)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-slate-800/80 backdrop-blur-md text-white text-[10px] font-medium shadow-sm">
                      Unused Asset
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions Row below Image */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#122452] hover:text-[#B68A35] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B68A35]" />
                  <span>Open Original File</span>
                </a>

                <a
                  href={`/api/admin/media/${encodeURIComponent(asset.id)}/download`}
                  download={asset.filename}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596579] hover:text-[#122452] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
              </div>
            </div>

            {/* Right: Asset Properties & Copy Links (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* 1. File Name Block */}
              <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#596579] uppercase tracking-wider">
                    File Name
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.filename, "name")}
                    className="text-[11px] font-semibold text-[#B68A35] hover:text-[#9c7328] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedName ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-[#122452] font-semibold break-all bg-[#FAF8F3] p-2 rounded-lg border border-[#DFE3EA]">
                  {asset.filename}
                </p>
              </div>

              {/* 2. Alt Text Block */}
              <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#596579] uppercase tracking-wider">
                    Alt Name / Description
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.altText || asset.filename, "alt")}
                    className="text-[11px] font-semibold text-[#B68A35] hover:text-[#9c7328] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAlt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#172033] leading-relaxed bg-[#FAF8F3] p-2.5 rounded-lg border border-[#DFE3EA]">
                  {asset.altText || "(No alt text specified)"}
                </p>
              </div>

              {/* 3. Asset Link / URL Block */}
              <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#596579] uppercase tracking-wider">
                    Asset Link / URL
                  </span>
                  <span className="text-[10px] text-slate-400">Direct Web Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={asset.url}
                    className="w-full font-mono text-xs text-[#122452] bg-[#FAF8F3] px-3 py-2 rounded-xl border border-[#DFE3EA] truncate select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.url, "link")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-[#B68A35] hover:bg-[#9c7328] text-white shadow-xs"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4. Metadata Details Grid */}
              <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 shadow-xs space-y-2.5 text-xs">
                <span className="text-[11px] font-bold text-[#596579] uppercase tracking-wider block mb-1">
                  Asset Metadata
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA]/70">
                    <span className="text-[10px] text-[#596579] block">File Size</span>
                    <span className="font-semibold text-[#122452]">{formattedSize}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA]/70">
                    <span className="text-[10px] text-[#596579] block">Format</span>
                    <span className="font-semibold text-[#122452] uppercase">
                      {asset.mimeType.replace(/^(image|video)\//, "")}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA]/70">
                    <span className="text-[10px] text-[#596579] block">Dimensions</span>
                    <span className="font-semibold text-[#122452]">
                      {asset.width && asset.height
                        ? `${asset.width} × ${asset.height} px`
                        : "Responsive"}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA]/70">
                    <span className="text-[10px] text-[#596579] block">Uploaded</span>
                    <span className="font-semibold text-[#122452]">{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 px-6 border-t border-[#DFE3EA] bg-white flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(asset);
              }}
              disabled={asset.referencesCount > 0}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                asset.referencesCount > 0
                  ? "Cannot archive asset while referenced in pages"
                  : "Remove this asset from the library; stored file is retained"
              }
            >
              <Archive className="w-3.5 h-3.5 text-rose-600" />
              <span>Remove from Library</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#DFE3EA] text-xs sm:text-sm font-semibold text-[#122452] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(asset.url, "link")}
              className="px-5 py-2 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Asset Link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

