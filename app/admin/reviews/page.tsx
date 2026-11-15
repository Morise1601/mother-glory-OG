"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { GooglePlaceReviewsResponse } from "@/types/content.types";
import { Star, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [campus, setCampus] = useState<"puducherry" | "karaikal">("puducherry");
  const [placeIdPuducherry, setPlaceIdPuducherry] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID_PUDUCHERRY || "ChIJu_bO33dhUzoR6ULpTx3jkbk"
  );
  const [placeIdKaraikal, setPlaceIdKaraikal] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID_KARAIKAL || "ChIJ0RMnMEwRVToRx6r0pDqIJRo"
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<GooglePlaceReviewsResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [configMessage, setConfigMessage] = useState("");
  const [settingsUpdatedAt, setSettingsUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/reviews').then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load saved configuration.');
      setPlaceIdPuducherry(data.puducherryPlaceId);
      setPlaceIdKaraikal(data.karaikalPlaceId);
      setSettingsUpdatedAt(data.updatedAt);
      if (!data.keyConfigured) setConfigMessage('The server Google Places API key is missing.');
    }).catch(error => setConfigMessage(error.message));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setConfigMessage("");
    try {
      const res = await fetch('/api/admin/reviews', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ puducherryPlaceId: placeIdPuducherry, karaikalPlaceId: placeIdKaraikal, updatedAt: settingsUpdatedAt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to save Place IDs.');
      setSettingsUpdatedAt(data.updatedAt);
      setConfigMessage(`Place IDs saved. The public website now uses this configuration.${data.warning ? ` ${data.warning}` : ''}`);
    } catch (error) { setConfigMessage(error instanceof Error ? error.message : 'Unable to save configuration.'); }
    finally { setSaving(false); }
  };

  const activePlaceId = campus === "puducherry" ? placeIdPuducherry : placeIdKaraikal;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campus, placeId: activePlaceId }) });
      if (!res.ok) { const failure = await res.json(); throw new Error(failure.error || 'Connection test failed.'); }
      const data: GooglePlaceReviewsResponse = await res.json();
      setTestResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      setTestResult({
        configured: false,
        campus,
        placeId: activePlaceId,
        reviews: [],
        error: msg,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminPageWrapper title="Google Reviews & Place Configuration">
      <div className="space-y-6">
        <div className="p-4 rounded-[8px] bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-2">
          <p>
            <strong>Integration Policy:</strong> Google reviews are retrieved strictly through the official Google Places API (New). Reviews cannot be manually fabricated or edited. Use this panel to test the server connection and Place ID accuracy for each campus.
          </p>
          <p className="text-[11px] text-amber-800">
            <strong>Setup Checklist:</strong> 1) Google Cloud Billing must be enabled on your project at <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.cloud.google.com/billing</a>. 2) &ldquo;Places API (New)&rdquo; must be enabled in Google Cloud APIs &amp; Services. 3) API key must allow server-to-server requests without restrictive HTTP referrers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Configuration Form (7 cols) - G01 */}
          <div className="lg:col-span-7 bg-white rounded-[8px] border border-[#DFE3EA] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE3EA]">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#122452]">
                  Google Reviews Configuration
                </h2>
                <p className="text-xs text-[#596579]">
                  Enter your Google Place ID to display verified reviews.
                </p>
              </div>

              {/* Campus Selector */}
              <div className="flex rounded-[8px] bg-[#FAF8F3] p-1 border border-[#DFE3EA]">
                <button
                  type="button"
                  onClick={() => {
                    setCampus("puducherry");
                    setTestResult(null);
                  }}
                  className={`px-3 py-1 rounded-[8px] text-xs font-semibold transition-colors ${campus === "puducherry"
                      ? "bg-[#122452] text-white"
                      : "text-[#596579] hover:text-[#122452]"
                    }`}
                >
                  Puducherry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCampus("karaikal");
                    setTestResult(null);
                  }}
                  className={`px-3 py-1 rounded-[8px] text-xs font-semibold transition-colors ${campus === "karaikal"
                      ? "bg-[#122452] text-white"
                      : "text-[#596579] hover:text-[#122452]"
                    }`}
                >
                  Karaikal
                </button>
              </div>
            </div>

            {/* Place ID Field */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#122452] mb-1">
                  Google Place ID ({campus === "puducherry" ? "Puducherry" : "Karaikal"})
                </label>
                <input
                  type="text"
                  value={campus === "puducherry" ? placeIdPuducherry : placeIdKaraikal}
                  onChange={(e) => {
                    if (campus === "puducherry") setPlaceIdPuducherry(e.target.value);
                    else setPlaceIdKaraikal(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs font-mono text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
                />
                <p className="text-[11px] text-[#596579] mt-1">
                  Obtained from Google Cloud Console or Google Maps Place ID Finder.
                </p>
              </div>

              {/* Server Status Indicator */}
              <button type="button" onClick={handleSave} disabled={saving || !settingsUpdatedAt} className="px-4 py-2 rounded-[8px] bg-[#B68A35] text-white text-xs font-semibold disabled:opacity-60 cursor-pointer">{saving ? 'Saving...' : 'Save Place IDs'}</button>
              {configMessage && <p className="text-xs text-[#596579]" role="status">{configMessage}</p>}
              <p className="text-[11px] text-[#596579]">Connection tests use the entered Place ID immediately and bypass the hourly review cache. Save to apply it publicly.</p>
              <div className="p-4 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#122452]">API Connection Status</p>
                  <p className="text-[11px] text-[#596579]">
                    {testResult
                      ? testResult.error
                        ? "Connection error reported"
                        : "Connected successfully"
                      : "Ready for connection test"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 rounded-[8px] bg-[#122452] hover:bg-[#1b3260] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Test connection</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-4 rounded-[8px] border text-xs flex items-start gap-2.5 ${testResult.error
                      ? "bg-red-50 border-red-200 text-red-900"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}
                >
                  {testResult.error ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {testResult.error
                        ? "Google Places API Error"
                        : `Successfully Connected (${testResult.latencyMs} ms)`}
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {testResult.error
                        ? testResult.error
                        : `Retrieved ${testResult.reviews.length} reviews. Place Rating: ${testResult.rating || 'N/A'} based on ${testResult.userRatingCount || 0} user ratings.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Read-Only Reviews Preview (5 cols) - G01 */}
          <div className="lg:col-span-5 bg-white rounded-[8px] border border-[#DFE3EA] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#122452] flex items-center justify-between">
              <span>Reviews Preview</span>
              {testResult?.rating && (
                <span className="text-xs text-[#B68A35] font-semibold">
                  ★ {testResult.rating.toFixed(1)}
                </span>
              )}
            </h3>

            {testResult && testResult.reviews.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {testResult.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#122452]">{rev.authorName}</span>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400 block">{rev.relativeTimeDescription}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#596579] space-y-2">
                <p className="font-medium">Reviews appear after connection</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Click &ldquo;Test connection&rdquo; to query the official Google Places API and preview returned reviews.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
}

