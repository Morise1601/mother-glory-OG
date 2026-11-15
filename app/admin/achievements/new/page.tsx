"use client";

import { useState } from "react";
import { adminRequest } from "@/lib/admin/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageAssetField from "@/components/admin/ImageAssetField";
import { ArrowLeft, CheckCircle2, Loader2, Eye, Calendar } from "lucide-react";

export default function NewAchievementPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState<"Academic" | "Awards" | "Events" | "Initiatives">("Academic");
  const [campus, setCampus] = useState<"Puducherry" | "Karaikal" | "Both">("Both");
  const [summary, setSummary] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/achievements/1.webp");
  const [altText, setAltText] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const genSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(genSlug);
  };

  const handleSave = async (publishNow = false) => {
    setSaving(true); setError(null);
    try {
      await adminRequest("/api/admin/achievements", { method: "POST", body: JSON.stringify({ achievement: {
        title, slug, year, category, campus, summary, caption, imageUrl, altText, featured,
        status: publishNow ? "published" : "draft", verificationStatus: "verified", consentStatus: "obtained", sortOrder: 0,
      } }) });
      setSuccess(true); router.push("/admin/achievements");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save achievement."); }
    finally { setSaving(false); }
  };

  return (
    <AdminPageWrapper
      title="Upload Achievement"
      primaryAction={
        <Link
          href="/admin/achievements"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#122452] hover:text-[#B68A35]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form (7 cols) - M01 */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#DFE3EA] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#122452]">
              Achievement Details
            </h2>
            <p className="text-xs text-[#596579] mt-0.5">
              Add and manage achievements, announcements and milestones.
            </p>
          </div>

          {error && <p role="alert" className="p-4 bg-red-50 text-red-800 text-sm">{error}</p>}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Achievement saved successfully! Redirecting...</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NEET 2024 Top Qualifiers Felicitation"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#596579] bg-[#FAF8F3]"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033]"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033]"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033]"
                >
                  <option value="Both">Both</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Karaikal">Karaikal</option>
                </select>
              </div>
            </div>

            <ImageAssetField value={imageUrl} onChange={setImageUrl} label="Feature poster image" />

            {/* Alt Text */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Image Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Descriptive text for accessibility and screen readers"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Short Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary appearing on cards..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Lightbox Modal Caption (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Detailed caption shown when the lightbox opens..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured-toggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#B68A35] focus:ring-[#B68A35]"
              />
              <label htmlFor="featured-toggle" className="text-xs font-semibold text-[#122452] cursor-pointer">
                Feature on homepage carousel
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-[#DFE3EA] text-xs font-semibold text-[#596579] hover:bg-slate-100 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publish Achievement</span>
            </button>
          </div>
        </div>

        {/* Live Website Preview Card (5 cols) - M01 */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#122452] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#B68A35]" />
              <span>Website Preview</span>
            </h3>
            <span className="text-[11px] text-[#596579]">Real-time card preview</span>
          </div>

          <article className="bg-[#FAF8F3] rounded-2xl border border-[#DFE3EA] overflow-hidden shadow-xs">
            <div className="relative aspect-[4/3] bg-slate-900 flex items-center justify-center p-2">
              <Image
                src={imageUrl}
                unoptimized={imageUrl.startsWith('https://')}
                alt={altText || "Preview"}
                fill
                sizes="350px"
                className="object-contain"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-sm bg-[#122452] text-white font-semibold text-[10px]">
                  {category}
                </span>
                <span className="text-[#596579] text-xs font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#B68A35]" />
                  {year}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[#596579] text-xs font-medium">{campus} Campus</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#122452]">
                {title || "Achievement Title"}
              </h4>
              <p className="text-xs text-[#596579] line-clamp-2">
                {summary || "Summary text will appear here..."}
              </p>
            </div>
          </article>
        </div>
      </div>
    </AdminPageWrapper>
  );
}

