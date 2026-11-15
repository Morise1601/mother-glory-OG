"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageAssetField from "@/components/admin/ImageAssetField";
import { adminRequest } from "@/lib/admin/api";
import { Achievement } from "@/types/content.types";
import { ArrowLeft, CheckCircle2, Loader2, Eye, Calendar } from "lucide-react";

export default function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(2024);
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
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  useEffect(() => {
    adminRequest<{ achievements: Achievement[] }>("/api/admin/achievements").then(result => {
      const found = result.achievements.find(item => item.id === id);
      if (!found) throw new Error("Achievement not found.");
      setAchievement(found); setStatus(found.status); setTitle(found.title); setYear(found.year); setCategory(found.category); setCampus(found.campus); setSummary(found.summary); setCaption(found.caption || ""); setImageUrl(found.imageUrl); setAltText(found.altText); setFeatured(found.featured);
    }).catch(error => setError(error.message));
  }, [id]);  const handleUpdate = async () => {
    if (!achievement) return;
    setSaving(true); setError(null); setSuccess(false);
    try {
      const result = await adminRequest<{ achievement: Achievement }>("/api/admin/achievements", {
        method: "POST", body: JSON.stringify({ id, achievement: { ...achievement, title, year, category, campus, summary, caption, imageUrl, altText, featured, status } }),
      });
      setAchievement(result.achievement); setSuccess(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSaving(false); }
  };

  return (
    <AdminPageWrapper
      title="Edit Achievement"
      primaryAction={
        <Link
          href="/admin/achievements"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#122452] hover:text-[#B68A35]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Achievements</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#DFE3EA] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#122452]">
              Edit Achievement: {title}
            </h2>
          </div>

          {error && <p role="alert" className="p-4 bg-red-50 text-red-800 text-sm">{error}</p>}
        {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Achievement updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-[#122452]">Publication status<select value={status} onChange={e => setStatus(e.target.value as typeof status)} className="block mt-1 p-2 border rounded-xl"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                >
                  <option value="Academic">Academic</option>
                  <option value="Awards">Awards</option>
                  <option value="Events">Events</option>
                  <option value="Initiatives">Initiatives</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">Campus</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value as typeof campus)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
                >
                  <option value="Both">Both</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Karaikal">Karaikal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">Alt Text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">Summary</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">Caption</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] resize-none"
              />
            </div>

            <ImageAssetField value={imageUrl} onChange={setImageUrl} label="Feature poster image" />
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#B68A35]"
              />
              <label htmlFor="edit-featured" className="text-xs font-semibold text-[#122452]">
                Feature on homepage carousel
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving || !achievement}
              className="px-6 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#122452] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#B68A35]" />
              <span>Website Preview</span>
            </h3>
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
                {title}
              </h4>
              <p className="text-xs text-[#596579] line-clamp-2">
                {summary}
              </p>
            </div>
          </article>
        </div>
      </div>
    </AdminPageWrapper>
  );
}

