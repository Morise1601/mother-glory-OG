"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageLoader from "@/components/ui/PageLoader";
import ImageAssetField from "@/components/admin/ImageAssetField";
import { adminRequest } from "@/lib/admin/api";
import { Program } from "@/types/content.types";
import { ArrowLeft, CheckCircle2, Loader2, Trash2, Eye } from "lucide-react";

export default function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [program, setProgram] = useState<Program | null>(null);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [overview, setOverview] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [scheduleNotice, setScheduleNotice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [newCurriculumItem, setNewCurriculumItem] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  useEffect(() => {
    adminRequest<{ programs: Program[] }>("/api/admin/programs")
      .then((result) => {
        const found = result.programs.find((item) => item.id === id);
        if (!found) throw new Error("Program not found.");
        setProgram(found);
        setStatus(found.status);
        setTitle(found.title);
        setTagline(found.tagline);
        setOverview(found.overview);
        setEligibility(found.eligibility);
        setScheduleNotice(found.scheduleNotice || "");
        setImageUrl(found.imageUrl || "");
        setCurriculum(found.curriculum);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const addCurriculum = () => {
    if (!newCurriculumItem.trim()) return;
    setCurriculum([...curriculum, newCurriculumItem.trim()]);
    setNewCurriculumItem("");
  };

  const removeCurriculum = (idx: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!program) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await adminRequest<{ program: Program }>("/api/admin/programs", {
        method: "POST",
        body: JSON.stringify({
          id,
          program: {
            ...program,
            title: title.trim(),
            tagline: tagline.trim(),
            overview: overview.trim(),
            eligibility: eligibility.trim(),
            scheduleNotice: scheduleNotice.trim() || undefined,
            imageUrl: imageUrl.trim() || undefined,
            curriculum,
            status,
          },
        }),
      });
      setProgram(result.program);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageWrapper
      title="Edit Program"
      primaryAction={
        <Link
          href="/admin/programs"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#DFE3EA] bg-white text-xs font-semibold text-[#122452] hover:text-[#B68A35] hover:border-[#B68A35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programs</span>
        </Link>
      }
    >
      {!program && !error ? (
        <PageLoader fullScreen={false} size={200} />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="bg-white rounded-[8px] border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl"
        >
          <div className="border-b border-[#DFE3EA] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#122452]">
                Program Configuration: {title || "Course"}
              </h2>
              <p className="text-xs text-[#596579] mt-0.5">
                Update course details, upload cover image, and manage curriculum.
              </p>
            </div>
            {program?.slug && (
              <Link
                href={`/programs/${program.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[#B68A35] hover:text-[#9c7328] font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Page</span>
              </Link>
            )}
          </div>

          {error && (
            <p role="alert" className="p-4 rounded-[8px] bg-red-50 text-red-800 text-xs font-medium">
              {error}
            </p>
          )}
          {success && (
            <div className="p-4 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Program updated successfully!</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Publication Status */}
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

            {/* Program Cover Image Upload (No default hardcoded image requirement) */}
            <div className="pt-2 border-t border-[#DFE3EA]">
              <ImageAssetField
                value={imageUrl}
                onChange={setImageUrl}
                label="Program / Course Cover Image"
                onAltTextSuggested={() => {}}
              />
              <p className="text-[11px] text-[#596579] mt-1.5">
                Upload a dedicated cover image for this program (replaces any fallback image across the site and course cards).
              </p>
            </div>

            {/* Course Title */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Detailed Overview */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Detailed Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Eligibility */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Eligibility Criteria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Batch Schedule Notice */}
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Batch Schedule Notice (Optional)
              </label>
              <input
                type="text"
                value={scheduleNotice}
                onChange={(e) => setScheduleNotice(e.target.value)}
                placeholder="e.g. Admissions open for morning & evening batches"
                className="w-full px-3.5 py-2 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
              />
            </div>

            {/* Curriculum Topics */}
            <div className="space-y-2 pt-2 border-t border-[#DFE3EA]">
              <label className="block text-xs font-semibold text-[#122452]">
                Curriculum Topics
              </label>
              <div className="space-y-2">
                {curriculum.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] text-xs"
                  >
                    <span className="text-[#172033]">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeCurriculum(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Remove topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add new curriculum item..."
                  value={newCurriculumItem}
                  onChange={(e) => setNewCurriculumItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCurriculum();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCurriculum}
                  className="px-3.5 py-2 rounded-[8px] bg-[#122452] text-white text-xs font-semibold hover:bg-[#1b3260] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-end gap-3">
            <Link
              href="/admin/programs"
              className="px-4 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs font-semibold text-[#596579] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !program}
              className="px-6 py-2.5 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}
    </AdminPageWrapper>
  );
}
