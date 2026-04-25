// Job Board Types

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance';
export type ExperienceLevel = 'internship' | 'entry-level' | 'associate' | 'mid-senior' | 'director';
export type ApplicationStatus = 'not_applied' | 'applied' | 'interview' | 'rejected' | 'accepted';
export type SortOption = 'most-recent' | 'most-relevant' | 'closing-soon';

export interface Company {
  id: string;
  name: string;
  avatar: string; // emoji or initials
  industry: string;
  size: string;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  employmentType: EmploymentType;
  description: string;
  longDescription: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  deadline: Date;
  applicationStatus: ApplicationStatus;
  closesInDays?: number;
  postedDaysAgo: number;
}

export interface FilterState {
  locations: Set<string>;
  industries: Set<string>;
  experienceLevels: Set<ExperienceLevel>;
  employmentTypes: Set<EmploymentType>;
  searchQuery: string;
  sortBy: SortOption;
}

// Filter Option Types for UI
export interface FilterOption {
  label: string;
  count: number;
  id: string;
}

export interface FilterCategory {
  title: string;
  id: string;
  options: FilterOption[];
}
