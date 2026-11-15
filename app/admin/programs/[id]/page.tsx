"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageLoader from "@/components/ui/PageLoader";
import { adminRequest } from "@/lib/admin/api";
import { Program } from "@/types/content.types";
import { ArrowLeft, CheckCircle2, Loader2, Trash2 } from "lucide-react";

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
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [newCurriculumItem, setNewCurriculumItem] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  useEffect(() => {
    adminRequest<{ programs: Program[] }>("/api/admin/programs").then(result => {
      const found = result.programs.find(item => item.id === id);
      if (!found) throw new Error("Program not found.");
      setProgram(found); setStatus(found.status); setTitle(found.title); setTagline(found.tagline); setOverview(found.overview); setEligibility(found.eligibility); setScheduleNotice(found.scheduleNotice || ""); setCurriculum(found.curriculum);
    }).catch(error => setError(error.message));
  }, [id]);  const addCurriculum = () => {
    if (!newCurriculumItem.trim()) return;
    setCurriculum([...curriculum, newCurriculumItem.trim()]);
    setNewCurriculumItem("");
  };

  const removeCurriculum = (idx: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!program) return;
    setSaving(true); setError(null); setSuccess(false);
    try {
      const result = await adminRequest<{ program: Program }>("/api/admin/programs", {
        method: "POST", body: JSON.stringify({ id, program: { ...program, title, tagline, overview, eligibility, scheduleNotice, curriculum, status } }),
      });
      setProgram(result.program); setSuccess(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSaving(false); }
  };

  return (
    <AdminPageWrapper
      title="Edit Program"
      primaryAction={
        <Link
          href="/admin/programs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#122452] hover:text-[#B68A35]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programs</span>
        </Link>
      }
    >
      {!program && !error ? (
        <PageLoader fullScreen={false} size={200} />
      ) : (
      <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
        <div className="border-b border-[#DFE3EA] pb-4">
          <h2 className="font-serif font-bold text-xl text-[#122452]">
            Program Configuration: {title}
          </h2>
        </div>

        {error && <p role="alert" className="p-4 bg-red-50 text-red-800 text-sm">{error}</p>}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Program updated successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-xs font-semibold text-[#122452]">Publication Status
            <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className="block mt-1 p-2 border rounded-xl">
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </label>
          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Detailed Overview
            </label>
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Eligibility
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Batch Schedule Notice (Optional)
            </label>
            <input
              type="text"
              value={scheduleNotice}
              onChange={(e) => setScheduleNotice(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3]"
            />
          </div>

          {/* Curriculum List */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#122452]">
              Curriculum Topics
            </label>
            <div className="space-y-2">
              {curriculum.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F3] border border-[#DFE3EA] text-xs">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeCurriculum(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove item"
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
                className="flex-1 px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
              />
              <button
                type="button"
                onClick={addCurriculum}
                className="px-3.5 py-2 rounded-xl bg-[#122452] text-white text-xs font-semibold hover:bg-[#1b3260] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DFE3EA] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !program}
            className="px-6 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
      )}
    </AdminPageWrapper>
  );
}

