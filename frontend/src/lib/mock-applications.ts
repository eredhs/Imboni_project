import type { Application, ApplicationTimeline, ApplicationMetrics } from "@/lib/application-tracker-types";

export const mockApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Product Designer",
    companyName: "InnovateTech Rwanda",
    companyAvatar: "I",
    location: "Kigali, Rwanda",
    jobType: "Full-time",
    appliedDate: new Date(2026, 3, 2), // April 2
    salary: {
      min: 1500000,
      max: 2200000,
      currency: "RWF",
    },
    status: "accepted",
    currentStage: "Offer Accepted",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 3, 2, 10, 30),
        icon: "check-circle",
      },
      {
        id: "timeline-2",
        action: "viewed",
        message: "Your application was viewed by the hiring team",
        timestamp: new Date(2026, 3, 3, 14, 0),
        icon: "eye",
      },
      {
        id: "timeline-3",
        action: "interview_scheduled",
        message: "You have been invited for a technical interview",
        timestamp: new Date(2026, 3, 5, 9, 0),
        icon: "phone",
      },
      {
        id: "timeline-4",
        action: "accepted",
        message: "Congratulations! You passed the interview round",
        timestamp: new Date(2026, 3, 8, 16, 30),
        icon: "party-popper",
      },
      {
        id: "timeline-5",
        action: "offer_received",
        message: "You received a job offer. Check your email for details.",
        timestamp: new Date(2026, 3, 9, 11, 0),
        icon: "mail",
      },
    ],
    successRate: 100,
    daysInProcess: 7,
    contactPerson: {
      name: "Jane Mutesi",
      role: "Hiring Manager",
    },
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Lead Backend Engineer (Node.js)",
    companyName: "Skyline Solutions",
    companyAvatar: "S",
    location: "Kigali, Rwanda",
    jobType: "Full-time",
    appliedDate: new Date(2026, 3, 1),
    salary: {
      min: 2000000,
      max: 2800000,
      currency: "RWF",
    },
    status: "under_review",
    currentStage: "Under Review",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 3, 1, 15, 45),
        icon: "✅",
      },
      {
        id: "timeline-2",
        action: "viewed",
        message: "Your application was viewed by the hiring team",
        timestamp: new Date(2026, 3, 2, 10, 0),
        icon: "👁️",
      },
    ],
    successRate: 68,
    daysInProcess: 9,
    contactPerson: {
      name: "Kevin Habimana",
      role: "Technical Lead",
    },
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Data Scientist",
    companyName: "Quantum Analytics",
    companyAvatar: "Q",
    location: "Nairobi, Kenya (Remote)",
    jobType: "Full-time",
    appliedDate: new Date(2026, 2, 28),
    salary: {
      min: 1800000,
      max: 2600000,
      currency: "RWF",
    },
    status: "under_review",
    currentStage: "Technical Assessment",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 2, 28, 14, 20),
        icon: "check-circle",
      },
      {
        id: "timeline-2",
        action: "viewed",
        message: "Your application was viewed by the hiring team",
        timestamp: new Date(2026, 2, 29, 9, 0),
        icon: "eye",
      },
      {
        id: "timeline-3",
        action: "interview_scheduled",
        message: "You have been sent a technical assessment",
        timestamp: new Date(2026, 3, 4, 11, 30),
        icon: "file-text",
      },
    ],
    successRate: 56,
    daysInProcess: 12,
    contactPerson: {
      name: "Dr. Amara Okafor",
      role: "Hiring Manager",
    },
    nextAction: {
      type: "assessment",
      dueDate: new Date(2026, 3, 12),
      text: "Complete technical assessment by April 12, 2026",
    },
  },
  {
    id: "app-4",
    jobId: "job-4",
    jobTitle: "Frontend Developer (React)",
    companyName: "GrowthLoop",
    companyAvatar: "G",
    location: "Kigali, Rwanda",
    jobType: "Full-time",
    appliedDate: new Date(2026, 3, 3),
    salary: {
      min: 1200000,
      max: 1800000,
      currency: "RWF",
    },
    status: "rejected",
    currentStage: "Application Not Selected",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 3, 3, 16, 0),
        icon: "check-circle",
      },
      {
        id: "timeline-2",
        action: "viewed",
        message: "Your application was reviewed",
        timestamp: new Date(2026, 3, 4, 13, 45),
        icon: "eye",
      },
      {
        id: "timeline-3",
        action: "rejected",
        message: "Unfortunately, we have decided to move forward with other candidates",
        timestamp: new Date(2026, 3, 4, 14, 0),
        icon: "x-circle",
      },
    ],
    successRate: 0,
    daysInProcess: 1,
  },
  {
    id: "app-5",
    jobId: "job-5",
    jobTitle: "Product Manager",
    companyName: "TechnoCore",
    companyAvatar: "💼",
    location: "Kigali, Rwanda",
    jobType: "Full-time",
    appliedDate: new Date(2026, 3, 4),
    salary: {
      min: 1600000,
      max: 2200000,
      currency: "RWF",
    },
    status: "under_review",
    currentStage: "Under Review",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 3, 4, 11, 30),
        icon: "✅",
      },
    ],
    successRate: 45,
    daysInProcess: 6,
    contactPerson: {
      name: "Alice Mugisha",
      role: "Head of People",
    },
  },
  {
    id: "app-6",
    jobId: "job-6",
    jobTitle: "UX Researcher",
    companyName: "DesignFlow Systems",
    companyAvatar: "🔍",
    location: "Kigali, Rwanda (Remote)",
    jobType: "Full-time",
    appliedDate: new Date(2026, 3, 5),
    salary: {
      min: 1000000,
      max: 1500000,
      currency: "RWF",
    },
    status: "rejected",
    currentStage: "Application Not Selected",
    timeline: [
      {
        id: "timeline-1",
        action: "submitted",
        message: "Your application was submitted successfully",
        timestamp: new Date(2026, 3, 5, 9, 0),
        icon: "✅",
      },
      {
        id: "timeline-2",
        action: "rejected",
        message: "The position has been filled",
        timestamp: new Date(2026, 3, 5, 17, 30),
        icon: "❌",
      },
    ],
    successRate: 0,
    daysInProcess: 0,
  },
];

export function getApplicationMetrics(): ApplicationMetrics {
  const total = mockApplications.length;
  const underReview = mockApplications.filter((a) => a.status === "under_review").length;
  const resultsOut = mockApplications.filter((a) => a.status === "accepted").length;
  const successful = mockApplications.filter((a) => a.status === "accepted").length;
  const notSuccessful = mockApplications.filter((a) => a.status === "rejected").length;

  return {
    totalApplied: total,
    underReview,
    resultsOut,
    successful,
    notSuccessful,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    appliedThisWeek: mockApplications.filter((a) => {
      const daysAgo = Math.floor(
        (new Date().getTime() - a.appliedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysAgo <= 7;
    }).length,
    averageDaysToResponse: 5, // Mock value - would calculate from real data
  };
}

export function getApplicationsByStatus(status: string): Application[] {
  if (status === "all") {
    return mockApplications;
  }
  if (status === "results_out") {
    return mockApplications.filter((a) => a.status === "accepted");
  }
  return mockApplications.filter((a) => a.status === status);
}
