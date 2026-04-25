"use client";

// This component is for HR/Recruiter to find candidates
// Uses the same unified filter system as job seekers

import { useState } from "react";
import { ChevronDown, Filter, Search, Users } from "lucide-react";
import {
  LOCATIONS,
  INDUSTRIES_EXTENDED,
  EXPERIENCE_LEVELS_EXTENDED,
  EMPLOYMENT_TYPES_EXTENDED,
  SORT_OPTIONS,
} from "@/lib/unified-filters";
import type { FilterState, SortOption } from "@/lib/job-board-types";

interface RecruiterFilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  candidateCount: number;
}

export function RecruiterFilterPanel({
  filters,
  onFilterChange,
  candidateCount,
}: RecruiterFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    location: true,
    industry: false,
    experience: false,
    employment: false,
  });

  const toggleSection = (
    section: "search" | "location" | "industry" | "experience" | "employment"
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLocationToggle = (location: string) => {
    const newSet = new Set(filters.locations);
    if (newSet.has(location)) {
      newSet.delete(location);
    } else {
      newSet.add(location);
    }
    onFilterChange({ ...filters, locations: newSet });
  };

  const handleIndustryToggle = (industry: string) => {
    const newSet = new Set(filters.industries);
    if (newSet.has(industry)) {
      newSet.delete(industry);
    } else {
      newSet.add(industry);
    }
    onFilterChange({ ...filters, industries: newSet });
  };

  const handleExperienceToggle = (exp: string) => {
    const newSet = new Set(filters.experienceLevels);
    if (newSet.has(exp as any)) {
      newSet.delete(exp as any);
    } else {
      newSet.add(exp as any);
    }
    onFilterChange({ ...filters, experienceLevels: newSet });
  };

  const handleEmploymentToggle = (emp: string) => {
    const newSet = new Set(filters.employmentTypes);
    if (newSet.has(emp as any)) {
      newSet.delete(emp as any);
    } else {
      newSet.add(emp as any);
    }
    onFilterChange({ ...filters, employmentTypes: newSet });
  };

  const handleSortChange = (sort: SortOption) => {
    onFilterChange({ ...filters, sortBy: sort });
  };

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleClearAll = () => {
    onFilterChange({
      locations: new Set(),
      industries: new Set(),
      experienceLevels: new Set(),
      employmentTypes: new Set(),
      searchQuery: "",
      sortBy: "most-recent",
    });
  };

  const hasActiveFilters =
    filters.locations.size > 0 ||
    filters.industries.size > 0 ||
    filters.experienceLevels.size > 0 ||
    filters.employmentTypes.size > 0 ||
    filters.searchQuery.trim().length > 0;

  const FilterSection = ({
    title,
    section,
    options,
    activeFilters,
    onToggle,
  }: {
    title: string;
    section: "search" | "location" | "industry" | "experience" | "employment";
    options: any[];
    activeFilters: Set<any>;
    onToggle: (val: string) => void;
  }) => (
    <div className="border-b border-slate-700/30 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between hover:bg-slate-800/30 -mx-3 px-3 py-2 rounded-lg transition-colors"
      >
        <span className="text-sm font-semibold text-slate-200">{title}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {options.map((option: any) => {
            const optionId = option.id || option;
            const optionLabel = option.label || option;
            const isActive = activeFilters.has(optionId);

            return (
              <label
                key={optionId}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-600 group-hover:border-slate-500"
                  }`}
                >
                  {isActive && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-emerald-300 font-medium"
                      : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {optionLabel}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-xl border border-slate-700/30 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-slate-900/50 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Find Candidates</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search candidates..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Candidate Count */}
        <div className="py-3 text-center">
          <p className="text-xs text-slate-400">
            Found <span className="font-bold text-emerald-400">{candidateCount}</span>{" "}
            candidates
          </p>
        </div>

        {/* Filter Sections - Same as Job Seeker */}
        <FilterSection
          title="Location"
          section="location"
          options={LOCATIONS.map((loc) => ({ id: loc, label: loc }))}
          activeFilters={filters.locations}
          onToggle={handleLocationToggle}
        />

        <FilterSection
          title="Industry"
          section="industry"
          options={INDUSTRIES_EXTENDED.map((ind) => ({ id: ind, label: ind }))}
          activeFilters={filters.industries}
          onToggle={handleIndustryToggle}
        />

        <FilterSection
          title="Experience Level"
          section="experience"
          options={EXPERIENCE_LEVELS_EXTENDED}
          activeFilters={filters.experienceLevels}
          onToggle={handleExperienceToggle}
        />

        <FilterSection
          title="Employment Type"
          section="employment"
          options={EMPLOYMENT_TYPES_EXTENDED}
          activeFilters={filters.employmentTypes}
          onToggle={handleEmploymentToggle}
        />
      </div>
    </div>
  );
}
