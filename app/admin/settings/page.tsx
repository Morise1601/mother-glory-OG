"use client";

import { useState } from "react";
import { useAdminData } from "@/components/admin/useAdminData";
import { adminRequest } from "@/lib/admin/api";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { DEFAULT_SETTINGS } from "@/lib/data/content-defaults";
import { SiteSettings } from "@/types/content.types";
import { Save, CheckCircle2, Globe, Phone } from "lucide-react";

export default function AdminSettingsPage() {
  const { data: settings, setData: setSettings, error, setError, loaded } = useAdminData<SiteSettings>("/api/admin/settings", "settings", DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    if (!loaded) return;
    setSaving(true); setError(null); setSavedSuccess(false);
    try {
      const result = await adminRequest<{ settings: SiteSettings }>("/api/admin/settings", { method: "POST", body: JSON.stringify({ settings }) });
      setSettings(result.settings); setSavedSuccess(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSaving(false); }
  };

  return (
    <AdminPageWrapper
      title="Site & Institution Settings"
      primaryAction={
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !loaded}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl">
        {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800 text-sm">{error}</p>}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Institution configuration updated successfully!</span>
          </div>
        )}

        {/* Branding & SEO */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#122452] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#B68A35]" />
            <span>Brand Identity & Origin</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Institution Legal Title
              </label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Institutional Slogan / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Canonical Website Origin
              </label>
              <input
                type="text"
                value={settings.canonicalOrigin}
                onChange={(e) => setSettings({ ...settings, canonicalOrigin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs font-mono text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
              />
              <p className="text-[11px] text-[#596579] mt-1">
                Standard configured host for sitemap, metadata, and canonical Open Graph tags.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#122452]">Search &amp; Contact Details</h2>
          <label className="block text-xs font-semibold text-[#122452]">Browser title<input value={settings.siteTitle} onChange={e => setSettings({ ...settings, siteTitle: e.target.value })} className="block mt-1 w-full p-2.5 border rounded-xl" /></label>
          <label className="block text-xs font-semibold text-[#122452]">Search description<textarea value={settings.seoDescription} onChange={e => setSettings({ ...settings, seoDescription: e.target.value })} className="block mt-1 w-full p-2.5 border rounded-xl" /></label>
          {[0, 1].map(index => <label key={index} className="block text-xs font-semibold text-[#122452]">{index === 0 ? "Puducherry" : "Karaikal"} admissions phone<input value={settings.contactPhones[index] || ""} onChange={e => { const contactPhones = [...settings.contactPhones]; contactPhones[index] = e.target.value; setSettings({ ...settings, contactPhones }); }} className="block mt-1 w-full p-2.5 border rounded-xl" /></label>)}
        </div>
        {/* Admissions Announcement Strip */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#122452]">
              Homepage Admissions Notice
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-announcement"
                checked={settings.showAnnouncement}
                onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#B68A35]"
              />
              <label htmlFor="show-announcement" className="text-xs font-semibold text-[#122452]">
                Display notice
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122452] mb-1">
              Notice Text
            </label>
            <input
              type="text"
              value={settings.announcementNotice}
              onChange={(e) => setSettings({ ...settings, announcementNotice: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3]"
            />
          </div>
        </div>

        {/* Verified Contacts */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#122452] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#B68A35]" />
            <span>Public Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Official Admissions Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#122452] mb-1">
                Opening Working Hours
              </label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3]"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
}

