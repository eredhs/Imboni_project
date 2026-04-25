export type JobLevel = "entry" | "mid" | "senior" | "lead" | "manager" | "executive";
export type EmploymentType = "full_time" | "part_time" | "contract" | "temporary" | "freelance";
export type WorkMode = "remote" | "hybrid" | "on_site";
export type Currency = "RWF" | "USD" | "EUR";
export type ApplicationQuestionType = "text" | "multiple_choice" | "checkbox" | "file_upload";

export interface JobLocation {
  city: string;
  country: string;
  address?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: Currency;
  isHidden?: boolean;
}

export interface ApplicationQuestion {
  id: string;
  question: string;
  type: ApplicationQuestionType;
  required: boolean;
  options?: string[]; // For multiple choice/checkbox
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
}

export interface JobPostingStep1 {
  title: string;
  company: string;
  companyLogo?: string;
  location: JobLocation;
  workMode: WorkMode;
  level: JobLevel;
  employmentType: EmploymentType;
}

export interface JobPostingStep2 {
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}

export interface JobPostingStep3 {
  salary?: SalaryRange;
  benefits: Benefit[];
  perks: string[];
}

export interface JobPostingStep4 {
  screeningQuestions: ApplicationQuestion[];
  applicationDeadline: Date;
  acceptanceLimit?: number;
}

export interface JobPostingFormData {
  step1: JobPostingStep1;
  step2: JobPostingStep2;
  step3: JobPostingStep3;
  step4: JobPostingStep4;
}

export interface JobPostingState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  formData: Partial<JobPostingFormData>;
  errors: Record<string, string>;
  isLoading: boolean;
}

export const JOB_LEVELS: { value: JobLevel; label: string }[] = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "executive", label: "Executive" },
];

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "freelance", label: "Freelance" },
];

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "on_site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

export const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "RWF", label: "Rwandan Franc (RWF)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export const DEFAULT_FORM_DATA: Partial<JobPostingFormData> = {
  step1: {
    title: "",
    company: "",
    location: { city: "", country: "Rwanda" },
    workMode: "hybrid",
    level: "mid",
    employmentType: "full_time",
  },
  step2: {
    description: "",
    responsibilities: [],
    requirements: [],
    niceToHave: [],
  },
  step3: {
    salary: { min: 0, max: 0, currency: "RWF" },
    benefits: [],
    perks: [],
  },
  step4: {
    screeningQuestions: [],
    applicationDeadline: new Date(),
  },
};
