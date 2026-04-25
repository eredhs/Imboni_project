import type { Job } from "@/lib/job-board-types";

export const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    company: {
      id: "company-1",
      name: "InnovateTech Rwanda",
      avatar: "IT",
      industry: "Tech & SaaS",
      size: "100-500",
    },
    location: "Kigali, Rwanda",
    employmentType: "full-time",
    description: "Design beautiful, intuitive user experiences for our AI-powered platform serving East Africa.",
    longDescription: "We're seeking a visionary Senior Product Designer to lead our design vision. You'll work with our product and engineering teams to create world-class experiences.",
    skills: ["Figma", "UI/UX Design", "User Research", "Prototyping"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    applicationStatus: "not_applied",
    closesInDays: 2,
    postedDaysAgo: 3,
  },
  {
    id: "job-2",
    title: "Lead Backend Engineer (Node.js)",
    company: {
      id: "company-2",
      name: "Skyline Solutions",
      avatar: "SS",
      industry: "Tech & SaaS",
      size: "50-100",
    },
    location: "Kigali, Rwanda (Remote option)",
    employmentType: "full-time",
    description: "Build scalable backend systems for a high-growth startup serving the East African market.",
    longDescription: "Lead our backend infrastructure and mentor junior engineers. Work with AWS, Node.js, and modern DevOps practices.",
    skills: ["Node.js", "AWS", "PostgreSQL", "Docker", "System Design"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 8,
    postedDaysAgo: 1,
  },
  {
    id: "job-3",
    title: "Data Scientist",
    company: {
      id: "company-3",
      name: "Quantum Analytics",
      avatar: "QA",
      industry: "Fintech",
      size: "200-500",
    },
    location: "Nairobi, Kenya (Remote)",
    employmentType: "full-time",
    description: "Apply machine learning to solve real problems in financial services across Africa.",
    longDescription: "Develop ML models for credit risk assessment, fraud detection, and portfolio optimization.",
    skills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    applicationStatus: "applied",
    closesInDays: 14,
    postedDaysAgo: 5,
  },
  {
    id: "job-4",
    title: "Frontend Developer (React)",
    company: {
      id: "company-4",
      name: "GrowthLoop",
      avatar: "GL",
      industry: "Marketing",
      size: "20-50",
    },
    location: "Kigali, Rwanda",
    employmentType: "full-time",
    description: "Build engaging React applications for marketing automation platform used across Sub-Saharan Africa.",
    longDescription: "Work on our modern React/TypeScript codebase. Focus on performance, accessibility, and user experience.",
    skills: ["React", "TypeScript", "TailwindCSS", "State Management"],
    experienceLevel: "associate",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 5,
    postedDaysAgo: 2,
  },
  {
    id: "job-5",
    title: "Product Manager",
    company: {
      id: "company-5",
      name: "TechnoCore",
      avatar: "TC",
      industry: "Tech & SaaS",
      size: "100-200",
    },
    location: "Kigali, Rwanda",
    employmentType: "full-time",
    description: "Shape the product strategy for an emerging platform in the African fintech space.",
    longDescription: "Lead product vision, roadmap, and cross-functional execution. Solve real problems for our users.",
    skills: ["Product Strategy", "Analytics", "Stakeholder Management", "User Research"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 21,
    postedDaysAgo: 7,
  },
  {
    id: "job-6",
    title: "UX Researcher",
    company: {
      id: "company-6",
      name: "DesignFlow Systems",
      avatar: "DF",
      industry: "Tech & SaaS",
      size: "30-50",
    },
    location: "Kigali, Rwanda (Remote)",
    employmentType: "full-time",
    description: "Conduct user research to inform product decisions for African tech products.",
    longDescription: "Design and execute research studies. Create insights that drive product improvements.",
    skills: ["User Research", "Qualitative Analysis", "Figma", "Prototyping"],
    experienceLevel: "associate",
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 12,
    postedDaysAgo: 4,
  },
  {
    id: "job-7",
    title: "DevOps Engineer",
    company: {
      id: "company-7",
      name: "CloudScale Inc",
      avatar: "☁️",
      industry: "Tech & SaaS",
      size: "200-500",
    },
    location: "Kigali, Rwanda",
    employmentType: "full-time",
    description: "Manage infrastructure and CI/CD pipelines for high-traffic applications.",
    longDescription: "Own our cloud infrastructure on AWS. Improve deployment processes and system reliability.",
    skills: ["AWS", "Kubernetes", "CI/CD", "Terraform", "Python"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 10,
    postedDaysAgo: 3,
  },
  {
    id: "job-8",
    title: "Mobile App Developer iOS",
    company: {
      id: "company-8",
      name: "PocketLabs",
      avatar: "📱",
      industry: "Tech & SaaS",
      size: "10-20",
    },
    location: "Nairobi, Kenya (Remote)",
    employmentType: "full-time",
    description: "Build beautiful iOS applications for millions of African users.",
    longDescription: "Develop native iOS apps using Swift. Focus on performance and user delight.",
    skills: ["Swift", "iOS", "SwiftUI", "Xcode"],
    experienceLevel: "mid-senior",
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 18,
    postedDaysAgo: 6,
  },
  {
    id: "job-9",
    title: "Content Strategy Manager",
    company: {
      id: "company-9",
      name: "Lumina Media",
      avatar: "📝",
      industry: "Marketing",
      size: "20-50",
    },
    location: "Kigali, Rwanda",
    employmentType: "part-time",
    description: "Shape content strategy for a growing media platform serving East Africa.",
    longDescription: "Create and manage content calendars. Build audience engagement strategies.",
    skills: ["Content Strategy", "SEO", "Analytics", "Copy Writing"],
    experienceLevel: "associate",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 7,
    postedDaysAgo: 2,
  },
  {
    id: "job-10",
    title: "Business Development Manager",
    company: {
      id: "company-10",
      name: "GreenPulse Energy",
      avatar: "🌱",
      industry: "Renewables",
      size: "50-100",
    },
    location: "Kigali, Rwanda",
    employmentType: "full-time",
    description: "Drive partnerships and growth for renewable energy initiatives across Rwanda.",
    longDescription: "Build relationships with key stakeholders. Develop new business opportunities.",
    skills: ["Business Development", "Negotiations", "Relationship Building", "Market Analysis"],
    experienceLevel: "entry-level",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    applicationStatus: "not_applied",
    closesInDays: 15,
    postedDaysAgo: 4,
  },
];

// Get available filter options with counts
export function getFilterCounts() {
  const locations = new Map<string, number>();
  const industries = new Map<string, number>();
  const experienceLevels = new Map<string, number>();
  const employmentTypes = new Map<string, number>();

  mockJobs.forEach((job) => {
    // Count locations
    locations.set(job.location, (locations.get(job.location) || 0) + 1);

    // Count industries
    industries.set(job.company.industry, (industries.get(job.company.industry) || 0) + 1);

    // Count experience levels
    experienceLevels.set(job.experienceLevel, (experienceLevels.get(job.experienceLevel) || 0) + 1);

    // Count employment types
    employmentTypes.set(job.employmentType, (employmentTypes.get(job.employmentType) || 0) + 1);
  });

  return {
    locations: Array.from(locations.entries()).map(([label, count]) => ({
      label,
      count,
      id: label.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    })),
    industries: Array.from(industries.entries()).map(([label, count]) => ({
      label,
      count,
      id: label.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    })),
    experienceLevels: Array.from(experienceLevels.entries()).map(([label, count]) => ({
      label: formatExperienceLevel(label),
      count,
      id: label,
    })),
    employmentTypes: Array.from(employmentTypes.entries()).map(([label, count]) => ({
      label: formatEmploymentType(label),
      count,
      id: label,
    })),
  };
}

function formatExperienceLevel(level: string): string {
  const map: Record<string, string> = {
    internship: "Internship",
    "entry-level": "Entry Level",
    associate: "Associate",
    "mid-senior": "Mid-Senior",
    director: "Director / VP",
  };
  return map[level] || level;
}

function formatEmploymentType(type: string): string {
  const map: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    freelance: "Freelance",
  };
  return map[type] || type;
}
