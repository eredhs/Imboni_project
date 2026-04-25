// Comprehensive unified filter system for both Job Seeker and Recruiter

// ============================================
// FILTER CATEGORIES & CONSTANTS
// ============================================

// Locations - East Africa focus
export const LOCATIONS = [
  // Kenya
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  
  // Rwanda
  "Kigali",
  "Huye",
  "Butare",
  "Rubavu",
  
  // Uganda
  "Kampala",
  "Jinja",
  "Gulu",
  "Mbarara",
  
  // Tanzania
  "Dar es Salaam",
  "Arusha",
  "Dodoma",
  "Mbeya",
  
  // Multi-region
  "East Africa (Remote)",
  "Remote/Virtual",
  "Hybrid",
  "Other",
];

// Industries - Comprehensive list
export const INDUSTRIES_EXTENDED = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Agriculture",
  "Manufacturing",
  "Retail & E-commerce",
  "Hospitality & Tourism",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Telecommunications",
  "Real Estate",
  "Media & Entertainment",
  "Consulting",
  "Government & Public Service",
  "NGO / Non-Profit",
  "Legal Services",
  "Insurance",
  "Construction",
  "Automotive",
  "Other",
];

// Experience Levels
export const EXPERIENCE_LEVELS_EXTENDED = [
  { id: "internship", label: "Internship", minYears: 0, maxYears: 1 },
  { id: "entry-level", label: "Entry Level", minYears: 1, maxYears: 2 },
  { id: "associate", label: "Associate", minYears: 2, maxYears: 5 },
  { id: "mid-level", label: "Mid-Level", minYears: 5, maxYears: 8 },
  { id: "senior", label: "Senior", minYears: 8, maxYears: 12 },
  { id: "lead", label: "Lead / Principal", minYears: 12, maxYears: 20 },
  { id: "director", label: "Director / Executive", minYears: 20, maxYears: 100 },
  { id: "other", label: "Other" },
];

// Employment Types
export const EMPLOYMENT_TYPES_EXTENDED = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "freelance", label: "Freelance" },
  { id: "temporary", label: "Temporary" },
  { id: "internship", label: "Internship" },
  { id: "volunteer", label: "Volunteer" },
  { id: "other", label: "Other" },
];

// Job Functions / Departments
export const JOB_FUNCTIONS = [
  "Engineering / Development",
  "Product Management",
  "Design / UX / UI",
  "Sales",
  "Marketing",
  "Operations",
  "Finance & Accounting",
  "Human Resources",
  "Data & Analytics",
  "Customer Support",
  "Project Management",
  "Quality Assurance",
  "Cybersecurity",
  "Infrastructure / DevOps",
  "Machine Learning / AI",
  "Other",
];

// Salary Ranges (in USD/Monthly)
export const SALARY_RANGES = [
  { id: "0-500", label: "< $500/month", minSalary: 0, maxSalary: 500 },
  { id: "500-1000", label: "$500 - $1,000", minSalary: 500, maxSalary: 1000 },
  { id: "1000-2000", label: "$1,000 - $2,000", minSalary: 1000, maxSalary: 2000 },
  { id: "2000-3500", label: "$2,000 - $3,500", minSalary: 2000, maxSalary: 3500 },
  { id: "3500-5000", label: "$3,500 - $5,000", minSalary: 3500, maxSalary: 5000 },
  { id: "5000-7500", label: "$5,000 - $7,500", minSalary: 5000, maxSalary: 7500 },
  { id: "7500-10000", label: "$7,500 - $10,000", minSalary: 7500, maxSalary: 10000 },
  { id: "10000-plus", label: "$10,000+", minSalary: 10000, maxSalary: 999999 },
  { id: "other", label: "Other / Negotiable" },
];

// Company Sizes
export const COMPANY_SIZES = [
  { id: "startup", label: "Startup (1-50 employees)" },
  { id: "small", label: "Small (51-200 employees)" },
  { id: "medium", label: "Medium (201-1000 employees)" },
  { id: "large", label: "Large (1000+ employees)" },
  { id: "enterprise", label: "Enterprise" },
  { id: "other", label: "Other" },
];

// Skills (Common tech & business skills)
export const COMMON_SKILLS = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C#",
  "C++",
  "PHP",
  "Ruby",
  
  // Frontend
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Svelte",
  "HTML/CSS",
  
  // Backend
  "Node.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Express.js",
  ".NET",
  
  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Firebase",
  "Cassandra",
  
  // Cloud & DevOps
  "AWS",
  "Google Cloud",
  "Azure",
  "Docker",
  "Kubernetes",
  "CI/CD",
  
  // Data & AI
  "Machine Learning",
  "AI",
  "Data Science",
  "TensorFlow",
  "PyTorch",
  "Big Data",
  
  // Business
  "Project Management",
  "Product Strategy",
  "Agile",
  "Scrum",
  "Leadership",
  "Communication",
  "Sales",
  "Marketing",
  "Analytics",
  "Other",
];

