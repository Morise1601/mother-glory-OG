"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/types/content.types";
import { adminRequest } from "@/lib/admin/api";
import { isSafeDestination } from "@/lib/validation/schemas";
import {
  Upload,
  FolderOpen,
  Link as LinkIcon,
  X,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface ImageAssetFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  onAltTextSuggested?: (suggestedAlt: string) => void;
  className?: string;
}

export default function ImageAssetField({
  value,
  onChange,
  label = "Image asset",
  onAltTextSuggested,
  className = "",
}: ImageAssetFieldProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [draftUrl, setDraftUrl] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync draftUrl when value prop changes externally
  useEffect(() => {
    setDraftUrl(value);
  }, [value]);

  // Load existing media library assets
  useEffect(() => {
    adminRequest<{ media: MediaAsset[] }>("/api/admin/media")
      .then((result) => {
        setMedia(
          result.media.filter(
            (asset) => asset.mimeType.startsWith("image/") && asset.isPublic
          )
        );
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image file exceeds the 10 MB limit.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", `${label} Upload`);
      formData.append("altText", cleanName || "Achievement poster");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      const uploadedUrl = data.asset.url;
      onChange(uploadedUrl);

      // Auto-suggest alt text to the parent component if available
      if (onAltTextSuggested && cleanName) {
        onAltTextSuggested(cleanName);
      }

      setUploadSuccess("Image uploaded and converted to WebP successfully!");
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file.";
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleUrlBlur = () => {
    const trimmed = draftUrl.trim();
    if (!trimmed) {
      setError(null);
      onChange("");
      return;
    }
    if (isSafeDestination(trimmed)) {
      setError(null);
      onChange(trimmed);
    } else {
      setError("Enter an image path beginning with / or a secure HTTPS URL.");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#122452]">
          {label} <span className="text-red-500">*</span>
        </label>

        {/* Alternate source tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA]">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "upload"
                ? "bg-[#122452] text-white shadow-xs"
                : "text-[#596579] hover:text-[#122452]"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "library"
                ? "bg-[#122452] text-white shadow-xs"
                : "text-[#596579] hover:text-[#122452]"
            }`}
          >
            <FolderOpen className="w-3 h-3" />
            <span>Media Library</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "url"
                ? "bg-[#122452] text-white shadow-xs"
                : "text-[#596579] hover:text-[#122452]"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>URL Link</span>
          </button>
        </div>
      </div>

      {/* Active Selected Image Banner */}
      {value ? (
        <div className="p-3 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-16 h-14 rounded-[8px] overflow-hidden bg-slate-900 border border-[#DFE3EA] shrink-0">
              <Image
                src={value}
                alt="Selected asset"
                fill
                unoptimized={value.startsWith("https://")}
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Image Attached</span>
              </div>
              <p className="text-xs text-[#172033] font-mono truncate max-w-xs sm:max-w-md">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-[8px] text-xs font-semibold text-[#122452] bg-white border border-[#DFE3EA] hover:border-[#122452] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? "animate-spin" : ""}`} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              aria-label="Remove image"
              className="p-1.5 rounded-[8px] text-[#596579] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Tab 1: Direct File Upload Dropzone (Default) */}
      {activeTab === "upload" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[8px] p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-[#B68A35] bg-[#FAF8F3]"
              : "border-[#DFE3EA] bg-[#FAF8F3]/60 hover:border-[#122452] hover:bg-[#FAF8F3]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#B68A35]" />
              <p className="text-xs font-bold text-[#122452]">
                Converting &amp; Uploading Achievement Image...
              </p>
              <p className="text-[11px] text-[#596579]">
                Optimizing to WebP format for fast loading
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-11 h-11 rounded-[8px] bg-white border border-[#DFE3EA] flex items-center justify-center text-[#B68A35] shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#122452]">
                  Click to browse <span className="font-normal text-[#596579]">or drag and drop achievement image</span>
                </p>
                <p className="text-[11px] text-[#596579] mt-0.5">
                  Supports JPG, PNG, or WebP up to 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Media Library Dropdown */}
      {activeTab === "library" && (
        <div className="p-3 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] space-y-2">
          <label className="block text-[11px] font-semibold text-[#596579]">
            Select from previously uploaded media
          </label>
          <select
            aria-label={`${label} from media library`}
            value={media.some((asset) => asset.url === value) ? value : ""}
            onChange={(event) => {
              if (event.target.value) {
                onChange(event.target.value);
                const selected = media.find((m) => m.url === event.target.value);
                if (selected?.altText && onAltTextSuggested) {
                  onAltTextSuggested(selected.altText);
                }
              }
            }}
            className="w-full p-2.5 rounded-[8px] border border-[#DFE3EA] bg-white text-xs text-[#172033] focus:border-[#B68A35] focus:outline-none"
          >
            <option value="">-- Choose an uploaded public image ({media.length} available) --</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.url}>
                {asset.filename || asset.altText} ({asset.mimeType})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab 3: URL Direct Input */}
      {activeTab === "url" && (
        <div className="p-3 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] space-y-2">
          <label className="block text-[11px] font-semibold text-[#596579]">
            Paste public image path or secure HTTPS URL
          </label>
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              aria-label={`${label} URL`}
              type="text"
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="/images/achievements/photo.webp or https://..."
              className="w-full pl-9 pr-3 py-2.5 rounded-[8px] border border-[#DFE3EA] bg-white text-xs text-[#172033] focus:border-[#B68A35] focus:outline-none font-normal"
            />
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 p-2 rounded-[8px] border border-red-200">
          {error}
        </p>
      )}
      {uploadSuccess && (
        <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-[8px] border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadSuccess}</span>
        </p>
      )}
    </div>
  );
}
