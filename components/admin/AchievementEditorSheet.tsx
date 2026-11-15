"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { adminRequest } from "@/lib/admin/api";
import { Achievement } from "@/types/content.types";
import ImageAssetField from "@/components/admin/ImageAssetField";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

interface AchievementEditorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (achievement: Achievement) => void;
  initialData?: Achievement | null;
}

export default function AchievementEditorSheet({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: AchievementEditorSheetProps) {
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState<"Academic" | "Awards" | "Events" | "Initiatives">("Academic");
  const [campus, setCampus] = useState<"Puducherry" | "Karaikal" | "Both">("Both");
  const [summary, setSummary] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Field errors for highlight & scroll
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Element refs for smooth scrolling on missing fields
  const titleFieldRef = useRef<HTMLDivElement>(null);
  const imageFieldRef = useRef<HTMLDivElement>(null);
  const altTextFieldRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize or reset form when sheet opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setSlug(initialData.slug || "");
        setYear(initialData.year || new Date().getFullYear());
        setCategory(initialData.category || "Academic");
        setCampus(initialData.campus || "Both");
        setSummary(initialData.summary || "");
        setCaption(initialData.caption || "");
        setImageUrl(initialData.imageUrl || "");
        setAltText(initialData.altText || "");
        setFeatured(Boolean(initialData.featured));
        setStatus(initialData.status || "published");
      } else {
        // Reset for new achievement
        setTitle("");
        setSlug("");
        setYear(new Date().getFullYear());
        setCategory("Academic");
        setCampus("Both");
        setSummary("");
        setCaption("");
        setImageUrl("");
        setAltText("");
        setFeatured(false);
        setStatus("published");
      }
      setFieldErrors({});
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialData]);

  // Handle escape key listener to close sheet
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (fieldErrors.title) {
      setFieldErrors((prev) => ({ ...prev, title: "" }));
    }
    if (!isEditing) {
      const genSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(genSlug);

      if (!altText.trim()) {
        setAltText(val);
        if (fieldErrors.altText) {
          setFieldErrors((prev) => ({ ...prev, altText: "" }));
        }
      }
    }
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    if (fieldErrors.imageUrl && url.trim()) {
      setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleAltTextChange = (val: string) => {
    setAltText(val);
    if (fieldErrors.altText && val.trim()) {
      setFieldErrors((prev) => ({ ...prev, altText: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(true);
  };

  const handleSave = async (publishNow = false) => {
    const errors: Record<string, string> = {};
    let firstMissingRef: React.RefObject<HTMLDivElement | null> | null = null;
    let focusTargetId: string | null = null;

    // 1. Validate Title (Required)
    if (!title.trim() || title.trim().length < 3) {
      errors.title = "Achievement title is required (at least 3 characters).";
      if (!firstMissingRef) {
        firstMissingRef = titleFieldRef;
        focusTargetId = "sheet-field-title";
      }
    }

    // 2. Validate Poster Image (Required)
    if (!imageUrl.trim()) {
      errors.imageUrl = "Please upload an achievement poster image.";
      if (!firstMissingRef) {
        firstMissingRef = imageFieldRef;
      }
    }

    // 3. Validate Alt Text (Required)
    if (!altText.trim() || altText.trim().length < 3) {
      errors.altText = "Image alt text is required for accessibility (at least 3 characters).";
      if (!firstMissingRef) {
        firstMissingRef = altTextFieldRef;
        focusTargetId = "sheet-field-alttext";
      }
    }

    // Note: Short Summary is strictly OPTIONAL as requested

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in the required fields highlighted below.");

      if (firstMissingRef?.current) {
        firstMissingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        if (focusTargetId) {
          const el = document.getElementById(focusTargetId);
          if (el) el.focus();
        }
      }
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError(null);

    const submissionStatus = isEditing
      ? status
      : publishNow
      ? "published"
      : "draft";

    let cleanSlug = (slug.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!cleanSlug || cleanSlug.length < 3) {
      cleanSlug = `achievement-${Date.now().toString(36)}`;
    }

    const payload = {
      title: title.trim(),
      slug: cleanSlug,
      year,
      category,
      campus,
      summary: summary.trim(),
      caption: caption.trim() || undefined,
      imageUrl: imageUrl.trim(),
      altText: altText.trim(),
      featured,
      status: submissionStatus,
      verificationStatus: initialData?.verificationStatus || "verified",
      consentStatus: initialData?.consentStatus || "obtained",
      sortOrder: initialData?.sortOrder || 0,
    };

    try {
      const res = await adminRequest<{ achievement: Achievement }>("/api/admin/achievements", {
        method: "POST",
        body: JSON.stringify(
          isEditing
            ? { id: initialData?.id, achievement: { ...initialData, ...payload } }
            : { achievement: payload }
        ),
      });

      setSuccess(isEditing ? "Achievement updated successfully!" : "Achievement saved successfully!");
      setTimeout(() => {
        onSaved(res.achievement);
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save achievement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-achievement-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      {/* Slide-Over Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-xl md:max-w-2xl h-full bg-white shadow-2xl flex flex-col border-l border-[#DFE3EA] animate-in slide-in-from-right duration-300 select-text"
      >
        {/* Sheet Header */}
        <div className="p-5 sm:p-6 border-b border-[#DFE3EA] bg-white flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 id="sheet-achievement-title" className="font-serif font-bold text-lg sm:text-xl text-[#122452]">
              {isEditing ? "Edit Achievement" : "Add New Achievement"}
            </h2>
            <p className="text-xs text-[#596579] mt-0.5">
              {isEditing
                ? "Update achievement milestone and poster image."
                : "Upload achievement poster image, milestones, and awards."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close sheet"
            className="p-1.5 rounded-[8px] border border-[#DFE3EA] hover:border-[#122452] text-[#596579] hover:text-[#122452] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sheet Form with Enter-to-Submit and Required Field Validation */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Sheet Body (Scrollable) */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {error && (
            <p role="alert" className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </p>
          )}
          {success && (
            <div className="p-3 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Real-time Website Card Preview */}
          <div className="bg-[#FAF8F3] rounded-[8px] border border-[#DFE3EA] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DFE3EA]">
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#122452] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#B68A35]" />
                <span>Live Card Preview</span>
              </h3>
              <span className="text-[10px] text-[#596579]">Real-time visual simulation</span>
            </div>

            <article className="bg-white rounded-[8px] border border-[#DFE3EA] overflow-hidden shadow-xs max-w-sm mx-auto">
              <div className="relative aspect-[4/3] bg-slate-900 rounded-t-[8px] flex items-center justify-center p-2 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    unoptimized={imageUrl.startsWith("https://")}
                    alt={altText || "Preview"}
                    fill
                    sizes="320px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-1.5 select-none">
                    <div className="w-10 h-10 rounded-[8px] bg-white/10 flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">No Image Uploaded</p>
                    <p className="text-[10px] text-slate-400 max-w-[200px]">
                      Upload an achievement image below to preview
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#122452] text-white font-semibold text-[10px]">
                    {category}
                  </span>
                  <span className="text-[#596579] text-[11px] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#B68A35]" />
                    {year}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[#596579] text-[11px] font-medium">{campus} Campus</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#122452]">
                  {title || "Achievement Title"}
                </h4>
                {summary ? (
                  <p className="text-[11px] text-[#596579] line-clamp-2">
                    {summary}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#596579]/60 italic">
                    No summary provided (optional)
                  </p>
                )}
              </div>
            </article>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* If Editing: Status Field */}
            {isEditing && (
              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full sm:w-48 px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:border-[#B68A35] focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            )}

            {/* 1. Title (Required - with scroll ref & highlight) */}
            <div
              ref={titleFieldRef}
              className={`transition-all rounded-[8px] p-2.5 -m-2.5 ${
                fieldErrors.title
                  ? "bg-red-50/40 ring-2 ring-red-500/60 rounded-[8px]"
                  : ""
              }`}
            >
              <label htmlFor="sheet-field-title" className="block text-xs font-semibold text-[#122452] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="sheet-field-title"
                type="text"
                placeholder="e.g. NEET 2024 Top Qualifiers Felicitation"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-[8px] border text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none transition-all ${
                  fieldErrors.title
                    ? "border-red-500 ring-2 ring-red-400/40 focus:border-red-500"
                    : "border-[#DFE3EA] focus:border-[#B68A35]"
                }`}
              />
              {fieldErrors.title && (
                <p role="alert" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.title}</span>
                </p>
              )}
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs text-[#596579] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none font-mono"
              />
            </div>

            {/* Year, Category, Campus Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:border-[#B68A35] focus:outline-none"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                  <option value={2021}>2021</option>
                  <option value={2020}>2020</option>
                  <option value={2019}>2019</option>
                  <option value={2018}>2018</option>
                  <option value={2017}>2017</option>
                  <option value={2016}>2016</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:border-[#B68A35] focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Awards">Awards</option>
                  <option value="Events">Events</option>
                  <option value="Initiatives">Initiatives</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Campus
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value as typeof campus)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:border-[#B68A35] focus:outline-none"
                >
                  <option value="Both">Both</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Karaikal">Karaikal</option>
                </select>
              </div>
            </div>

            {/* 2. Direct Upload Field for Achievement Image (Required - with scroll ref & highlight) */}
            <div
              ref={imageFieldRef}
              className={`transition-all rounded-[8px] p-2.5 -m-2.5 ${
                fieldErrors.imageUrl
                  ? "bg-red-50/40 ring-2 ring-red-500/60 rounded-[8px]"
                  : ""
              }`}
            >
              <ImageAssetField
                value={imageUrl}
                onChange={handleImageChange}
                onAltTextSuggested={(suggested) => {
                  if (!altText) setAltText(suggested);
                }}
                label="Achievement Poster Image"
              />
              {fieldErrors.imageUrl && (
                <p role="alert" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.imageUrl}</span>
                </p>
              )}
            </div>

            {/* 3. Alt Text (Required - with scroll ref & highlight) */}
            <div
              ref={altTextFieldRef}
              className={`transition-all rounded-[8px] p-2.5 -m-2.5 ${
                fieldErrors.altText
                  ? "bg-red-50/40 ring-2 ring-red-500/60 rounded-[8px]"
                  : ""
              }`}
            >
              <label htmlFor="sheet-field-alttext" className="block text-xs font-semibold text-[#122452] mb-1">
                Image Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                id="sheet-field-alttext"
                type="text"
                placeholder="Descriptive text for accessibility and search engines"
                value={altText}
                onChange={(e) => handleAltTextChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-[8px] border text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none transition-all ${
                  fieldErrors.altText
                    ? "border-red-500 ring-2 ring-red-400/40 focus:border-red-500"
                    : "border-[#DFE3EA] focus:border-[#B68A35]"
                }`}
              />
              {fieldErrors.altText && (
                <p role="alert" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.altText}</span>
                </p>
              )}
            </div>

            {/* 4. Short Summary (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#122452]">
                  Short Summary <span className="text-[#596579] font-normal text-[11px]">(Optional)</span>
                </label>
                <span className="text-[10px] text-[#596579]">Shown on cards if provided</span>
              </div>
              <textarea
                rows={2}
                placeholder="Brief summary appearing on cards (optional)..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
              />
            </div>

            {/* 5. Caption (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Lightbox Modal Caption <span className="text-[#596579] font-normal text-[11px]">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Detailed caption shown when the lightbox opens (optional)..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="sheet-featured-toggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded-[4px] border-slate-300 text-[#B68A35] focus:ring-[#B68A35] cursor-pointer"
              />
              <label htmlFor="sheet-featured-toggle" className="text-xs font-semibold text-[#122452] cursor-pointer">
                Feature on homepage carousel
              </label>
            </div>
          </div>
        </div>

          {/* Sheet Footer (Sticky at bottom) */}
          <div className="p-4 sm:p-5 border-t border-[#DFE3EA] bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-[8px] border border-[#DFE3EA] text-xs font-semibold text-[#596579] hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            {!isEditing && (
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2 rounded-[8px] border border-[#DFE3EA] text-xs font-semibold text-[#122452] bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Draft</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Publish Achievement"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
