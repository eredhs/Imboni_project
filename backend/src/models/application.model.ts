// Application Model - represents a job seeker's application to a job posting

export type ApplicationStatus = "applied" | "under_review" | "interview_scheduled" | "rejected" | "accepted" | "offer_extended" | "withdrawn";

export interface CandidateProfile {
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
}

export interface ApplicationResume {
  fileName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  extractedText?: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string; // Job seeker
  hrId: string; // HR who posted the job
  status: ApplicationStatus;
  appliedAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  
  // Application details
  coverLetter?: string;
  resumeUrl?: string;
  candidateProfile?: CandidateProfile;
  resume?: ApplicationResume;
  
  // Screening & scoring
  screeningScore?: number;
  screeningStatus?: "pending" | "completed" | "failed";
  screeningDate?: string;
  
  // HR Actions
  notes?: string[];
  interviewScheduledAt?: string;
  rejectionReason?: string;
  offerDetails?: {
    salary: number;
    startDate: string;
    benefits: string[];
  };
  
  // Timeline tracking
  timeline: ApplicationEvent[];
}

export interface ApplicationEvent {
  id: string;
  type: "applied" | "reviewed" | "screening_started" | "screening_completed" | "shortlisted" | "rejected" | "interview_scheduled" | "offer_made" | "accepted";
  timestamp: string;
  actorType: "system" | "hr" | "candidate";
  actorId: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string; // Recipient (can be HR or job seeker)
  userType: "hr" | "candidate";
  type: "application_received" | "application_reviewed" | "interview_scheduled" | "offer_made" | "rejected" | "screening_started" | "screening_completed" | "shortlisted";
  title: string;
  message: string;
  relatedEntityId: string; // Application ID or Job ID
  relatedEntityType: "application" | "job";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
