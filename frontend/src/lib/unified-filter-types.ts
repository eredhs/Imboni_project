// Unified Filter Types - Used by both Job Seeker and Recruiter

export type FilterRole = 'job_seeker' | 'recruiter';
export type SortOption = 'most-recent' | 'most-relevant' | 'closing-soon' | 'salary-high' | 'salary-low';
export type ExperienceLevel = 'internship' | 'entry-level' | 'associate' | 'mid-level' | 'senior' | 'lead' | 'director' | 'other';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'temporary' | 'internship' | 'volunteer' | 'other';
export type DatePosted = 'last-24h' | 'last-7d' | 'last-30d' | 'last-90d' | 'any';
export type JobLevel = 'c-suite' | 'vp-director' | 'manager' | 'senior' | 'mid' | 'junior' | 'entry' | 'other';

/**
 * Unified Filter State - Used across both Job Seeker and Recruiter
 * Both user types use the same filter schema for consistency
 */
export interface UnifiedFilterState {
  // Multi-select filters
  locations: Set<string>;
  industries: Set<string>;
  experienceLevels: Set<ExperienceLevel>;
  employmentTypes: Set<EmploymentType>;
  jobFunctions: Set<string>;
  salaryRanges: Set<string>;
  companySizes: Set<string>;
  skills: Set<string>;
  jobLevels: Set<JobLevel>;
  datePosted: Set<DatePosted>;

  // Single-select filters
  sortBy: SortOption;
  
  // Search
  searchQuery: string;

  // Metadata
  role: FilterRole;
  lastUpdated: Date;
}

/**
 * Default unified filter state
 */
export const DEFAULT_FILTER_STATE: UnifiedFilterState = {
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
  sortBy: 'most-recent',
  searchQuery: '',
  role: 'job_seeker',
  lastUpdated: new Date(),
};

/**
 * Filter Option Interface
 */
export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

/**
 * Filter Category Interface
 */
export interface FilterCategory {
  id: string;
  label: string;
  options: (FilterOption | string)[];
  type: 'multi-select' | 'single-select' | 'range' | 'search';
  icon?: string;
  description?: string;
}

/**
 * Response from API with filter metadata
 */
export interface FilterMetadata {
  totalJobs: number;
  filteredJobs: number;
  appliedFiltersCount: number;
  categories: FilterCategory[];
  lastSync: Date;
}

/**
 * Helper to serialize filter state to URL params
 */
export function filterStateToParams(filters: UnifiedFilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.locations.size > 0) {
    params.set('locations', Array.from(filters.locations).join(','));
  }
  if (filters.industries.size > 0) {
    params.set('industries', Array.from(filters.industries).join(','));
  }
  if (filters.experienceLevels.size > 0) {
    params.set('experience', Array.from(filters.experienceLevels).join(','));
  }
  if (filters.employmentTypes.size > 0) {
    params.set('employment', Array.from(filters.employmentTypes).join(','));
  }
  if (filters.jobFunctions.size > 0) {
    params.set('functions', Array.from(filters.jobFunctions).join(','));
  }
  if (filters.salaryRanges.size > 0) {
    params.set('salary', Array.from(filters.salaryRanges).join(','));
  }
  if (filters.companySizes.size > 0) {
    params.set('size', Array.from(filters.companySizes).join(','));
  }
  if (filters.skills.size > 0) {
    params.set('skills', Array.from(filters.skills).join(','));
  }
  if (filters.jobLevels.size > 0) {
    params.set('levels', Array.from(filters.jobLevels).join(','));
  }
  if (filters.datePosted.size > 0) {
    params.set('date', Array.from(filters.datePosted).join(','));
  }
  if (filters.sortBy && filters.sortBy !== 'most-recent') {
    params.set('sort', filters.sortBy);
  }
  if (filters.searchQuery) {
    params.set('q', filters.searchQuery);
  }

  return params;
}

/**
 * Helper to deserialize URL params to filter state
 */
export function paramsToFilterState(params: URLSearchParams): Partial<UnifiedFilterState> {
  return {
    locations: new Set(params.get('locations')?.split(',') || []),
    industries: new Set(params.get('industries')?.split(',') || []),
    experienceLevels: new Set(params.get('experience')?.split(',') || []) as Set<ExperienceLevel>,
    employmentTypes: new Set(params.get('employment')?.split(',') || []) as Set<EmploymentType>,
    jobFunctions: new Set(params.get('functions')?.split(',') || []),
    salaryRanges: new Set(params.get('salary')?.split(',') || []),
    companySizes: new Set(params.get('size')?.split(',') || []),
    skills: new Set(params.get('skills')?.split(',') || []),
    jobLevels: new Set(params.get('levels')?.split(',') || []) as Set<JobLevel>,
    datePosted: new Set(params.get('date')?.split(',') || []) as Set<DatePosted>,
    sortBy: (params.get('sort') as SortOption) || 'most-recent',
    searchQuery: params.get('q') || '',
  };
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: UnifiedFilterState): number {
  return (
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
    (filters.searchQuery ? 1 : 0)
  );
}

/**
 * Get form reset function
 */
export function getResetFilters(role: FilterRole = 'job_seeker'): UnifiedFilterState {
  return {
    ...DEFAULT_FILTER_STATE,
    role,
    lastUpdated: new Date(),
  };
}

/**
 * Helper to get readable filter label
 */
export function getFilterLabel(filterId: string): string {
  const labels: Record<string, string> = {
    location: 'Location',
    industry: 'Industry',
    experience: 'Experience Level',
    employmentType: 'Employment Type',
    jobFunction: 'Job Function',
    salaryRange: 'Salary Range',
    companySize: 'Company Size',
    skills: 'Skills',
    jobLevel: 'Job Level',
    datePosted: 'Date Posted',
    sortBy: 'Sort',
  };
  return labels[filterId] || filterId;
}

/**
 * Check if filters are empty
 */
export function areFiltersEmpty(filters: UnifiedFilterState): boolean {
  return getActiveFilterCount(filters) === 0;
}

/**
 * Clone filter state safely
 */
export function cloneFilterState(filters: UnifiedFilterState): UnifiedFilterState {
  return {
    ...filters,
    locations: new Set(filters.locations),
    industries: new Set(filters.industries),
    experienceLevels: new Set(filters.experienceLevels),
    employmentTypes: new Set(filters.employmentTypes),
    jobFunctions: new Set(filters.jobFunctions),
    salaryRanges: new Set(filters.salaryRanges),
    companySizes: new Set(filters.companySizes),
    skills: new Set(filters.skills),
    jobLevels: new Set(filters.jobLevels),
    datePosted: new Set(filters.datePosted),
    lastUpdated: new Date(),
  };
}
