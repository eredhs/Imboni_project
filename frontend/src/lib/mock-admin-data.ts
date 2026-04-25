import type {
  CompanyApplication,
  PlatformMetrics,
  UserProfile,
  AdminDashboardStats,
} from "@/lib/admin-types";

export const mockCompanyApplications: CompanyApplication[] = [
  {
    id: "comp-1",
    companyName: "CloudTech Rwanda",
    companyEmail: "hr@cloudtech.rw",
    contactPerson: "David Uwizeye",
    contactPhone: "+250 785 234 567",
    industry: "Software Development",
    companySize: 45,
    registrationNumber: "BN/2023-00156",
    taxId: "TIN-100652145K",
    website: "cloudtech.rw",
    description:
      "Leading cloud infrastructure and software development company in Rwanda specializing in enterprise solutions.",
    applicantDate: new Date(2026, 3, 5),
    status: "pending",
    documents: {
      businessLicense: "cloudtech_license.pdf",
      taxCertificate: "cloudtech_tax.pdf",
    },
  },
  {
    id: "comp-2",
    companyName: "DigitalMark Solutions",
    companyEmail: "careers@digitalmark.rw",
    contactPerson: "Sylvie Mukarugwiro",
    contactPhone: "+250 788 456 789",
    industry: "Digital Marketing",
    companySize: 28,
    registrationNumber: "BN/2023-00089",
    taxId: "TIN-100789456P",
    website: "digitalmark.rw",
    description:
      "Digital marketing agency providing branding, SEO, and content services to East African tech companies.",
    applicantDate: new Date(2026, 3, 3),
    status: "pending",
    documents: {
      businessLicense: "digitalmark_license.pdf",
      taxCertificate: "digitalmark_tax.pdf",
    },
  },
  {
    id: "comp-3",
    companyName: "DataViz Analytics",
    companyEmail: "recruitment@dataviz.rw",
    contactPerson: "Emmanuel Ngarambe",
    contactPhone: "+250 702 345 678",
    industry: "Data Science & Analytics",
    companySize: 35,
    registrationNumber: "BN/2023-00203",
    taxId: "TIN-100234567M",
    website: "dataviz.rw",
    description:
      "Business intelligence and data analytics firm helping Rwandan enterprises make data-driven decisions.",
    applicantDate: new Date(2026, 3, 1),
    status: "pending",
    documents: {
      businessLicense: "dataviz_license.pdf",
      taxCertificate: "dataviz_tax.pdf",
    },
  },
];

export const mockApprovedCompanies: CompanyApplication[] = [
  {
    id: "comp-4",
    companyName: "InnovateTech Rwanda",
    companyEmail: "hr@innovatetech.rw",
    contactPerson: "Jane Mutesi",
    contactPhone: "+250 791 567 890",
    industry: "Software Development",
    companySize: 62,
    registrationNumber: "BN/2022-00045",
    taxId: "TIN-100456789Q",
    website: "innovatetech.rw",
    description: "Mobile and web application development company pioneering fintech solutions in Rwanda.",
    applicantDate: new Date(2026, 2, 15),
    status: "approved",
    documents: {
      businessLicense: "innovatetech_license.pdf",
      taxCertificate: "innovatetech_tax.pdf",
    },
  },
  {
    id: "comp-5",
    companyName: "Skyline Solutions",
    companyEmail: "careers@skyline.rw",
    contactPerson: "Kevin Habimana",
    contactPhone: "+250 795 678 901",
    industry: "IT Services",
    companySize: 51,
    registrationNumber: "BN/2022-00078",
    taxId: "TIN-100567890R",
    website: "skyline.rw",
    description:
      "Full-stack IT solutions and consulting for African enterprises with focus on cloud transformation.",
    applicantDate: new Date(2026, 2, 10),
    status: "approved",
    documents: {
      businessLicense: "skyline_license.pdf",
      taxCertificate: "skyline_tax.pdf",
    },
  },
];

