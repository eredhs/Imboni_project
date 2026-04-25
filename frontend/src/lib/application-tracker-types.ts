// Application Tracker Types

export type ApplicationStatus = "all" | "under_review" | "results_out" | "not_successful" | "accepted";
export type ApplicationOutcome = "under_review" | "shortlisted" | "rejected" | "accepted" | "offer_extended";

export interface ApplicationTimeline {
  id: string;
  action: "submitted" | "viewed" | "screening_completed" | "shortlisted" | "interview_scheduled" | "rejected" | "accepted" | "offer_received";
  message: string;
  timestamp: Date;
  icon: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyAvatar: string;
  location: string;
  jobType: string;
  appliedDate: Date;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: ApplicationOutcome;
  currentStage: string; // "Application Submitted", "Under Review", "Interview", etc.
  timeline: ApplicationTimeline[];
  successRate: number; // percentage 0-100
  daysInProcess: number;
  contactPerson?: {
    name: string;
    role: string;
  };
  nextAction?: {
    type: string;
    dueDate: Date;
    text: string;
  };
}

export interface ApplicationMetrics {
  totalApplied: number;
  underReview: number;
  resultsOut: number;
  successful: number;
  notSuccessful: number;
  successRate: number; // percentage
  appliedThisWeek: number;
  averageDaysToResponse: number;
}

export interface ApplicationPageParams {
  status: ApplicationStatus;
  page: number;
  pageSize: number;
  sortBy: "date" | "status" | "company";
  sortOrder: "asc" | "desc";
}
