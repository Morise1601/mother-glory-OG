"use client";

import { useState, useMemo } from "react";
import { Achievement } from "@/types/content.types";
import PosterLightbox from "./PosterLightbox";
import { Search, Calendar, Tag, MapPin, Maximize2, X, ArrowRight, Award } from "lucide-react";

interface AchievementsGalleryClientProps {
  initialAchievements: Achievement[];
}

export default function AchievementsGalleryClient({
  initialAchievements,
}: AchievementsGalleryClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLightbox, setActiveLightbox] = useState<Achievement | null>(null);

  // Extract unique years sorted descending
  const availableYears = useMemo(() => {
    return Array.from(new Set(initialAchievements.map((a) => a.year))).sort((a, b) => b - a);
  }, [initialAchievements]);

  const categories = ["all", "Academic", "Awards", "Events", "Initiatives"];
  const campuses = ["all", "Puducherry", "Karaikal", "Both"];

  const filteredAchievements = useMemo(() => {
    return initialAchievements.filter((item) => {
      if (selectedYear !== "all" && item.year !== Number(selectedYear)) {
        return false;
      }
      if (selectedCategory !== "all" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedCampus !== "all") {
        if (item.campus !== selectedCampus && item.campus !== "Both") {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary ? item.summary.toLowerCase().includes(q) : false;
        const matchesCaption = item.caption ? item.caption.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesSummary && !matchesCaption) {
          return false;
        }
      }
      return true;
    });
  }, [initialAchievements, selectedYear, selectedCategory, selectedCampus, searchQuery]);

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedCategory("all");
    setSelectedCampus("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedYear !== "all" ||
    selectedCategory !== "all" ||
    selectedCampus !== "all" ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-8 select-text">
      {/* Filter and Search Bar Controls with Strict 8px Border Radius */}
      <div className="bg-white rounded-[8px] border border-[#DFE3EA] p-4 sm:p-6 shadow-xs space-y-4">
        {/* Top: Search and Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#596579] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements by milestone, exam, or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-[8px] border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#596579]">
            <span>
              Showing <strong className="text-[#122452] font-semibold">{filteredAchievements.length}</strong> of{" "}
              {initialAchievements.length} achievements
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[#B68A35] hover:text-[#9c7328] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Row: Year, Category, Campus */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#DFE3EA]">
          {/* Year Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#122452] mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#B68A35]" />
              Year:
            </span>
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${selectedYear === "all"
                ? "bg-[#122452] text-white shadow-xs"
                : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                }`}
            >
              All Years
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(String(yr))}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${selectedYear === String(yr)
                  ? "bg-[#122452] text-white shadow-xs"
                  : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                  }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="hidden lg:block h-5 w-px bg-[#DFE3EA]" />

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#122452] mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#B68A35]" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors capitalize cursor-pointer ${selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#122452] text-white shadow-xs"
                  : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                  }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="hidden xl:block h-5 w-px bg-[#DFE3EA]" />

          {/* Campus Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#122452] mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B68A35]" />
              Campus:
            </span>
            {campuses.map((camp) => (
              <button
                key={camp}
                type="button"
                onClick={() => setSelectedCampus(camp)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${selectedCampus === camp
                  ? "bg-[#122452] text-white shadow-xs"
                  : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200 border border-[#DFE3EA]"
                  }`}
              >
                {camp === "all" ? "All Campuses" : camp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Innovative Masonry View - Image-First (No Card, Title on Hover) */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-[8px] border border-[#DFE3EA] p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-[8px] bg-[#FAF8F3] border border-[#DFE3EA] flex items-center justify-center mx-auto text-[#B68A35]">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-serif font-bold text-lg text-[#122452]">No achievements found</p>
            <p className="text-xs sm:text-sm text-[#596579] max-w-md mx-auto">
              No achievement records match your current filter selection. Try clearing search filters or choosing another academic year.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 rounded-[8px] bg-[#B68A35] hover:bg-[#9c7328] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 [column-fill:_balance]">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative overflow-hidden rounded-[8px] bg-slate-900 border border-[#DFE3EA] shadow-xs hover:shadow-2xl hover:border-[#B68A35] transition-all duration-300 cursor-pointer break-inside-avoid mb-2 inline-block w-full"
            >
              {/* Pure Image with Natural Aspect Ratio & Strict 8px Border Radius */}
              <img
                src={item.imageUrl}
                alt={item.altText || item.title}
                className="w-full h-auto block rounded-[8px] object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                loading="lazy"
              />

              {/* Minimal Ambient Corner Badge (Fades on Hover) */}
              <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-[6px] bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 opacity-90 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none shadow-xs">
                {item.year}
              </span>

              {/* Innovative & Attractive Hover Overlay: Smooth Frosted Gradient Revealing Title & Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 rounded-[8px] backdrop-blur-[1.5px] pointer-events-none">
                {/* Top Overlay Strip */}
                <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-[6px] bg-[#B68A35] text-white text-[10px] font-bold shadow-xs">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-[6px] bg-white/20 text-white text-[10px] font-semibold backdrop-blur-md border border-white/10">
                      Academic Year {item.year}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-[6px] bg-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-xs border border-white/10">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Overlay Strip: Title & Milestone Info */}
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-white/80">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#B68A35]" />
                      {item.campus} Campus
                    </span>
                    {item.verificationStatus === "verified" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-snug drop-shadow-md">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#B68A35]">
                    <span>Click to preview poster</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snug Lightbox Modal Fitting the Image Naturally with Strict 8px Border Radius */}
      <PosterLightbox
        achievement={activeLightbox}
        allAchievements={filteredAchievements}
        onClose={() => setActiveLightbox(null)}
        onNavigate={(item) => setActiveLightbox(item)}
      />
    </div>
  );
}
