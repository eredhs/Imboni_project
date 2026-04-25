export type CompanyStatus = "pending" | "approved" | "rejected" | "suspended";
export type UserRole = "job_seeker" | "recruiter" | "admin";
export type AdminAction = "approve" | "reject" | "request_changes" | "suspend";

export interface CompanyApplication {
  id: string;
  companyName: string;
  companyEmail: string;
  contactPerson: string;
  contactPhone: string;
  industry: string;
  companySize: number;
  registrationNumber: string;
  taxId: string;
  website?: string;
  logo?: string;
  description: string;
  applicantDate: Date;
  status: CompanyStatus;
  rejectionReason?: string;
  documents: {
    businessLicense: string;
    taxCertificate: string;
  };
}

export interface PlatformMetrics {
  totalCompanies: number;
  totalUsers: number;
  totalJobSeekers: number;
  totalRecruiters: number;
  totalJobsPosted: number;
  activeApplications: number;
  successfulPlacements: number;
  companyApplicationsPending: number;
  monthlyNewUsers: number;
  monthlyJobPostings: number;
  platformHealth: number; // 0-100 percentage
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: Date;
  lastActive: Date;
  status: "active" | "inactive" | "suspended";
  company?: string;
}

export interface AdminDashboardStats {
  metrics: PlatformMetrics;
  recentActivity: {
    type: "company_signup" | "job_posted" | "application" | "placement";
    description: string;
    timestamp: Date;
  }[];
  companyApplications: CompanyApplication[];
  recentUsers: UserProfile[];
}