// Sort Options
export const SORT_OPTIONS = [
  { id: "most-recent", label: "Most Recent" },
  { id: "most-relevant", label: "Most Relevant" },
  { id: "closing-soon", label: "Closing Soon" },
  { id: "salary-high", label: "Highest Salary" },
  { id: "salary-low", label: "Lowest Salary" },
];

// Date Posted Filters
export const DATE_POSTED = [
  { id: "last-24h", label: "Last 24 Hours" },
  { id: "last-7d", label: "Last 7 Days" },
  { id: "last-30d", label: "Last 30 Days" },
  { id: "last-90d", label: "Last 90 Days" },
  { id: "any", label: "Any Time" },
];

// Job Levels (Alternative to experience)
export const JOB_LEVELS = [
  { id: "c-suite", label: "C-Suite" },
  { id: "vp-director", label: "VP / Director" },
  { id: "manager", label: "Manager" },
  { id: "senior", label: "Senior" },
  { id: "mid", label: "Mid-Level" },
  { id: "junior", label: "Junior" },
  { id: "entry", label: "Entry Level" },
  { id: "other", label: "Other" },
];

// Work Arrangements
export const WORK_ARRANGEMENTS = [
  { id: "on-site", label: "On-Site" },
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "flexible", label: "Flexible" },
  { id: "other", label: "Other" },
];

// ============================================
// FILTER CATEGORIES - UI Organization
// ============================================

export const FILTER_CATEGORIES = {
  location: {
    id: "location",
    label: "Location",
    options: LOCATIONS,
    type: "multi-select",
    icon: "MapPin",
  },
  industry: {
    id: "industry",
    label: "Industry",
    options: INDUSTRIES_EXTENDED,
    type: "multi-select",
    icon: "Briefcase",
  },
  experience: {
    id: "experience",
    label: "Experience Level",
    options: EXPERIENCE_LEVELS_EXTENDED.map(e => ({ id: e.id, label: e.label })),
    type: "multi-select",
    icon: "TrendingUp",
  },
  employmentType: {
    id: "employmentType",
    label: "Employment Type",
    options: EMPLOYMENT_TYPES_EXTENDED.map(e => ({ id: e.id, label: e.label })),
    type: "multi-select",
    icon: "Clock",
  },
  jobFunction: {
    id: "jobFunction",
    label: "Job Function",
    options: JOB_FUNCTIONS,
    type: "multi-select",
    icon: "Zap",
  },
  salaryRange: {
    id: "salaryRange",
    label: "Salary Range",
    options: SALARY_RANGES.map(r => ({ id: r.id, label: r.label })),
    type: "multi-select",
    icon: "DollarSign",
  },
  companySize: {
    id: "companySize",
    label: "Company Size",
    options: COMPANY_SIZES.map(s => ({ id: s.id, label: s.label })),
    type: "multi-select",
    icon: "Users",
  },
  skills: {
    id: "skills",
    label: "Required Skills",
    options: COMMON_SKILLS,
    type: "multi-select",
    icon: "Code",
  },
  jobLevel: {
    id: "jobLevel",
    label: "Job Level",
    options: JOB_LEVELS.map(l => ({ id: l.id, label: l.label })),
    type: "multi-select",
    icon: "Award",
  },
  datePosted: {
    id: "datePosted",
    label: "Date Posted",
    options: DATE_POSTED,
    type: "multi-select",
    icon: "Calendar",
  },
  workArrangement: {
    id: "workArrangement",
    label: "Work Arrangement",
    options: WORK_ARRANGEMENTS.map(w => ({ id: w.id, label: w.label })),
    type: "multi-select",
    icon: "MapPin",
  },
} as const;

// Default filters state
export const DEFAULT_FILTER_STATE = {
  location: new Set<string>(),
  industry: new Set<string>(),
  experience: new Set<string>(),
  employmentType: new Set<string>(),
  jobFunction: new Set<string>(),
  salaryRange: new Set<string>(),
  companySize: new Set<string>(),
  skills: new Set<string>(),
  jobLevel: new Set<string>(),
  datePosted: new Set<string>(),
  workArrangement: new Set<string>(),
  searchQuery: "",
  sortBy: "most-recent" as const,
};

export type FilterState = typeof DEFAULT_FILTER_STATE;
export type SortBy = "most-recent" | "most-relevant" | "closing-soon" | "salary-high" | "salary-low";

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFilterCategory(categoryId: string) {
  return (FILTER_CATEGORIES as any)[categoryId] || null;
}

export function getAllFilterCategories() {
  return Object.values(FILTER_CATEGORIES);
}

export function getFiltersByRole(role: 'job_seeker' | 'recruiter') {
  // Both roles see the same filters, but HR/Recruiter may see additional analytics
  return {
    job_seeker: [
      'location',
      'industry',
      'experience',
      'employmentType',
      'jobFunction',
      'salaryRange',
      'companySize',
      'workArrangement',
      'datePosted',
    ],
    recruiter: [
      'location',
      'industry',
      'experience',
      'employmentType',
      'jobFunction',
      'salaryRange',
      'companySize',
      'jobLevel',
      'workArrangement',
      'datePosted',
    ],
  }[role] || [];
}
