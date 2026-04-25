export type JobStatus = "active" | "draft" | "closed" | "screened";
export type ScreeningStatus = "Completed" | "In Progress" | "Pending";
export type ApplicantStatus = "Shortlisted" | "Review" | "Pending" | "Rejected";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type LanguageProficiency =
  | "Basic"
  | "Conversational"
  | "Fluent"
  | "Native";
export type AvailabilityStatus =
  | "Available"
  | "Open to Opportunities"
  | "Not Available";
export type AvailabilityType = "Full-time" | "Part-time" | "Contract";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type JobApplicationState = "not_applied" | ApplicationStatus;

export type Job = {
  id: string;
  hrId?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  seniority: string;
  type: string;
  status: JobStatus;
  applicantCount: number;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number;
  educationLevel: string;
  screeningStatus: ScreeningStatus;
  topScore: number;
  createdAt: string;
  applicationDeadline: string;
  applicationStatus?: JobApplicationState;
  isNew?: boolean;
};

export type Applicant = {
  id: string;
  jobId: string;
  userId?: string;
  applicationId?: string;
  fullName: string;
  location: string;
  currentRole: string;
  yearsExperience: number;
  score: number;
  status: ApplicantStatus;
  confidence: "high" | "medium" | "uncertain";
  skills: string[];
  email?: string;
  talentProfile: TalentProfile;
  candidateProfile?: Application["candidateProfile"];
  resume?: Application["resume"];
  createdAt?: string;
};

export type TalentSkill = {
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
};

export type TalentLanguage = {
  name: string;
  proficiency: LanguageProficiency;
};

export type TalentExperience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  isCurrent: boolean;
};

export type TalentEducation = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
};

export type TalentCertification = {
  name: string;
  issuer: string;
  issueDate: string;
};

export type TalentProject = {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link: string;
  startDate: string;
  endDate: string;
};

export type TalentAvailability = {
  status: AvailabilityStatus;
  type: AvailabilityType;
  startDate?: string;
};

export type TalentSocialLinks = {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  behance?: string;
};

export type TalentProfile = {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  bio?: string;
  location: string;
  skills: TalentSkill[];
  languages?: TalentLanguage[];
  experience: TalentExperience[];
  education: TalentEducation[];
  certifications?: TalentCertification[];
  projects: TalentProject[];
  availability: TalentAvailability;
  socialLinks?: TalentSocialLinks;
};

// Application Types
export type ApplicationStatus = "applied" | "under_review" | "interview_scheduled" | "rejected" | "accepted" | "offer_extended" | "withdrawn";

export type ApplicationEventType = "applied" | "reviewed" | "screening_started" | "screening_completed" | "shortlisted" | "rejected" | "interview_scheduled" | "offer_made" | "accepted";

export interface ApplicationEvent {
  id: string;
  type: ApplicationEventType;
  timestamp: string;
  actorType: "system" | "hr" | "candidate";
  actorId: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  hrId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  candidateProfile?: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    linkedinUrl?: string;
    portfolioUrl?: string;
    expectedSalary?: string;
    availableFrom?: string;
    workAuthorization?: string;
    professionalSummary?: string;
  };
  resume?: {
    fileName: string;
    mimeType: string;
    fileSize: number;
    url: string;
    extractedText?: string;
  };
  screeningScore?: number;
  screeningStatus?: "pending" | "completed" | "failed";
  screeningDate?: string;
  notes?: string[];
  interviewScheduledAt?: string;
  rejectionReason?: string;
  offerDetails?: {
    salary: number;
    startDate: string;
    benefits: string[];
  };
  timeline: ApplicationEvent[];
}

export type NotificationType = 
  | "application_received" 
  | "application_reviewed" 
  | "interview_scheduled" 
  | "offer_made" 
  | "rejected" 
  | "screening_started" 
  | "screening_completed"
  | "shortlisted";

export interface Notification {
  id: string;
  userId: string;
  userType: "hr" | "candidate";
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId: string;
  relatedEntityType: "application" | "job";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type ShortlistCandidate = Applicant & {
  gap: string;
  quote: string;
  overview: string;
  notes: string[];
  reasoning: string;
  recommendation: string;
  verifiedExpertise: boolean;
  topCandidateLabel: string;
  scoreBreakdown: Array<{
    label: string;
    value: number;
  }>;
};

export type ReportsOverview = {
  activeJobs: number;
  closingThisWeek: number;
  pendingScreenings: number;
  shortlistedToday: number;
  shortlistedAcrossRoles: number;
  totalScreened: number;
  totalScreenedDelta: number;
  avgTimeSavedHours: number;
  efficiencyGainPercent: number;
  dashboardTimeSavedHours: number;
  shortlistAcceptance: number;
  shortlistDelta: number;
  poolIntelligence: string;
  keyIndicators: {
    skillStrength: string;
    marketFit: string;
  };
  updatedHoursAgo: number;
  outcomes: {
    hired: number;
    rejected: number;
    inProgress: number;
  };
};

export type TimelinePoint = {
  day: string;
  uploaded: number;
  shortlisted: number;
};

export type SkillFrequency = {
  skill: string;
  count: number;
};

export type BiasHistoryItem = {
  id: string;
  date: string;
  targetRole: string;
  alertType: string;
  actionTaken: string;
};

export type SettingsData = {
  hrId?: string;
  scoringWeights: {
    skills: number;
    experience: number;
    communication: number;
    cultureFit: number;
  };
  notificationPreferences: {
    emailOnApplication: boolean;
    emailOnScreeningComplete: boolean;
    emailOnShortlist: boolean;
    emailOnOffer: boolean;
    slackIntegration: boolean;
  };
  biasDetectionSettings: {
    enableRealTimeAlerts: boolean;
    educationUniformityGuard: boolean;
    experienceClustering: boolean;
  };
  shortlistDefaults: {
    shortlistSize: number;
    autoRescreen: boolean;
  };
  teamSettings: {
    members: Array<{
      id: string;
      email: string;
      name: string;
      role: "admin" | "reviewer" | "viewer";
      joinedAt: string;
    }>;
  };
  integrations: {
    slack: { connected: boolean; webhookUrl?: string };
    zapier: { connected: boolean; apiKey?: string };
    airtable: { connected: boolean; baseId?: string };
  };
};

export type JobsResponse = {
  items: Job[];
  total: number;
};

export type ApplicantsResponse = {
  items: Applicant[];
  total: number;
};

export type ScreeningResultsResponse = {
  job?: Job;
  analyzed: number;
  durationSeconds: number;
  biasAlert: {
    detected: boolean;
    message: string;
  };
  items: ShortlistCandidate[];
  poolIntelligence?: string | null;
};

// Admin Types
export type AdminStats = {
  platformStats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalUsers: number;
    avgApplicationsPerJob: number;
  };
  jobBreakdown: Array<{
    jobId: string;
    title: string;
    department: string;
    status: string;
    applications: number;
  }>;
};

export type PlatformInsights = {
  insights: {
    jobsByStatus: Record<string, number>;
    jobsByDepartment: Record<string, number>;
    totalActive: number;
    closingThisWeek: number;
  };
};
