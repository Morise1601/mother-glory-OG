"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PageLoader from "@/components/ui/PageLoader";
import AchievementEditorSheet from "@/components/admin/AchievementEditorSheet";
import PosterLightbox from "@/components/public/PosterLightbox";
import { useAdminData } from "@/components/admin/useAdminData";
import { adminRequest } from "@/lib/admin/api";
import { Achievement } from "@/types/content.types";
import { PlusCircle, Search, Edit2, Trash2, Calendar, Eye, MapPin, Tag, Award } from "lucide-react";

export default function AdminAchievementsPage() {
  const { data: achievements, setData: setAchievements, error, setError, loaded } = useAdminData<Achievement[]>("/api/admin/achievements", "achievements", []);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sheet state for adding and editing achievements
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  // Lightbox preview for full-width inspection
  const [previewItem, setPreviewItem] = useState<Achievement | null>(null);

  // Check query params on load: ?new=true or ?edit=ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("new") === "true") {
        setEditingItem(null);
        setSheetOpen(true);
      } else {
        const editId = params.get("edit");
        if (editId && achievements.length > 0) {
          const match = achievements.find((a) => a.id === editId);
          if (match) {
            setEditingItem(match);
            setSheetOpen(true);
          }
        }
      }
    }
  }, [achievements]);

  // Unique years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(achievements.map((a) => a.year))).sort((a, b) => b - a);
    return years;
  }, [achievements]);

  // Filter achievements
  const filtered = useMemo(() => {
    return achievements.filter((a) => {
      if (selectedYear !== "all" && a.year !== Number(selectedYear)) {
        return false;
      }
      if (selectedCategory !== "all" && a.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          (a.summary ? a.summary.toLowerCase().includes(q) : false) ||
          (a.slug ? a.slug.toLowerCase().includes(q) : false)
        );
      }
      return true;
    });
  }, [achievements, selectedYear, selectedCategory, search]);

  // Group filtered achievements by academic year
  const groupedByYear = useMemo(() => {
    const groups: { year: number; items: Achievement[] }[] = [];
    const yearsToIterate =
      selectedYear === "all"
        ? availableYears
        : availableYears.filter((y) => String(y) === selectedYear);

    for (const yr of yearsToIterate) {
      const itemsInYear = filtered.filter((a) => a.year === yr);
      if (itemsInYear.length > 0) {
        groups.push({ year: yr, items: itemsInYear });
      }
    }

    // Handle any orphaned records if year is not in availableYears
    const groupedIds = new Set(groups.flatMap((g) => g.items.map((i) => i.id)));
    const remaining = filtered.filter((a) => !groupedIds.has(a.id));
    if (remaining.length > 0) {
      groups.push({ year: 0, items: remaining });
    }

    return groups;
  }, [filtered, availableYears, selectedYear]);

  const handleOpenAddSheet = () => {
    setEditingItem(null);
    setSheetOpen(true);
  };

  const handleOpenEditSheet = (item: Achievement) => {
    setEditingItem(item);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingItem(null);

    // Clean up query params if present without reloading
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const handleAchievementSaved = (saved: Achievement) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    handleCloseSheet();
  };

  const handleDelete = (item: Achievement) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminRequest("/api/admin/achievements", {
        method: "DELETE",
        body: JSON.stringify({ id: deleteTarget.id, version: deleteTarget.version }),
      });
      setAchievements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not delete achievement.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPageWrapper
      title="Achievements Manager"
      primaryAction={
        <button
          type="button"
          onClick={handleOpenAddSheet}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Achievement</span>
        </button>
      }
    >
      {!loaded ? (
        <PageLoader fullScreen={false} size={200} />
      ) : (
        <div className="space-y-6">
          {error && (
            <p role="alert" className="p-4 rounded-[8px] bg-red-50 text-red-800 text-xs font-medium">
              {error}
            </p>
          )}

          {/* Quick Academic Year Filter Tabs */}
          <div className="bg-white rounded-[8px] border border-[#DFE3EA] p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DFE3EA]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B68A35]" />
                <span className="text-xs font-bold text-[#122452] uppercase tracking-wider">
                  Academic Year Filter:
                </span>
              </div>
              <div className="text-xs text-[#596579]">
                Showing <strong className="text-[#122452] font-semibold">{filtered.length}</strong> of{" "}
                {achievements.length} total achievements
              </div>
            </div>

            {/* Year Pills Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedYear("all")}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                  selectedYear === "all"
                    ? "bg-[#122452] text-white shadow-xs"
                    : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                }`}
              >
                All Years ({achievements.length})
              </button>
              {availableYears.map((yr) => {
                const countForYear = achievements.filter((a) => a.year === yr).length;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(String(yr))}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedYear === String(yr)
                        ? "bg-[#122452] text-white shadow-xs"
                        : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                    }`}
                  >
                    <span>{yr}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-[6px] ${
                        selectedYear === String(yr) ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {countForYear}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#DFE3EA]">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search achievements by title, student, or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#596579] font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#B68A35]" />
                  Category:
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-[8px] border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:border-[#B68A35] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Awards">Awards</option>
                  <option value="Events">Events</option>
                  <option value="Initiatives">Initiatives</option>
                </select>
              </div>
            </div>
          </div>

          {/* Year-Wise Grouped Achievements List */}
          {groupedByYear.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#DFE3EA] p-12 text-center space-y-3 shadow-xs">
              <Award className="w-8 h-8 text-[#B68A35] mx-auto" />
              <p className="font-serif font-bold text-base text-[#122452]">No achievements found</p>
              <p className="text-xs text-[#596579] max-w-sm mx-auto">
                No achievement milestones match your selected year or filter query.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedByYear.map((group) => (
                <div
                  key={group.year}
                  className="bg-white rounded-[8px] border border-[#DFE3EA] overflow-hidden shadow-xs"
                >
                  {/* Year Group Header Banner */}
                  <div className="bg-[#FAF8F3] px-5 py-3.5 border-b border-[#DFE3EA] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-[#122452] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#B68A35]" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#122452]">
                          {group.year === 0 ? "Other Milestones" : `Academic Year ${group.year}`}
                        </span>
                        <span className="text-xs text-[#596579] ml-2 font-medium">
                          ({group.items.length} {group.items.length === 1 ? "milestone" : "milestones"})
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-[#B68A35] font-semibold">
                      Mother Glory Archive
                    </span>
                  </div>

                  {/* Year Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white border-b border-[#DFE3EA] text-[#596579] font-semibold uppercase tracking-wider text-[11px]">
                          <th className="p-4 w-28">Poster</th>
                          <th className="p-4">Title &amp; Milestone Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Campus</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DFE3EA]">
                        {group.items.map((item) => (
                          <tr key={item.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                            {/* Enhanced Poster Thumbnail (Wide, Object-Contain, Click-to-Preview) */}
                            <td className="p-4">
                              <div
                                onClick={() => setPreviewItem(item)}
                                className="relative w-16 h-14 rounded-[8px] bg-slate-100 overflow-hidden shrink-0 border border-[#DFE3EA] hover:border-[#B68A35] transition-all cursor-pointer shadow-xs group/thumb flex items-center justify-center"
                                title="Click to preview full poster"
                              >
                                {item.imageUrl ? (
                                  <>
                                    <Image
                                      src={item.imageUrl}
                                      unoptimized={item.imageUrl.startsWith("https://")}
                                      alt={item.title}
                                      fill
                                      sizes="64px"
                                      className="object-contain p-1"
                                    />
                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                      <Eye className="w-4 h-4 text-white drop-shadow" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                                    No img
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Title & Details */}
                            <td className="p-4 max-w-sm">
                              <p className="font-serif font-bold text-sm text-[#122452] line-clamp-1">
                                {item.title}
                              </p>
                              {item.summary ? (
                                <p className="text-[11px] text-[#596579] line-clamp-1 mt-0.5">
                                  {item.summary}
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic mt-0.5">
                                  No short summary provided
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 font-mono mt-1">
                                /{item.slug}
                              </p>
                            </td>

                            {/* Category Badge */}
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-[8px] bg-[#122452]/5 text-[#122452] font-semibold text-[11px] border border-[#122452]/10 inline-block">
                                {item.category}
                              </span>
                            </td>

                            {/* Campus */}
                            <td className="p-4 text-slate-600">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#596579]">
                                <MapPin className="w-3 h-3 text-[#B68A35]" />
                                {item.campus} Campus
                              </span>
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-[8px] font-semibold text-[11px] border inline-block ${
                                  item.status === "published"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewItem(item)}
                                  className="p-1.5 rounded-[8px] border border-[#DFE3EA] hover:border-[#122452] text-[#596579] hover:text-[#122452] transition-colors cursor-pointer"
                                  title="Preview Full Poster"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSheet(item)}
                                  className="p-1.5 rounded-[8px] border border-[#DFE3EA] hover:border-[#B68A35] text-[#122452] hover:text-[#B68A35] transition-colors cursor-pointer"
                                  title="Edit Achievement"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  className="p-1.5 rounded-[8px] border border-[#DFE3EA] hover:border-red-300 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete Achievement"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slide-over Sheet for Adding / Editing Achievements */}
      <AchievementEditorSheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        onSaved={handleAchievementSaved}
        initialData={editingItem}
      />

      {/* Lightbox Poster Preview Modal for Admin */}
      <PosterLightbox
        achievement={previewItem}
        allAchievements={filtered}
        onClose={() => setPreviewItem(null)}
        onNavigate={(item) => setPreviewItem(item)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to delete{" "}
              <strong className="text-[#122452] font-semibold">
                &ldquo;{deleteTarget.title}&rdquo;
              </strong>
              ? This milestone record and poster image reference will be removed.
            </span>
          ) : ""
        }
        confirmLabel="Delete Achievement"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminPageWrapper>
  );
}
