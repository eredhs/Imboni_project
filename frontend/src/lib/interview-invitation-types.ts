export type InterviewType = "phone_screen" | "technical" | "hr" | "manager_round" | "final_round" | "group_discussion";
export type InterviewFormat = "in_person" | "virtual" | "hybrid";

export interface InterviewInvitation {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyAvatar: string;
  
  // Interview Details
  interviewType: InterviewType;
  format: InterviewFormat;
  scheduledDate: Date;
  scheduledTime: string; // HH:MM format
  estimatedDuration: number; // in minutes
  
  // Location Details
  location?: string; // For in-person or hybrid
  meetingLink?: string; // For virtual
  interviewer: {
    name: string;
    title: string;
    email: string;
    linkedinProfile?: string;
  };
  
  // Next Steps
  description: string;
  preprationTips: string[];
  whatToExpect: string[];
  requirementsChecklist: string[];
  
  // Meta
  createdAt: Date;
  reminderSentAt?: Date;
  status: "pending" | "accepted" | "declined" | "rescheduled";
}

export interface InterviewStats {
  totalInvitations: number;
  accepted: number;
  pending: number;
  declined: number;
  upcomingInDays: number;
}
