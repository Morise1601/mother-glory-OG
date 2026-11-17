"use client";

import Link from "next/link";
import Image from "next/image";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageLoader from "@/components/ui/PageLoader";
import { useAdminData } from "@/components/admin/useAdminData";
import { Program } from "@/types/content.types";
import { Edit2, MapPin, GraduationCap, Image as ImageIcon } from "lucide-react";

export default function AdminProgramsPage() {
  const { data: programs, error, loaded } = useAdminData<Program[]>("/api/admin/programs", "programs", []);

  return (
    <AdminPageWrapper title="Programs & Courses">
      <div className="space-y-6 select-text">
        {error && (
          <p role="alert" className="p-4 rounded-[8px] bg-red-50 text-red-800 text-xs font-medium">
            {error}
          </p>
        )}
        {!loaded ? (
          <PageLoader fullScreen={false} size={200} />
        ) : (
          <div className="bg-white rounded-[8px] border border-[#DFE3EA] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#DFE3EA] flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#122452]">
                  Active Coaching Curricula ({programs.length})
                </h2>
                <p className="text-xs text-[#596579] mt-0.5">
                  Manage syllabus, cover images, eligibility criteria, and batch offerings.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#DFE3EA]">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F3]/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Program Thumbnail */}
                    <div className="relative w-20 h-14 rounded-[8px] bg-slate-100 border border-[#DFE3EA] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                      {prog.imageUrl ? (
                        <Image
                          src={prog.imageUrl}
                          alt={prog.title}
                          fill
                          unoptimized={prog.imageUrl.startsWith("https://")}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 text-[10px]">
                          <ImageIcon className="w-4 h-4 text-slate-300 mb-0.5" />
                          <span>No cover</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-[6px] bg-[#122452]/5 text-[#122452] font-semibold text-xs inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-[#B68A35]" />
                          <span>{prog.targetAudience}</span>
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-[#596579] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
                          Puducherry &amp; Karaikal
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#122452] truncate">
                        {prog.title}
                      </h3>

                      <p className="text-xs text-[#596579] line-clamp-1">
                        {prog.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold border ${
                        prog.status === "published"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {prog.status}
                    </span>
                    <Link
                      href={`/admin/programs/${prog.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#DFE3EA] hover:border-[#B68A35] text-xs font-semibold text-[#122452] hover:text-[#B68A35] transition-colors bg-white shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Course</span>
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
