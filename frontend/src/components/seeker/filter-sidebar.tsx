"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterOption, ExperienceLevel, EmploymentType } from "@/lib/job-board-types";

interface FilterSidebarProps {
  onLocationChange: (locations: Set<string>) => void;
  onIndustryChange: (industries: Set<string>) => void;
  onExperienceLevelChange: (levels: Set<ExperienceLevel>) => void;
  onEmploymentTypeChange: (types: Set<EmploymentType>) => void;
  onClearAll: () => void;

  // Filter data
  locationOptions: FilterOption[];
  industryOptions: FilterOption[];
  experienceLevelOptions: FilterOption[];
  employmentTypeOptions: FilterOption[];

  // Active filters
  activeLocations: Set<string>;
  activeIndustries: Set<string>;
  activeExperienceLevels: Set<ExperienceLevel>;
  activeEmploymentTypes: Set<EmploymentType>;
}

interface ExpandedState {
  location: boolean;
  industry: boolean;
  experience: boolean;
  employment: boolean;
}

export function FilterSidebar({
  onLocationChange,
  onIndustryChange,
  onExperienceLevelChange,
  onEmploymentTypeChange,
  onClearAll,
  locationOptions,
  industryOptions,
  experienceLevelOptions,
  employmentTypeOptions,
  activeLocations,
  activeIndustries,
  activeExperienceLevels,
  activeEmploymentTypes,
}: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({
    location: true,
    industry: true,
    experience: false,
    employment: false,
  });

  const hasActiveFilters =
    activeLocations.size > 0 ||
    activeIndustries.size > 0 ||
    activeExperienceLevels.size > 0 ||
    activeEmploymentTypes.size > 0;

  const handleLocationToggle = (location: string) => {
    const newSet = new Set(activeLocations);
    if (newSet.has(location)) {
      newSet.delete(location);
    } else {
      newSet.add(location);
    }
    onLocationChange(newSet);
  };

  const handleIndustryToggle = (industry: string) => {
    const newSet = new Set(activeIndustries);
    if (newSet.has(industry)) {
      newSet.delete(industry);
    } else {
      newSet.add(industry);
    }
    onIndustryChange(newSet);
  };

  const handleExperienceLevelToggle = (level: ExperienceLevel) => {
    const newSet = new Set(activeExperienceLevels);
    if (newSet.has(level)) {
      newSet.delete(level);
    } else {
      newSet.add(level);
    }
    onExperienceLevelChange(newSet);
  };

  const handleEmploymentTypeToggle = (type: EmploymentType) => {
    const newSet = new Set(activeEmploymentTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    onEmploymentTypeChange(newSet);
  };

  const toggleExpanded = (key: keyof ExpandedState) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-56 bg-white border-r border-[#E5E7EB] px-6 py-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#111827]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-[#5856D6] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#111827] mb-3">Location</label>
        <select
          multiple
          size={5}
          value={Array.from(activeLocations)}
          onChange={(e) => {
            const selected = new Set(
              Array.from(e.target.selectedOptions).map((option) => option.value)
            );
            onLocationChange(selected);
          }}
          className="w-full border border-[#D1D5DB] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5856D6] overflow-y-auto bg-white"
          style={{
            maxHeight: "150px",
            scrollbarWidth: "thin",
          }}
        >
          {locationOptions.map((option, idx) => (
            <option
              key={`location-${idx}-${option.label}`}
              value={option.label}
              className="py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#6B7280] mt-2">Hold Ctrl/Cmd to select multiple</p>
      </div>

      {/* Industry Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#111827] mb-3">Industry</label>
        <select
          multiple
          size={5}
          value={Array.from(activeIndustries)}
          onChange={(e) => {
            const selected = new Set(
              Array.from(e.target.selectedOptions).map((option) => option.value)
            );
            onIndustryChange(selected);
          }}
          className="w-full border border-[#D1D5DB] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5856D6] overflow-y-auto bg-white"
          style={{
            maxHeight: "150px",
            scrollbarWidth: "thin",
          }}
        >
          {industryOptions.map((option, idx) => (
            <option
              key={`industry-${idx}-${option.label}`}
              value={option.label}
              className="py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#6B7280] mt-2">Hold Ctrl/Cmd to select multiple</p>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleExpanded("experience")}
          className="w-full flex items-center justify-between py-3 hover:bg-[#F9FAFB] rounded-lg px-2"
        >
          <span className="font-semibold text-[#111827]">Experience Level</span>
          <ChevronDown
            className={`w-4 h-4 text-[#6B7280] transition-transform ${
              expanded.experience ? "rotate-180" : ""
            }`}
          />
        </button>
        {expanded.experience && (
          <div className="space-y-2 pl-2">
            {experienceLevelOptions.map((option, idx) => (
              <label
                key={`experience-${idx}-${option.id}`}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#F9FAFB] px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={activeExperienceLevels.has(option.id as ExperienceLevel)}
                  onChange={() =>
                    handleExperienceLevelToggle(option.id as ExperienceLevel)
                  }
                  className="w-4 h-4 rounded accent-[#5856D6]"
                />
                <span className="text-sm text-[#6B7280] flex-1">{option.label}</span>
                <span className="text-xs text-[#9CA3AF] font-medium">{option.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Employment Type Filter */}
      <div>
        <button
          onClick={() => toggleExpanded("employment")}
          className="w-full flex items-center justify-between py-3 hover:bg-[#F9FAFB] rounded-lg px-2"
        >
          <span className="font-semibold text-[#111827]">Employment Type</span>
          <ChevronDown
            className={`w-4 h-4 text-[#6B7280] transition-transform ${
              expanded.employment ? "rotate-180" : ""
            }`}
          />
        </button>
        {expanded.employment && (
          <div className="space-y-2 pl-2">
            {employmentTypeOptions.map((option, idx) => (
              <label
                key={`employment-${idx}-${option.id}`}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#F9FAFB] px-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={activeEmploymentTypes.has(option.id as EmploymentType)}
                  onChange={() =>
                    handleEmploymentTypeToggle(option.id as EmploymentType)
                  }
                  className="w-4 h-4 rounded accent-[#5856D6]"
                />
                <span className="text-sm text-[#6B7280] flex-1">{option.label}</span>
                <span className="text-xs text-[#9CA3AF] font-medium">{option.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
