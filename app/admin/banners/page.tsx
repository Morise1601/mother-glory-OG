"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageCropperModal from "@/components/admin/ImageCropperModal";
import PageLoader from "@/components/ui/PageLoader";
import { adminRequest, reportAdminWarning } from "@/lib/admin/api";
import { BannerSlide } from "@/types/content.types";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Save,
  ImageIcon,
  Upload,
  Link as LinkIcon,
  Crop as CropIcon,
  Layers,
  Loader2,
} from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [selectedBannerId, setSelectedBannerId] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 16:9 Image Cropper States
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [assetTab, setAssetTab] = useState<"file" | "link" | "preset">("file");
  const [isReadingFile, setIsReadingFile] = useState(false);

  useEffect(() => {
    adminRequest<{ banners: BannerSlide[] }>("/api/admin/banners").then(data => {
      setBanners(data.banners);
      setSelectedBannerId(data.banners[0]?.id || "");
      setLoaded(true);
    }).catch(error => setErrorMessage(error.message));
  }, []);

  const selectedBanner = banners.find((b) => b.id === selectedBannerId) || banners[0] || null;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index - 1];
    newBanners[index - 1] = newBanners[index];
    newBanners[index] = temp;
    newBanners.forEach((b, idx) => (b.sortOrder = idx + 1));
    setBanners(newBanners);
  };

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index + 1];
    newBanners[index + 1] = newBanners[index];
    newBanners[index] = temp;
    newBanners.forEach((b, idx) => (b.sortOrder = idx + 1));
    setBanners(newBanners);
  };

  const updateSelected = (updates: Partial<BannerSlide>) => {
    if (!selectedBannerId) return;
    setBanners((prev) =>
      prev.map((b) => (b.id === selectedBannerId ? { ...b, ...updates } : b))
    );
  };

  // Handle file upload and trigger 16:9 cropper
  const handleFileSelectForCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Invalid file type. Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds the maximum 10 MB limit.");
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropperImageSrc(reader.result);
        setCropperOpen(true);
      }
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setErrorMessage("Could not read image file.");
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle URL link input and trigger 16:9 cropper
  const handleLinkInputForCrop = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    const trimmed = linkInputUrl.trim();
    if (!trimmed) {
      setErrorMessage("Please enter an image URL to load and crop.");
      return;
    }
    setCropperImageSrc(trimmed);
    setCropperOpen(true);
  };

  // Handle re-cropping the active banner image
  const handleCropCurrentAsset = () => {
    if (selectedBanner?.desktopImageUrl) {
      setCropperImageSrc(selectedBanner.desktopImageUrl);
      setCropperOpen(true);
    }
  };

  // Handle crop completion: save cropped WebP asset to slide and ensure it is marked visible
  const handleCropComplete = (croppedUrl: string, auditWarning?: string) => {
    if (auditWarning) reportAdminWarning({ warning: auditWarning });
    updateSelected({ desktopImageUrl: croppedUrl, status: "visible" });
    setSavedSuccess("16:9 banner image cropped, converted to WebP, and set to Visible! Remember to click 'Save Changes'.");
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  // Trigger delete confirmation dialog
  const handleRemoveBanner = (id: string, title?: string) => {
    setDeleteTarget({ id, title: title || "this slide" });
  };

  // Confirmed delete execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const { id, title } = deleteTarget;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, version: banners.find(b => b.id === id)?.version }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove banner from server.");
      }

      reportAdminWarning(await res.json());
      const remaining = banners.filter(b => b.id !== id);
      setBanners(remaining);
      if (selectedBannerId === id) setSelectedBannerId(remaining[0]?.id || "");
      setSavedSuccess(`Banner "${title}" removed successfully.`);
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting banner";
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Add new banner functionality
  const handleAddBanner = async () => {
    if (!loaded) return;
    setErrorMessage(null);
    const newSortOrder = banners.length + 1;
    const tempId = `banner-${Date.now()}`;

    const newSlide: BannerSlide = {
      id: tempId,
      title: "New Highlight Banner",
      description: "Focused guidance and disciplined preparation for medical entrance success.",
      desktopImageUrl: "/images/hero_banner_mg.webp",
      focalPoint: "center",
      ctaLabel: "Explore Programs",
      ctaUrl: "/programs",
      secondaryCtaLabel: "Contact Admissions",
      secondaryCtaUrl: "/contact",
      status: "visible",
      sortOrder: newSortOrder,
      version: 1,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", banner: newSlide }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create banner.");
      reportAdminWarning(data);
      setBanners(prev => [...prev, data.banner]);
      setSelectedBannerId(data.banner.id);

      setSavedSuccess("New banner slide created. You can now edit its details.");
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create banner.");
    }
  };

  // Save all banner modifications
  const handleSaveAll = async () => {
    if (!loaded) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", banners }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save banners.");
      }

      const saved = await res.json();
      reportAdminWarning(saved);
      setBanners(saved.banners);
      setSavedSuccess("Homepage banner sequence and configurations saved successfully!");
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving banners";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminPageWrapper
      title="Banner Manager"
      primaryAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddBanner}
            disabled={!loaded}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#122452] border border-[#DFE3EA] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#B68A35]" />
            <span>Add Slide</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving || !loaded}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      }
    >
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!loaded ? (
        <PageLoader fullScreen={false} size={200} />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reorderable Banner Slides List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE3EA] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE3EA]">
            <div>
              <h2 className="font-serif font-bold text-base text-[#122452]">
                Banner Slides ({banners.length})
              </h2>
              <span className="text-[11px] text-[#596579]">Drag or use arrows to reorder</span>
            </div>
            <button
              type="button"
              onClick={handleAddBanner}
              className="text-xs font-semibold text-[#B68A35] hover:text-[#9c7328] flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#FAF8F3] rounded-xl border border-dashed border-[#DFE3EA] space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#596579]">
                No banner slides are currently configured.
              </p>
              <button
                type="button"
                onClick={handleAddBanner}
                className="px-4 py-2 rounded-xl bg-[#B68A35] text-white text-xs font-semibold shadow-xs hover:bg-[#9c7328] transition-colors"
              >
                Add First Banner Slide
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((slide, idx) => {
                const isSelected = slide.id === selectedBannerId;
                return (
                  <div
                    key={slide.id}
                    onClick={() => setSelectedBannerId(slide.id)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? "border-[#B68A35] bg-[#FAF8F3] shadow-xs"
                        : "border-[#DFE3EA] hover:border-slate-400 bg-white"
                    }`}
                  >
                    {/* Thumbnail & Order */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#122452] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                        <Image
                          src={slide.desktopImageUrl}
                unoptimized={slide.desktopImageUrl.startsWith('https://')}
                          alt={slide.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate min-w-0">
                        <p className="font-serif font-bold text-xs text-[#122452] truncate">
                          {slide.title}
                        </p>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {slide.ctaLabel} → {slide.ctaUrl}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Reorder, Visibility, Remove */}
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded-md text-slate-500 hover:text-[#122452] hover:bg-slate-200 disabled:opacity-25"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === banners.length - 1}
                        className="p-1 rounded-md text-slate-500 hover:text-[#122452] hover:bg-slate-200 disabled:opacity-25"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          slide.status === "visible"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${slide.status === "visible" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {slide.status === "visible" ? "Live" : "Draft"}
                      </span>

                      {/* Remove Banner Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveBanner(slide.id, slide.title)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                        title="Remove Banner Slide"
                        aria-label="Remove Banner Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Edit Selected Banner Slide */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6">
          {!selectedBanner ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#122452]">No Banner Selected</h3>
              <p className="text-xs text-[#596579] max-w-sm mx-auto">
                Select an existing slide from the left or click &quot;Add Slide&quot; to configure a new banner.
              </p>
              <button
                type="button"
                onClick={handleAddBanner}
                className="px-4 py-2 rounded-xl bg-[#B68A35] text-white text-xs font-semibold shadow-xs hover:bg-[#9c7328] transition-colors"
              >
                Add New Slide
              </button>
            </div>
          ) : (
            <>
              <div className="border-b border-[#DFE3EA] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#122452]">
                    Edit Banner Details
                  </h2>
                  <p className="text-xs text-[#596579]">
                    Configuring Slide #{banners.findIndex((b) => b.id === selectedBannerId) + 1} ({selectedBanner.id})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Visibility Toggle Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      updateSelected({
                        status: selectedBanner.status === "visible" ? "hidden" : "visible",
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                      selectedBanner.status === "visible"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                    }`}
                    title="Click to toggle banner visibility on the public website"
                  >
                    {selectedBanner.status === "visible" ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span>Published (Live)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                        <span>Draft (Hidden)</span>
                      </>
                    )}
                  </button>

                  {/* Remove Banner Slide Action */}
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(selectedBanner.id, selectedBanner.title)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    title="Remove this banner"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Remove Slide</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Heading */}
                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Headline Text
                  </label>
                  <input
                    type="text"
                    value={selectedBanner.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Subheading / Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedBanner.description}
                    onChange={(e) => updateSelected({ description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
                  />
                </div>

                {/* CTA Label & URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#122452] mb-1">
                      Primary CTA Label
                    </label>
                    <input
                      type="text"
                      value={selectedBanner.ctaLabel}
                      onChange={(e) => updateSelected({ ctaLabel: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#122452] mb-1">
                      CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={selectedBanner.ctaUrl}
                      onChange={(e) => updateSelected({ ctaUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                    />
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#122452] mb-1">
                      Secondary CTA Label
                    </label>
                    <input
                      type="text"
                      value={selectedBanner.secondaryCtaLabel || ""}
                      onChange={(e) => updateSelected({ secondaryCtaLabel: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#122452] mb-1">
                      Secondary Destination URL
                    </label>
                    <input
                      type="text"
                      value={selectedBanner.secondaryCtaUrl || ""}
                      onChange={(e) => updateSelected({ secondaryCtaUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                    />
                  </div>
                </div>

                {/* Visual Asset (16:9 Landscape Aspect Ratio) with File Upload & Link Cropper */}
                <div className="pt-2 border-t border-[#DFE3EA] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#122452]">
                        Banner Image (16:9 Aspect Ratio)
                      </label>
                      <p className="text-[11px] text-[#596579]">
                        Upload file or paste link — both open the interactive 16:9 cropper
                      </p>
                    </div>

                    {/* Source Selector Tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAF8F3] border border-[#DFE3EA] self-start sm:self-auto">
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

                      <button
                        type="button"
                        onClick={() => setAssetTab("preset")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          assetTab === "preset"
                            ? "bg-[#122452] text-white shadow-xs"
                            : "text-[#596579] hover:text-[#122452]"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Presets</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Upload File & Crop */}
                  {assetTab === "file" && (
                    <div className="bg-[#FAF8F3] rounded-2xl border-2 border-dashed border-[#DFE3EA] hover:border-[#B68A35] transition-colors p-5 text-center">
                      <label
                        htmlFor="banner-file-input"
                        className="cursor-pointer block space-y-2 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#DFE3EA] text-[#B68A35] group-hover:scale-105 transition-transform mx-auto flex items-center justify-center shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#122452] group-hover:text-[#B68A35] transition-colors">
                            {isReadingFile ? "Reading image..." : "Upload & Crop Banner Image"}
                          </p>
                          <p className="text-[11px] text-[#596579] mt-0.5">
                            JPG, PNG, WebP up to 10 MB • Opens 16:9 cropper immediately
                          </p>
                        </div>
                        <input
                          id="banner-file-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isReadingFile}
                          onChange={handleFileSelectForCrop}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Mode 2: Link / URL & Crop */}
                  {assetTab === "link" && (
                    <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] p-4 space-y-2">
                      <label className="block text-xs font-semibold text-[#122452]">
                        Provide Banner Image Link
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="https://example.com/banner.jpg or /images/..."
                            value={linkInputUrl}
                            onChange={(e) => setLinkInputUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleLinkInputForCrop();
                              }
                            }}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-white focus:outline-none focus:border-[#B68A35]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLinkInputForCrop()}
                          className="px-4 py-2 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          <CropIcon className="w-3.5 h-3.5" />
                          <span>Load & Crop</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-[#596579]">
                        Fetches image and launches 16:9 cropper to pan, zoom, and export as optimized WebP.
                      </p>
                    </div>
                  )}

                  {/* Mode 3: Preset Library */}
                  {assetTab === "preset" && (
                    <div className="space-y-2">
                      <select
                        value={selectedBanner.desktopImageUrl}
                        onChange={(e) => updateSelected({ desktopImageUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#122452] font-medium"
                      >
                        <option value="/images/hero_banner_mg.webp">Official Classroom Hero Banner (WebP)</option>
                        <option value="/images/campus_pondicherry.webp">Puducherry Campus Exterior (WebP)</option>
                        <option value="/images/campus_karaikal.webp">Karaikal Campus Exterior (WebP)</option>
                        <option value="/images/achievements/1.webp">NEET 2024 Achievers Poster (WebP)</option>
                        <option value="/images/achievements/2.webp">Repeaters Distinction Honors (WebP)</option>
                        <option value="/images/achievements/3.webp">Karaikal Centre Toppers (WebP)</option>
                        <option value="/images/hero_doctors_group.webp">Doctors Faculty Group (WebP)</option>
                        <option value="/images/sports_campus.webp">Sports & Campus Grounds (WebP)</option>
                        <option value="/images/canteen_food.webp">Dining & Student Care (WebP)</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleCropCurrentAsset}
                        className="text-xs font-semibold text-[#B68A35] hover:text-[#9c7328] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CropIcon className="w-3.5 h-3.5" />
                        <span>Open 16:9 Cropper on this preset</span>
                      </button>
                    </div>
                  )}

                  {/* 16:9 Banner Live Preview with Re-crop Action */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#122452] flex items-center gap-1.5">
                        <span>Current 16:9 Banner</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#122452] text-white text-[9px] font-mono font-bold">
                          16:9 Landscape
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCropCurrentAsset}
                        className="text-xs font-semibold text-[#B68A35] hover:text-[#9c7328] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CropIcon className="w-3 h-3" />
                        <span>Adjust / Re-crop</span>
                      </button>
                    </div>

                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-[#DFE3EA] shadow-xs group">
                      <Image
                        src={selectedBanner.desktopImageUrl}
                unoptimized={selectedBanner.desktopImageUrl.startsWith('https://')}
                        alt={selectedBanner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                      />

                      {/* Floating Crop Button */}
                      <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={handleCropCurrentAsset}
                          className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <CropIcon className="w-3.5 h-3.5 text-[#B68A35]" />
                          <span>16:9 Cropper</span>
                        </button>
                      </div>

                      {/* Overlay Preview */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 pointer-events-none">
                        <div className="text-white text-xs">
                          <p className="font-serif font-bold text-sm text-white line-clamp-1">
                            {selectedBanner.title}
                          </p>
                          <p className="text-slate-300 line-clamp-1 text-xs">
                            {selectedBanner.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      )}

      {/* Theme-styled Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Remove Banner Slide"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to remove{" "}
              <strong className="text-[#122452] font-semibold">
                &ldquo;{deleteTarget.title}&rdquo;
              </strong>
              ? This will delete this slide from the homepage carousel sequence.
            </span>
          ) : ""
        }
        confirmLabel="Remove Slide"
        cancelLabel="Keep Slide"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />

      {/* 16:9 Aspect Ratio Image Cropper Modal (File or Link) */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        aspectRatio={16 / 9}
        aspectRatioLabel="16:9 Landscape"
        onCropComplete={handleCropComplete}
        onClose={() => {
          setCropperOpen(false);
          setCropperImageSrc(null);
        }}
      />
    </AdminPageWrapper>
  );
}
