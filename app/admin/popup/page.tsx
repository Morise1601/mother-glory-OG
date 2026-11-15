"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageCropperModal from "@/components/admin/ImageCropperModal";
import { reportAdminWarning } from "@/lib/admin/api";
import { WelcomePopupSettings } from "@/types/content.types";
import { INITIAL_WELCOME_POPUP } from "@/lib/data/content-defaults";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  Crop as CropIcon,
  Sparkles,
  Megaphone,
  X,
  ExternalLink,
  MessageSquare,
  Clock,
  Layers,
} from "lucide-react";

export default function AdminWelcomePopupPage() {
  const [popup, setPopup] = useState<WelcomePopupSettings>(INITIAL_WELCOME_POPUP);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Asset Upload & Cropper state
  const [assetTab, setAssetTab] = useState<"file" | "link">("file");
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isUploadingDirect, setIsUploadingDirect] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch initial popup settings on mount
  useEffect(() => {
    let active = true;
    fetch("/api/admin/popup", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (active && res.ok && data.popup) {
          setPopup(data.popup);
          setLoaded(true);
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to load popup configuration.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const updatePopup = (updates: Partial<WelcomePopupSettings>) => {
    setPopup((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Aspect ratio mapping
  const aspectRatioNumeric =
    popup.aspectRatio === "9:16"
      ? 9 / 16
      : popup.aspectRatio === "4:5"
      ? 4 / 5
      : popup.aspectRatio === "1:1"
      ? 1
      : 16 / 9;

  const aspectRatioLabel =
    popup.aspectRatio === "9:16"
      ? "9:16 Story / Tall Poster"
      : popup.aspectRatio === "4:5"
      ? "4:5 Vertical Poster"
      : popup.aspectRatio === "1:1"
      ? "1:1 Square Poster"
      : "16:9 Landscape Banner";

  // Direct 1:1 image upload without cropping (100% original quality, zero distortion)
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file exceeds the 10 MB limit.");
      return;
    }

    setIsUploadingDirect(true);
    setErrorMessage(null);
    try {
      // Inspect natural dimensions to auto-detect aspect ratio
      const objectUrl = URL.createObjectURL(file);
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const testImg = new window.Image();
        testImg.onload = () => resolve({ width: testImg.naturalWidth, height: testImg.naturalHeight });
        testImg.onerror = () => reject(new Error("Failed to inspect poster dimensions."));
        testImg.src = objectUrl;
      }).finally(() => URL.revokeObjectURL(objectUrl));

      const ratio = dimensions.width / dimensions.height;
      let detectedAspect: "16:9" | "4:5" | "9:16" | "1:1" = "4:5";
      if (ratio < 0.65) detectedAspect = "9:16";
      else if (ratio < 0.9) detectedAspect = "4:5";
      else if (ratio < 1.3) detectedAspect = "1:1";
      else detectedAspect = "16:9";

      // Upload directly to server media inventory
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "Welcome Popup Full Poster");
      formData.append("altText", popup.title || "Welcome Advertisement Poster");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const failure = await res.json().catch(() => ({}));
        throw new Error(failure.error || "Unable to upload poster. Please try again.");
      }

      const data = await res.json();
      if (!data.asset?.url) throw new Error("The server did not return a saved poster URL.");

      if (data.auditWarning) reportAdminWarning({ warning: data.auditWarning });

      updatePopup({
        posterImageUrl: data.asset.url,
        aspectRatio: detectedAspect,
      });

      setSavedSuccess(
        `Original poster uploaded at 100% fidelity (${dimensions.width}×${dimensions.height}px, ratio ${detectedAspect})! Click 'Save Changes' to publish.`
      );
      setTimeout(() => setSavedSuccess(null), 5000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error uploading original poster.");
    } finally {
      setIsUploadingDirect(false);
      e.target.value = "";
    }
  };

  // File selection for crop
  const handleFileSelectForCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file exceeds the 10 MB limit.");
      return;
    }

    setIsReadingFile(true);
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setCropperOpen(true);
      setIsReadingFile(false);
      e.target.value = "";
    };
    reader.onerror = () => {
      setErrorMessage("Could not read the selected image file.");
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  // Link input for crop
  const handleLinkInputForCrop = () => {
    const trimmed = linkInputUrl.trim();
    if (!trimmed) {
      setErrorMessage("Please enter an image URL to load and crop.");
      return;
    }
    setCropperImageSrc(trimmed);
    setCropperOpen(true);
  };

  // Crop completion callback
  const handleCropComplete = (croppedUrl: string, auditWarning?: string) => {
    if (auditWarning) reportAdminWarning({ warning: auditWarning });
    updatePopup({ posterImageUrl: croppedUrl });
    setSavedSuccess("Advertisement poster cropped and applied! Click 'Save Changes' to publish live.");
    setTimeout(() => setSavedSuccess(null), 5000);
  };

  // Save changes
  const handleSave = async () => {
    if (!loaded) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popup }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save welcome popup.");

      reportAdminWarning(data);
      setPopup(data.popup);
      setHasUnsavedChanges(false);
      setSavedSuccess("Welcome popup and advertisement poster saved and live on homepage!");
      setTimeout(() => setSavedSuccess(null), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving welcome popup.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminPageWrapper
      title="Welcome Popup & Advertisement Posters"
      primaryAction={
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !loaded}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
            hasUnsavedChanges
              ? "bg-[#B68A35] hover:bg-[#9c7328] ring-2 ring-[#B68A35]/50 ring-offset-2 animate-pulse"
              : "bg-[#122452] hover:bg-[#1b357a]"
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes (Unsaved)" : "Save Changes"}</span>
        </button>
      }
    >
      {savedSuccess && (
        <div className="p-4 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-[8px] bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-7 bg-white rounded-[8px] border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header & Status Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DFE3EA] gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#122452] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#B68A35]" />
                <span>Homepage Welcome Modal</span>
              </h2>
              <p className="text-xs text-[#596579]">
                Configures the advertisement poster displayed to visitors on homepage entry. Posters render full-frame with an 8px border radius.
              </p>
            </div>

            {/* Live Status Switch */}
            <button
              type="button"
              onClick={() => updatePopup({ isEnabled: !popup.isEnabled })}
              className={`px-3.5 py-2 rounded-[8px] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                popup.isEnabled
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
              }`}
              title="Click to toggle whether the popup is shown to visitors"
            >
              {popup.isEnabled ? (
                <>
                  <Eye className="w-4 h-4 text-white" />
                  <span>Enabled (Active)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-amber-700" />
                  <span>Disabled (Hidden)</span>
                </>
              )}
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Headline / Announcement Title *
              </label>
              <input
                type="text"
                value={popup.title}
                onChange={(e) => updatePopup({ title: e.target.value })}
                placeholder="e.g. Admissions Open 2026–2027"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Subtitle / Description */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Subtitle / Description (Optional)
              </label>
              <textarea
                rows={2}
                value={popup.subtitle || ""}
                onChange={(e) => updatePopup({ subtitle: e.target.value })}
                placeholder="Brief summary or special announcement details..."
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
              />
            </div>

            {/* Poster Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1.5">
                Poster Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "16:9", label: "16:9 Landscape" },
                  { id: "4:5", label: "4:5 Portrait" },
                  { id: "9:16", label: "9:16 Tall Story" },
                  { id: "1:1", label: "1:1 Square" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updatePopup({ aspectRatio: item.id as "16:9" | "4:5" | "9:16" | "1:1" })}
                    className={`py-2 px-3 rounded-[8px] text-xs font-medium border text-center transition-all cursor-pointer ${
                      popup.aspectRatio === item.id
                        ? "bg-[#122452] text-white border-[#122452] shadow-xs"
                        : "bg-[#FAF8F3] text-[#596579] border-[#DFE3EA] hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Poster Visual Asset Upload & Cropper */}
            <div className="pt-2 border-t border-[#DFE3EA] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#122452]">
                    Advertisement Poster Image ({aspectRatioLabel})
                  </label>
                  <p className="text-[11px] text-[#596579]">
                    Upload or paste link — both open the interactive {popup.aspectRatio} cropper
                  </p>
                </div>

                {/* Source Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAssetTab("file")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      assetTab === "file"
                        ? "bg-[#122452] text-white shadow-xs"
                        : "text-[#596579] hover:text-[#122452]"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssetTab("link")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      assetTab === "link"
                        ? "bg-[#122452] text-white shadow-xs"
                        : "text-[#596579] hover:text-[#122452]"
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Link</span>
                  </button>
                </div>
              </div>

              {/* Upload File Mode */}
              {assetTab === "file" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Direct Full Poster Upload (Recommended) */}
                  <div className="bg-[#FAF8F3] rounded-[8px] border-2 border-dashed border-[#B68A35]/60 hover:border-[#B68A35] transition-colors p-4 text-center flex flex-col justify-between">
                    <label htmlFor="direct-poster-file-input" className="cursor-pointer block space-y-2 group">
                      <div className="w-10 h-10 rounded-[8px] bg-white border border-[#DFE3EA] text-[#B68A35] group-hover:scale-105 transition-transform mx-auto flex items-center justify-center shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 mb-1 rounded-[4px] bg-[#B68A35]/15 text-[#B68A35] text-[10px] font-bold">
                          Recommended
                        </div>
                        <p className="text-xs font-bold text-[#122452] group-hover:text-[#B68A35] transition-colors">
                          {isUploadingDirect ? "Converting & Uploading..." : "Direct Upload (Full Quality)"}
                        </p>
                        <p className="text-[11px] text-[#596579] mt-0.5">
                          Preserves 100% original poster geometry with zero distortion or crop bars.
                        </p>
                      </div>
                      <input
                        id="direct-poster-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isUploadingDirect || isReadingFile}
                        onChange={handleDirectUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Option 2: Upload & Interactive Cropper */}
                  <div className="bg-[#FAF8F3] rounded-[8px] border-2 border-dashed border-[#DFE3EA] hover:border-[#122452] transition-colors p-4 text-center flex flex-col justify-between">
                    <label htmlFor="poster-file-input" className="cursor-pointer block space-y-2 group">
                      <div className="w-10 h-10 rounded-[8px] bg-white border border-[#DFE3EA] text-[#122452] group-hover:scale-105 transition-transform mx-auto flex items-center justify-center shadow-xs">
                        <CropIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="inline-block px-2 py-0.5 mb-1 rounded-[4px] bg-slate-200 text-slate-700 text-[10px] font-bold">
                          Custom Frame
                        </div>
                        <p className="text-xs font-bold text-[#122452] group-hover:text-[#B68A35] transition-colors">
                          {isReadingFile ? "Reading poster image..." : "Upload & Reframe / Crop"}
                        </p>
                        <p className="text-[11px] text-[#596579] mt-0.5">
                          Opens interactive cropper to pan, zoom, or align into {popup.aspectRatio}.
                        </p>
                      </div>
                      <input
                        id="poster-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isReadingFile || isUploadingDirect}
                        onChange={handleFileSelectForCrop}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Link Mode */}
              {assetTab === "link" && (
                <div className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] p-4 space-y-2">
                  <label className="block text-xs font-semibold text-[#122452]">
                    Paste Poster Image Link
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-3.5 h-3.5 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="https://... or /images/..."
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleLinkInputForCrop();
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-white focus:outline-none focus:border-[#B68A35]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleLinkInputForCrop}
                      className="px-4 py-2 rounded-[8px] bg-[#122452] text-white text-xs font-semibold hover:bg-[#1b357a] transition-colors cursor-pointer"
                    >
                      Crop
                    </button>
                  </div>
                </div>
              )}

              {/* Current Asset Thumbnail & Re-crop */}
              {popup.posterImageUrl && (
                <div className="p-3 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={popup.posterImageUrl}
                        alt="Current Poster"
                        fill
                        unoptimized={popup.posterImageUrl.startsWith("https://")}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#122452] truncate">Active Poster Asset</p>
                      <p className="text-[10px] text-slate-500 truncate">{popup.posterImageUrl}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCropperImageSrc(popup.posterImageUrl);
                      setCropperOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B68A35] hover:bg-white border border-[#B68A35]/30 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <CropIcon className="w-3.5 h-3.5" />
                    <span>Re-Crop</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons Configuration */}
            <div className="pt-2 border-t border-[#DFE3EA] space-y-3">
              <label className="block text-xs font-bold text-[#122452]">Action Buttons & CTAs</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#596579] mb-1">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={popup.ctaLabel || ""}
                    onChange={(e) => updatePopup({ ctaLabel: e.target.value })}
                    placeholder="e.g. Explore Programs"
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#596579] mb-1">
                    CTA Destination Link
                  </label>
                  <input
                    type="text"
                    value={popup.ctaUrl || ""}
                    onChange={(e) => updatePopup({ ctaUrl: e.target.value })}
                    placeholder="e.g. /programs or /contact"
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                  />
                </div>
              </div>

              {/* Include Enquire Now Button */}
              <label className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={popup.showEnquiryButton}
                  onChange={(e) => updatePopup({ showEnquiryButton: e.target.checked })}
                  className="rounded border-[#DFE3EA] text-[#B68A35] focus:ring-[#B68A35] w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#122452] block">
                    Include Direct &quot;Enquire Now&quot; Button
                  </span>
                  <span className="text-[#596579] text-[11px]">
                    Opens the instant admission enquiry popup modal directly when clicked.
                  </span>
                </div>
              </label>
            </div>

            {/* Display Frequency */}
            <div className="pt-2 border-t border-[#DFE3EA] space-y-2">
              <label className="block text-xs font-bold text-[#122452]">Display Frequency</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-[8px] border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                    popup.frequency === "once_per_session"
                      ? "border-[#B68A35] bg-[#FAF8F3]"
                      : "border-[#DFE3EA] bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="popup-frequency"
                    checked={popup.frequency === "once_per_session"}
                    onChange={() => updatePopup({ frequency: "once_per_session" })}
                    className="mt-0.5 text-[#B68A35] focus:ring-[#B68A35]"
                  />
                  <div>
                    <span className="font-bold text-[#122452] block">Once Per Session (Recommended)</span>
                    <span className="text-[11px] text-[#596579]">
                      Shows once when visitor enters site; does not re-interrupt on page reloads.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-[8px] border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                    popup.frequency === "always"
                      ? "border-[#B68A35] bg-[#FAF8F3]"
                      : "border-[#DFE3EA] bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="popup-frequency"
                    checked={popup.frequency === "always"}
                    onChange={() => updatePopup({ frequency: "always" })}
                    className="mt-0.5 text-[#B68A35] focus:ring-[#B68A35]"
                  />
                  <div>
                    <span className="font-bold text-[#122452] block">Always on Homepage Visit</span>
                    <span className="text-[11px] text-[#596579]">
                      Opens whenever visitor navigates to the homepage.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Visual Preview */}
        <div className="lg:col-span-5 bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] p-5 shadow-xs space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE3EA]">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#122452] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#B68A35]" />
                <span>Live Homepage Preview</span>
              </h3>
              <p className="text-[11px] text-[#596579]">Real-time simulation of visitor experience</p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                popup.isEnabled
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {popup.isEnabled ? "LIVE PREVIEW" : "PREVIEW (DISABLED)"}
            </span>
          </div>

          {/* Modal Backdrop Simulation */}
          <div className="relative rounded-[8px] bg-slate-950/85 p-4 sm:p-6 backdrop-blur-md shadow-2xl flex items-center justify-center min-h-[460px]">
            {/* Simulated Modal Card - Strictly 8px Border Radius & Full Poster */}
            <div className="relative w-full max-w-sm bg-black/50 rounded-[8px] overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95">
              {/* Close Button X (8px radius) */}
              <div className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-[8px] bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs cursor-pointer shadow-md border border-white/20">
                <X className="w-3.5 h-3.5" />
              </div>

              {/* Full Poster Asset (No Text Block Underneath) */}
              <div
                className={`relative w-full bg-slate-900 rounded-[8px] overflow-hidden ${
                  popup.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : popup.aspectRatio === "4:5"
                    ? "aspect-[4/5]"
                    : popup.aspectRatio === "1:1"
                    ? "aspect-square"
                    : "aspect-[16/9]"
                }`}
              >
                {popup.posterImageUrl ? (
                  <Image
                    src={popup.posterImageUrl}
                    alt={popup.posterAltText || popup.title}
                    fill
                    unoptimized={popup.posterImageUrl.startsWith("https://")}
                    className="object-cover rounded-[8px]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 p-4 text-center">
                    <Megaphone className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">No Poster Image Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        aspectRatio={aspectRatioNumeric}
        aspectRatioLabel={aspectRatioLabel}
        onCropComplete={handleCropComplete}
        onClose={() => setCropperOpen(false)}
      />
    </AdminPageWrapper>
  );
}
