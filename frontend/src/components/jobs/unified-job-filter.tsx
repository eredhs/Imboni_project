"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  Zap,
  DollarSign,
  Users,
  Code,
  Award,
  Calendar,
  ArrowUpDown,
  Filter as FilterIcon,
  RotateCcw,
} from "lucide-react";
import type { UnifiedFilterState, FilterRole } from "@/lib/unified-filter-types";
import {
  FILTER_CATEGORIES,
  getFiltersByRole,
  COMMON_SKILLS,
} from "@/lib/unified-filters";

interface UnifiedJobFilterProps {
  filters: UnifiedFilterState;
  onFilterChange: (filters: UnifiedFilterState) => void;
  role: FilterRole;
  jobCount?: number;
  isLoading?: boolean;
}

interface ExpandedSections {
  [key: string]: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MapPin: <MapPin size={18} />,
  Briefcase: <Briefcase size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  Clock: <Clock size={18} />,
  Zap: <Zap size={18} />,
  DollarSign: <DollarSign size={18} />,
  Users: <Users size={18} />,
  Code: <Code size={18} />,
  Award: <Award size={18} />,
  Calendar: <Calendar size={18} />,
  ArrowUpDown: <ArrowUpDown size={18} />,
};

export function UnifiedJobFilter({
  filters,
  onFilterChange,
  role,
  jobCount = 0,
  isLoading = false,
}: UnifiedJobFilterProps) {
  const [expanded, setExpanded] = useState<ExpandedSections>({
    location: true,
    industry: true,
    experience: false,
    employmentType: false,
    jobFunction: false,
    salaryRange: false,
    companySize: false,
    skills: false,
    jobLevel: false,
    datePosted: false,
  });

  const [showAllSkills, setShowAllSkills] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const visibleCategories = useMemo(
    () => getFiltersByRole(role),
    [role]
  );

  const toggleExpanded = useCallback((key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleToggleFilter = useCallback(
    (filterType: keyof UnifiedFilterState, value: string) => {
      if (
        typeof filters[filterType] !== "object" ||
        !("has" in filters[filterType])
      ) {
        return;
      }

      const newSet = new Set(filters[filterType] as any);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }

      onFilterChange({
        ...filters,
        [filterType]: newSet,
        lastUpdated: new Date(),
      });
    },
    [filters, onFilterChange]
  );

  const handleClearAll = useCallback(() => {
    onFilterChange({
      ...filters,
      locations: new Set(),
      industries: new Set(),
      experienceLevels: new Set(),
      employmentTypes: new Set(),
      jobFunctions: new Set(),
      salaryRanges: new Set(),
      companySizes: new Set(),
      skills: new Set(),
      jobLevels: new Set(),
      datePosted: new Set(),
      searchQuery: "",
      sortBy: "most-recent",
      lastUpdated: new Date(),
    });
  }, [filters, onFilterChange]);

  const handleSearchChange = useCallback(
    (query: string) => {
      onFilterChange({
        ...filters,
        searchQuery: query,
        lastUpdated: new Date(),
      });
    },
    [filters, onFilterChange]
  );

  const handleSortChange = useCallback(
    (sortBy: any) => {
      onFilterChange({
        ...filters,
        sortBy,
        lastUpdated: new Date(),
      });
    },
    [filters, onFilterChange]
  );

  const activeFilterCount =
    filters.locations.size +
    filters.industries.size +
    filters.experienceLevels.size +
    filters.employmentTypes.size +
    filters.jobFunctions.size +
    filters.salaryRanges.size +
    filters.companySizes.size +
    filters.skills.size +
    filters.jobLevels.size +
    filters.datePosted.size +
    (filters.searchQuery ? 1 : 0);

  const FilterSection = ({
    categoryId,
    category,
    filterKey,
  }: {
    categoryId: string;
    category: any;
    filterKey: keyof UnifiedFilterState;
  }) => {
    const isExpanded = expanded[categoryId];
    const activeItems =
      typeof filters[filterKey] === "object" &&
      "size" in (filters[filterKey] as any)
        ? (filters[filterKey] as Set<string>).size
        : 0;

    const options = Array.isArray(category.options)
      ? category.options.map((opt: any) =>
          typeof opt === "string" ? { id: opt, label: opt } : opt
        )
      : [];

    const displayedOptions =
      categoryId === "skills" && !showAllSkills
        ? options.slice(0, 8)
        : options;

    return (
      <div key={categoryId} className="border-b border-slate-700 py-4">
        <button
          onClick={() => toggleExpanded(categoryId)}
          className="w-full flex items-center justify-between hover:opacity-80 transition"
        >
          <div className="flex items-center gap-3">
            {ICON_MAP[category.icon] && (
              <span className="text-slate-400">{ICON_MAP[category.icon]}</span>
            )}
            <span className="font-semibold text-white text-sm">
              {category.label}
            </span>
            {activeItems > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded-full">
                {activeItems}
              </span>
            )}
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-2 pl-7">
            {categoryId === "sortBy" ? (
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {options.map((opt: any) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <>
                {displayedOptions.map((opt: any) => (
                  <label
                    key={opt.id || opt}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={(filters[filterKey] as Set<string>)?.has(
                        opt.id || opt
                      )}
                      onChange={() =>
                        handleToggleFilter(filterKey, opt.id || opt)
                      }
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-300 flex-1">
                      {opt.label || opt}
                    </span>
                    {opt.count !== undefined && (
                      <span className="text-xs text-slate-500">
                        ({opt.count})
                      </span>
                    )}
                  </label>
                ))}

                {categoryId === "skills" && options.length > 8 && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-3 pl-2"
                  >
                    {showAllSkills ? "Show Less" : `Show All (${options.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex gap-2">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition"
        >
          <FilterIcon size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-auto bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`lg:block fixed lg:relative top-0 left-0 right-0 bottom-0 lg:bottom-auto z-40 lg:z-auto
        ${
          mobileFilterOpen
            ? "block bg-black/50"
            : "hidden"
        }`}
        onClick={() => mobileFilterOpen && setMobileFilterOpen(false)}
      >
        <div
          className="absolute lg:relative left-0 top-0 bottom-0 w-72 lg:w-full bg-slate-900/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-0 border-r border-slate-800 p-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FilterIcon size={20} />
              Filters
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          {jobCount > 0 && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-emerald-300">
                  {isLoading ? "Loading..." : jobCount}
                </span>
                {" "}jobs found
              </p>
            </div>
          )}

          {/* Filter Sections */}
          <div className="space-y-0 mb-6">
            {visibleCategories.map((categoryId) => {
              const category = (FILTER_CATEGORIES as any)[categoryId];
              if (!category) return null;

              let filterKey: keyof UnifiedFilterState =
                categoryId as keyof UnifiedFilterState;

              // Map category IDs to filter state keys
              const keyMap: Record<string, keyof UnifiedFilterState> = {
                location: "locations",
                industry: "industries",
                experience: "experienceLevels",
                employmentType: "employmentTypes",
                jobFunction: "jobFunctions",
                salaryRange: "salaryRanges",
                companySize: "companySizes",
                skills: "skills",
                jobLevel: "jobLevels",
                datePosted: "datePosted",
                sortBy: "sortBy",
              };

              filterKey = keyMap[categoryId] || filterKey;

              return (
                <FilterSection
                  key={categoryId}
                  categoryId={categoryId}
                  category={category}
                  filterKey={filterKey}
                />
              );
            })}
          </div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium text-sm"
            >
              <RotateCcw size={16} />
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
