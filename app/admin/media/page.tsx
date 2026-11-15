"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import MediaPreviewModal from "@/components/admin/MediaPreviewModal";
import PageLoader from "@/components/ui/PageLoader";
import { MediaAsset, validateMediaUpload } from "@/lib/data/media";
import {
  Upload,
  Search,
  Archive,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [filterKind, setFilterKind] = useState("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAssetForPreview, setSelectedAssetForPreview] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/media').then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load media.');
      setMediaList(data.media);
    }).catch(error => setErrorMsg(error.message)).finally(() => setLoading(false));
  }, []);

  const filtered = mediaList.filter((m) => {
    if (filterKind !== 'all' && !m.mimeType.startsWith(`${filterKind}/`)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.filename.toLowerCase().includes(q) || m.altText.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = (asset: MediaAsset) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (asset.referencesCount > 0) {
      setErrorMsg(
        `Action blocked: Asset '${asset.filename}' is currently referenced in ${asset.referencesCount} saved location(s). Reassign or detach references before archiving.`
      );
      return;
    }

    setDeleteTarget(asset);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteTarget.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to archive this asset.');
      setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setSuccessMsg(`Asset ${deleteTarget.filename} removed from the library. Its stored file is retained for content safety.${data.auditWarning ? ` ${data.auditWarning}` : ''}`);
      setDeleteTarget(null);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to archive this asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaUpload({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      setErrorMsg(validation.error || "Invalid file.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "Media library upload");
      formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setMediaList((prev) => [data.asset, ...prev]);
      setSuccessMsg(
        `Converted to ${data.asset.mimeType === 'video/webm' ? 'WebM' : 'WebP'} and uploaded as '${data.asset.filename}'.${data.auditWarning ? ` ${data.auditWarning}` : ''}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file.";
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <AdminPageWrapper
      title="Media Library"
      primaryAction={
        <label className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer ${
          isUploading ? "bg-slate-400 cursor-not-allowed" : "bg-[#B68A35] hover:bg-[#9c7328]"
        }`}>
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{isUploading ? "Converting & uploading..." : "Upload image or video"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            className="hidden"
            disabled={isUploading}
            onChange={handleUpload}
          />
        </label>
      }
    >
      <div className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Upload Dropzone Notice (F01) */}
        <div className="bg-white rounded-2xl border border-dashed border-[#DFE3EA] p-6 text-center space-y-2">
          <Upload className="w-8 h-8 text-[#B68A35] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#122452]">
            Upload media assets
          </h3>
          <p className="text-xs text-[#596579]">
            Images: JPG, PNG, WebP (10 MB), converted to WebP. Videos: MP4, MOV, WebM (100 MB), converted to WebM. Published assets are stored in the site-media bucket.
            Removing an asset archives its library entry. Stored files and metadata are retained to protect saved content; this screen does not permanently purge files.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search media files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#596579]">
            <select aria-label="Media type" value={filterKind} onChange={event => setFilterKind(event.target.value)} className="border rounded-lg p-2"><option value="all">All media</option><option value="image">Images</option><option value="video">Videos</option></select>
            <span>Total assets: <strong className="text-[#122452]">{filtered.length}</strong></span>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <PageLoader fullScreen={false} size={200} />
        ) : !filtered.length ? (
          <p className="text-xs text-[#596579]">No uploaded media matches your search.</p>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAssetForPreview(asset)}
              className="bg-white rounded-xl border border-[#DFE3EA] hover:border-[#B68A35] hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer overflow-hidden"
              title={`Click to preview ${asset.filename}`}
            >
              <div className="relative aspect-square bg-slate-900 flex items-center justify-center p-2">
                {asset.mimeType.startsWith('video/') ? <video src={asset.url} className="w-full h-full object-contain" preload="metadata" muted /> : <Image
                  src={asset.url}
                  unoptimized
                  alt={asset.altText}
                  fill
                  sizes="180px"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />}
                {/* In Use Pill */}
                {asset.referencesCount > 0 ? (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white font-medium text-[9px] flex items-center gap-1 shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                    In use ({asset.referencesCount})
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-700/80 text-white font-medium text-[9px] shadow-xs">
                    Unused
                  </span>
                )}
              </div>

              <div className="p-3 space-y-1 text-xs">
                <p className="font-semibold text-[#122452] group-hover:text-[#B68A35] transition-colors truncate" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#596579]">
                  <span>{(asset.bytes / (1024 * 1024)).toFixed(1)} MB</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset);
                    }}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    title={asset.referencesCount > 0 ? "Cannot archive in-use asset" : "Remove from library"}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Asset High-Resolution Preview & Link Modal */}
      <MediaPreviewModal
        asset={selectedAssetForPreview}
        isOpen={Boolean(selectedAssetForPreview)}
        onClose={() => setSelectedAssetForPreview(null)}
        onDelete={(asset) => handleDelete(asset)}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Remove Media from Library"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to delete{" "}
              <strong className="text-[#122452] font-semibold">
                &ldquo;{deleteTarget.filename}&rdquo;
              </strong>
              ? The asset will be archived in your library. Its file and metadata remain stored so saved content continues to work. This action does not permanently purge the file.
            </span>
          ) : ""
        }
        confirmLabel="Remove from Library"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminPageWrapper>
  );
}