export const mockUsers: UserProfile[] = [
  {
    id: "user-1",
    name: "Stacy Mukashema",
    email: "stacy@example.rw",
    role: "job_seeker",
    joinDate: new Date(2026, 2, 1),
    lastActive: new Date(2026, 3, 10, 14, 30),
    status: "active",
  },
  {
    id: "user-2",
    name: "Patrick Nkusi",
    email: "patrick@example.rw",
    role: "job_seeker",
    joinDate: new Date(2026, 2, 5),
    lastActive: new Date(2026, 3, 10, 12, 15),
    status: "active",
  },
  {
    id: "user-3",
    name: "Jean Habimana",
    email: "jean@innovatetech.rw",
    role: "recruiter",
    company: "InnovateTech Rwanda",
    joinDate: new Date(2026, 1, 20),
    lastActive: new Date(2026, 3, 9, 16, 45),
    status: "active",
  },
  {
    id: "user-4",
    name: "Marie Uwimana",
    email: "marie@skyline.rw",
    role: "recruiter",
    company: "Skyline Solutions",
    joinDate: new Date(2026, 2, 8),
    lastActive: new Date(2026, 3, 10, 10, 20),
    status: "active",
  },
  {
    id: "user-5",
    name: "Richard Sekabira",
    email: "richard@example.rw",
    role: "job_seeker",
    joinDate: new Date(2026, 3, 2),
    lastActive: new Date(2026, 3, 10, 8, 0),
    status: "active",
  },
];

export const mockPlatformMetrics: PlatformMetrics = {
  totalCompanies: 47,
  totalUsers: 3247,
  totalJobSeekers: 2891,
  totalRecruiters: 356,
  totalJobsPosted: 189,
  activeApplications: 542,
  successfulPlacements: 24,
  companyApplicationsPending: 3,
  monthlyNewUsers: 287,
  monthlyJobPostings: 34,
  platformHealth: 92,
};

export const mockRecentActivity = [
  {
    type: "company_signup" as const,
    description: "CloudTech Rwanda applied to join as employer",
    timestamp: new Date(2026, 3, 5, 14, 30),
  },
  {
    type: "placement" as const,
    description: "Sarah Nyamwire placed at InnovateTech Rwanda as UX Designer",
    timestamp: new Date(2026, 3, 5, 11, 15),
  },
  {
    type: "job_posted" as const,
    description: "Skyline Solutions posted: Senior Backend Engineer",
    timestamp: new Date(2026, 3, 4, 16, 45),
  },
  {
    type: "application" as const,
    description: "145 applications received today across all jobs",
    timestamp: new Date(2026, 3, 4, 9, 0),
  },
  {
    type: "company_signup" as const,
    description: "DigitalMark Solutions applied to join as employer",
    timestamp: new Date(2026, 3, 3, 13, 20),
  },
  {
    type: "job_posted" as const,
    description: "InnovateTech Rwanda posted: Product Manager",
    timestamp: new Date(2026, 3, 3, 10, 0),
  },
  {
    type: "placement" as const,
    description: "James Karangwa placed at Skyline Solutions as Senior Developer",
    timestamp: new Date(2026, 3, 2, 15, 30),
  },
];

export function getAdminDashboardStats(): AdminDashboardStats {
  return {
    metrics: mockPlatformMetrics,
    recentActivity: mockRecentActivity,
    companyApplications: mockCompanyApplications,
    recentUsers: mockUsers.slice(0, 5),
  };
}

export function getCompanyApplicationById(id: string): CompanyApplication | undefined {
  return [...mockCompanyApplications, ...mockApprovedCompanies].find((c) => c.id === id);
}

export function getAllCompanyApplications(): CompanyApplication[] {
  return [...mockCompanyApplications, ...mockApprovedCompanies].sort(
    (a, b) => b.applicantDate.getTime() - a.applicantDate.getTime()
  );
}
