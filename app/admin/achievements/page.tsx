"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminData } from "@/components/admin/useAdminData";
import { adminRequest } from "@/lib/admin/api";
import { Achievement } from "@/types/content.types";
import { PlusCircle, Search, Edit2, Trash2 } from "lucide-react";

export default function AdminAchievementsPage() {
  const { data: achievements, setData: setAchievements, error, setError } = useAdminData<Achievement[]>("/api/admin/achievements", "achievements", []);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

  const filtered = achievements.filter((a) => {
    if (selectedCategory !== "all" && a.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = (item: Achievement) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminRequest("/api/admin/achievements", { method: "DELETE", body: JSON.stringify({ id: deleteTarget.id, version: deleteTarget.version }) });
      setAchievements(prev => prev.filter(a => a.id !== deleteTarget.id)); setDeleteTarget(null);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not delete achievement."); setDeleteTarget(null); }
  };

  return (
    <AdminPageWrapper
      title="Achievements Manager"
      primaryAction={
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Achievement</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {error && <p role="alert" className="p-4 bg-red-50 text-red-800">{error}</p>}
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-[#596579] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DFE3EA] text-xs text-[#172033] bg-[#FAF8F3] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#596579] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#DFE3EA] text-xs bg-[#FAF8F3] text-[#172033] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Awards">Awards</option>
              <option value="Events">Events</option>
              <option value="Initiatives">Initiatives</option>
            </select>
          </div>
        </div>

        {/* Achievements Table */}
        <div className="bg-white rounded-2xl border border-[#DFE3EA] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#DFE3EA] text-[#596579] font-semibold uppercase tracking-wider">
                  <th className="p-4">Poster</th>
                  <th className="p-4">Title & Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Year & Campus</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE3EA]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl}
                unoptimized={item.imageUrl.startsWith('https://')}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-serif font-bold text-sm text-[#122452] line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#596579] line-clamp-1 mt-0.5">
                        {item.summary}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#122452]/5 text-[#122452] font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <p className="font-semibold text-[#122452]">{item.year}</p>
                      <p className="text-[11px] text-slate-500">{item.campus} Campus</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/achievements/${item.id}`}
                          className="p-1.5 rounded-lg border border-[#DFE3EA] hover:border-[#B68A35] text-[#122452] hover:text-[#B68A35] transition-colors"
                          title="Edit Achievement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-[#DFE3EA] hover:border-red-300 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
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
      </div>

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
              ? This milestone record and poster link will be removed.
            </span>
          ) : ""
        }
        confirmLabel="Delete Achievement"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminPageWrapper>
  );
}

