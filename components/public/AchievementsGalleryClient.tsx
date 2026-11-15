"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Achievement } from "@/types/content.types";
import PosterLightbox from "./PosterLightbox";
import { Search, Calendar, Tag, MapPin, Maximize2, X, Filter } from "lucide-react";

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

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialAchievements.map((a) => a.year))).sort((a, b) => b - a);
    return years;
  }, [initialAchievements]);

  const categories = ["all", "Events", "Awards", "Initiatives", "Academic"];

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
        const matchesSummary = item.summary.toLowerCase().includes(q);
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
    <div className="space-y-8">
      {/* Filter and Search Bar Controls (R01) */}
      <div className="bg-white rounded-2xl border border-[#DFE3EA] p-4 sm:p-6 shadow-xs space-y-4">
        {/* Top: Search and Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#596579] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements by milestone, exam, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFE3EA] text-xs sm:text-sm text-[#172033] bg-[#FAF8F3] focus:bg-white focus:border-[#B68A35] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#596579]">
            <span>
              Showing <strong className="text-[#122452]">{filteredAchievements.length}</strong> of{" "}
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
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#DFE3EA]">
          {/* Year Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#122452] mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#B68A35]" />
              Year:
            </span>
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedYear === "all"
                  ? "bg-[#122452] text-white"
                  : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200"
              }`}
            >
              All Years
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(String(yr))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedYear === String(yr)
                    ? "bg-[#122452] text-white"
                    : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="hidden lg:block h-5 w-px bg-[#DFE3EA] mx-2" />

          {/* Category Filter */}
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
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#122452] text-white"
                    : "bg-[#FAF8F3] text-[#596579] hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Visual Gallery Grid (Image-First with Hover Text Overlay) */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DFE3EA] p-12 text-center space-y-3">
          <p className="font-serif font-bold text-lg text-[#122452]">No achievements found</p>
          <p className="text-xs sm:text-sm text-[#596579] max-w-md mx-auto">
            No achievement records match your current filter selection. Try clearing the search query or selecting a different year.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-[#B68A35] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="relative aspect-[3/4] sm:aspect-[4/5] bg-slate-900 rounded-[8px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-[#DFE3EA]"
            >
              {/* Only Image in Normal State */}
              <Image
                src={item.imageUrl}
                unoptimized={item.imageUrl.startsWith("https://")}
                alt={item.altText || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                className="object-cover object-center w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* On Hover: Text Overlay with Smooth Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6 text-white pointer-events-none">
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-[8px] bg-[#B68A35] text-white text-[10px] font-bold capitalize tracking-wide shadow-xs">
                      {item.category}
                    </span>
                    <span className="text-white/85 text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B68A35]" />
                      {item.year}
                    </span>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="text-white/85 text-xs font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B68A35]" />
                      {item.campus}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug drop-shadow-md">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#B68A35]">
                    <span className="flex items-center gap-1.5 group-hover:underline">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Click to preview poster</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal (R02) */}
      <PosterLightbox
        achievement={activeLightbox}
        allAchievements={filteredAchievements}
        onClose={() => setActiveLightbox(null)}
        onNavigate={(item) => setActiveLightbox(item)}
      />
    </div>
  );
}

