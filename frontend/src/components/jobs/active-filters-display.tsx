"use client";

import { X } from "lucide-react";
import type { UnifiedFilterState } from "@/lib/unified-filter-types";
import { getFilterLabel } from "@/lib/unified-filter-types";

interface ActiveFiltersDisplayProps {
  filters: UnifiedFilterState;
  onRemoveFilter: (filterType: string, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  const activeFilters: Array<{ type: string; value: string; label: string }> =
    [];

  // Collect all active filters
  if (filters.locations.size > 0) {
    filters.locations.forEach((val) => {
      activeFilters.push({
        type: "locations",
        value: val,
        label: val,
      });
    });
  }

  if (filters.industries.size > 0) {
    filters.industries.forEach((val) => {
      activeFilters.push({
        type: "industries",
        value: val,
        label: val,
      });
    });
  }

  if (filters.experienceLevels.size > 0) {
    filters.experienceLevels.forEach((val) => {
      activeFilters.push({
        type: "experienceLevels",
        value: val,
        label: val
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      });
    });
  }

  if (filters.employmentTypes.size > 0) {
    filters.employmentTypes.forEach((val) => {
      activeFilters.push({
        type: "employmentTypes",
        value: val,
        label: val
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      });
    });
  }

  if (filters.jobFunctions.size > 0) {
    filters.jobFunctions.forEach((val) => {
      activeFilters.push({
        type: "jobFunctions",
        value: val,
        label: val,
      });
    });
  }

  if (filters.salaryRanges.size > 0) {
    filters.salaryRanges.forEach((val) => {
      activeFilters.push({
        type: "salaryRanges",
        value: val,
        label: val,
      });
    });
  }

  if (filters.companySizes.size > 0) {
    filters.companySizes.forEach((val) => {
      activeFilters.push({
        type: "companySizes",
        value: val,
        label: val,
      });
    });
  }

  if (filters.skills.size > 0) {
    filters.skills.forEach((val) => {
      activeFilters.push({
        type: "skills",
        value: val,
        label: val,
      });
    });
  }

  if (filters.jobLevels.size > 0) {
    filters.jobLevels.forEach((val) => {
      activeFilters.push({
        type: "jobLevels",
        value: val,
        label: val
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      });
    });
  }

  if (filters.datePosted.size > 0) {
    filters.datePosted.forEach((val) => {
      activeFilters.push({
        type: "datePosted",
        value: val,
        label: val,
      });
    });
  }

  if (filters.searchQuery) {
    activeFilters.push({
      type: "searchQuery",
      value: filters.searchQuery,
      label: `Search: "${filters.searchQuery}"`,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">
          Applied Filters ({activeFilters.length})
        </h4>
        <button
          onClick={onClearAll}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, idx) => (
          <div
            key={`${filter.type}-${filter.value}-${idx}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full hover:bg-slate-700 transition"
          >
            <span className="text-xs text-slate-300">{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="text-slate-500 hover:text-white transition"
              title="Remove filter"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
