"use client";

import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageLoader from "@/components/ui/PageLoader";
import { useAdminData } from "@/components/admin/useAdminData";
import { Program } from "@/types/content.types";
import { Edit2, MapPin } from "lucide-react";

export default function AdminProgramsPage() {
  const { data: programs, error, loaded } = useAdminData<Program[]>("/api/admin/programs", "programs", []);

  return (
    <AdminPageWrapper title="Programs & Courses">
      <div className="space-y-6">
        {error && <p role="alert" className="p-4 bg-red-50 text-red-800">{error}</p>}
        {!loaded ? (
          <PageLoader fullScreen={false} size={200} />
        ) : (
        <div className="bg-white rounded-2xl border border-[#DFE3EA] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#DFE3EA] flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#122452]">
                Active Coaching Curricula ({programs.length})
              </h2>
              <p className="text-xs text-[#596579]">
                Manage syllabus, eligibility criteria, and batch offerings.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#DFE3EA]">
            {programs.map((prog) => (
              <div key={prog.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F3]/60 transition-colors">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#122452]/5 text-[#122452] font-semibold text-xs">
                      {prog.targetAudience}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-[#596579] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
                      Puducherry & Karaikal
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#122452]">
                    {prog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#596579] line-clamp-2">
                    {prog.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    {prog.status}
                  </span>
                  <Link
                    href={`/admin/programs/${prog.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE3EA] hover:border-[#B68A35] text-xs font-semibold text-[#122452] hover:text-[#B68A35] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </AdminPageWrapper>
  );
}

