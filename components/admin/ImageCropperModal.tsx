"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop as CropIcon,
  Loader2,
  Move,
} from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  aspectRatio?: number; // e.g. 16/9
  aspectRatioLabel?: string;
  onCropComplete: (croppedUrl: string, auditWarning?: string) => void | Promise<void>;
  onClose: () => void;
}

export default function ImageCropperModal(props: ImageCropperModalProps) {
  return props.isOpen && props.imageSrc ? <CropperContent key={props.imageSrc} {...props} /> : null;
}

function CropperContent({
  isOpen,
  imageSrc,
  aspectRatio = 16 / 9,
  aspectRatioLabel = "16:9 Landscape",
  onCropComplete,
  onClose,
}: ImageCropperModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
    setImageError(null);
  };

  const handleImageError = () => {
    setImageError("Failed to load image. If using a remote link, please check the URL or try uploading the file directly.");
    setImageLoaded(false);
  };

  // Mouse / Touch drag to pan image
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Execute crop to exact 16:9 canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;

    setIsProcessing(true);
    try {
      const img = imageRef.current;
      const cropContainer = containerRef.current;
      const containerRect = cropContainer.getBoundingClientRect();

      // Desired export dimensions maintaining exact chosen aspect ratio without distortion
      let outputWidth = 1920;
      let outputHeight = Math.round(outputWidth / aspectRatio);
      if (aspectRatio < 1) {
        // Vertical flyer (e.g. 9:16 -> 1080x1920, 4:5 -> 1536x1920)
        outputHeight = 1920;
        outputWidth = Math.round(outputHeight * aspectRatio);
      } else if (aspectRatio === 1) {
        outputWidth = 1200;
        outputHeight = 1200;
      }

      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context initialization failed.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Uniform scaling to preserve natural aspect ratio without stretching
      const scaleRatio = outputWidth / containerRect.width;

      const unscaledWidth = img.clientWidth || (img.naturalWidth ? (img.naturalWidth / img.naturalHeight) * containerRect.height : containerRect.width);
      const unscaledHeight = img.clientHeight || (img.naturalHeight ? (img.naturalHeight / img.naturalWidth) * containerRect.width : containerRect.height);
      const displayedWidth = unscaledWidth * scale;
      const displayedHeight = unscaledHeight * scale;

      // Center offset + pan position in canvas coordinates
      const drawX = ((containerRect.width - displayedWidth) / 2 + position.x) * scaleRatio;
      const drawY = ((containerRect.height - displayedHeight) / 2 + position.y) * scaleRatio;
      const drawW = displayedWidth * scaleRatio;
      const drawH = displayedHeight * scaleRatio;

      // Clear canvas cleanly without baking artificial background bars
      ctx.clearRect(0, 0, outputWidth, outputHeight);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Convert to WebP blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to export canvas to WebP"))),
          "image/webp",
          0.92
        );
      });

      // Upload to server media inventory
      const formData = new FormData();
      const aspectTag = aspectRatioLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `crop_${aspectTag}_${Date.now()}.webp`;
      formData.append("file", blob, filename);
      formData.append("purpose", `Cropped ${aspectRatioLabel} Asset`);
      formData.append("altText", `Cropped ${aspectRatioLabel} Asset`);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const failure = await res.json().catch(() => ({}));
        throw new Error(failure.error || 'Unable to upload the cropped banner. Please try again.');
      } else {
        const data = await res.json();
        if (!data.asset?.url) throw new Error('The server did not return a saved banner URL. Please retry.');
        await onCropComplete(data.asset.url, data.auditWarning);
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error cropping image";
      setImageError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
    >
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-[#0c1836]/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
      />

      {/* Cropper Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FAF8F3] border border-[#DFE3EA] shadow-2xl z-10 overflow-hidden transition-all animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 px-6 border-b border-[#DFE3EA] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B68A35]/10 border border-[#B68A35]/20 flex items-center justify-center shrink-0">
              <CropIcon className="w-5 h-5 text-[#B68A35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="cropper-title"
                  className="font-serif font-bold text-base sm:text-lg text-[#122452]"
                >
                  Crop Banner Image
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#122452] text-white text-[10px] font-semibold tracking-wide uppercase font-mono">
                  {aspectRatioLabel}
                </span>
              </div>
              <p className="text-[11px] text-[#596579]">
                Drag to reposition • Use slider to zoom • Output formatted as high-res 16:9 WebP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-[#596579] hover:text-[#122452] hover:bg-slate-100 border border-transparent hover:border-[#DFE3EA] transition-all cursor-pointer disabled:opacity-40"
            aria-label="Close Cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center space-y-4">
          {imageError && (
            <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
              <span>{imageError}</span>
            </div>
          )}

          {/* Constrained Viewport Frame matching target aspect ratio */}
          <div className="w-full flex flex-col items-center justify-center">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                aspectRatio: `${aspectRatio}`,
                maxHeight: "56vh",
                width: aspectRatio >= 1 ? "100%" : "auto",
                maxWidth: aspectRatio >= 1 ? "720px" : "min(85vw, 380px)",
              }}
              className="relative rounded-[8px] overflow-hidden bg-slate-950 border-2 border-[#B68A35] shadow-xl flex items-center justify-center cursor-move select-none touch-none group mx-auto"
            >
              {/* Image being cropped */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />

              {/* Rule of Thirds Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>

              {/* Pan Drag Hint */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Move className="w-3 h-3 text-[#B68A35]" />
                <span>Drag to align</span>
              </div>

              {/* Natural Size Indicator */}
              {imageLoaded && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-mono opacity-75 pointer-events-none">
                  Original: {naturalSize.width} × {naturalSize.height} px
                </div>
              )}
            </div>

            {/* Controls Bar: Zoom Slider & Actions */}
            <div className="w-full mt-4 bg-white rounded-[8px] border border-[#DFE3EA] p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Zoom Controls */}
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.max(1, Number((prev - 0.1).toFixed(2))))}
                  className="p-1.5 rounded-lg text-[#596579] hover:text-[#122452] hover:bg-slate-100 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#B68A35] cursor-pointer"
                  aria-label="Zoom Image"
                />

                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.min(3, Number((prev + 0.1).toFixed(2))))}
                  className="p-1.5 rounded-lg text-[#596579] hover:text-[#122452] hover:bg-slate-100 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <span className="font-mono text-xs font-semibold text-[#122452] w-12 text-right">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              {/* Reset Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-[#DFE3EA] text-xs font-medium text-[#596579] hover:text-[#122452] hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-[#DFE3EA] bg-white flex items-center justify-between gap-3">
          <div className="text-xs text-[#596579] hidden sm:block">
            Target Output: <strong className="text-[#122452]">1920 × 1080 (16:9 WebP)</strong>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-[#DFE3EA] text-xs sm:text-sm font-semibold text-[#122452] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={!imageLoaded || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cropping & Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Crop & Apply Banner</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

