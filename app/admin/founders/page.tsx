"use client";

import { useState } from "react";
import { useAdminData } from "@/components/admin/useAdminData";
import { adminRequest } from "@/lib/admin/api";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageAssetField from "@/components/admin/ImageAssetField";

import { Founder } from "@/types/content.types";
import { Save, CheckCircle2 } from "lucide-react";

export default function AdminFoundersPage() {
  const { data: founders, setData: setFounders, error, setError, loaded } = useAdminData<Founder[]>("/api/admin/founders", "founders", []);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateFounder = (id: string, updates: Partial<Founder>) => {
    setFounders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleSave = async () => {
    if (!loaded) return;
    setSaving(true); setError(null); setSavedSuccess(false);
    try {
      const result = await adminRequest<{ founders: Founder[] }>("/api/admin/founders", { method: "POST", body: JSON.stringify({ founders }) });
      setFounders(result.founders); setSavedSuccess(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSaving(false); }
  };

  return (
    <AdminPageWrapper
      title="Founders & Leadership"
      primaryAction={
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !loaded}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      }
    >
      <div className="space-y-6">
        {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800 text-sm">{error}</p>}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Founder profiles saved successfully.</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Mandatory Notice:</strong> Verified founders are <strong>M. Antoine@Prabhu</strong> (Founder & Managing Director) and <strong>Mr. Robert Clyive</strong> (Chairman & Managing Trustee). Original verified portraits and credentials are preserved.
        </div>

        {/* Founder profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {founders.map((founder, idx) => (
            <div
              key={founder.id}
              className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#DFE3EA]">
                <h2 className="font-serif font-bold text-lg text-[#122452]">
                  Leader #{idx + 1}: {founder.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-[#122452]/5 text-[#122452] text-xs font-semibold">
                  Order: {founder.sortOrder}
                </span>
                <select aria-label={`Publication status for ${founder.name}`} value={founder.status} onChange={e => updateFounder(founder.id, { status: e.target.value as Founder["status"] })} className="border rounded p-1 text-xs">
                  <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                </select>
              </div>

              {/* Portrait Preview and Selection */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-slate-100 border border-[#DFE3EA] shrink-0 shadow-xs">
                  <Image
                    src={founder.portraitUrl}
                unoptimized={founder.portraitUrl.startsWith('https://')}
                    alt={founder.name}
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <p className="font-semibold text-[#122452]">Portrait Image Asset</p>
                  <p className="text-[#596579]">{founder.portraitUrl}</p>
                  <span className="inline-block text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    Verified Original Portrait
                  </span>
                </div>
              </div>

              <ImageAssetField value={founder.portraitUrl} onChange={portraitUrl => updateFounder(founder.id, { portraitUrl })} label="Portrait image" />
              {/* Editable Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={founder.name}
                    onChange={(e) => updateFounder(founder.id, { name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={founder.title}
                    onChange={(e) => updateFounder(founder.id, { title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Verified Academic Qualifications
                  </label>
                  <input
                    type="text"
                    value={founder.qualifications}
                    onChange={(e) => updateFounder(founder.id, { qualifications: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Vision Message / Quote
                  </label>
                  <textarea
                    rows={2}
                    value={founder.message}
                    onChange={(e) => updateFounder(founder.id, { message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#122452] mb-1">
                    Biography
                  </label>
                  <textarea
                    rows={4}
                    value={founder.biography}
                    onChange={(e) => updateFounder(founder.id, { biography: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageWrapper>
  );
}

