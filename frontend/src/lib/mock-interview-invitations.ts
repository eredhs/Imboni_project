import type { InterviewInvitation, InterviewStats } from "@/lib/interview-invitation-types";

export const mockInterviewInvitations: InterviewInvitation[] = [
  {
    id: "invite-1",
    applicationId: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Product Designer",
    companyName: "InnovateTech Rwanda",
    companyAvatar: "🎨",
    
    interviewType: "manager_round",
    format: "in_person",
    scheduledDate: new Date(2026, 3, 15), // April 15
    scheduledTime: "10:00",
    estimatedDuration: 60,
    
    location: "InnovateTech Rwanda Office, KG 621 St, Kigali",
    
    interviewer: {
      name: "Jane Mutesi",
      title: "Design Director",
      email: "jane.mutesi@innovatetech.rw",
      linkedinProfile: "linkedin.com/in/janemutesi",
    },
    
    description:
      "We're excited to move forward with your application! In this round, you'll meet with our Design Director, Jane Mutesi, to discuss your approach to product design, your experience with user research, and how you'd approach some of our current design challenges.",
    
    preprationTips: [
      "Prepare 2-3 examples of your best design work with before/after comparisons",
      "Review InnovateTech's product portfolio on their website",
      "Be ready to discuss your design process and how you validate design decisions",
      "Think about a time you had to work with developers and product managers",
      "Prepare thoughtful questions about the team, design philosophy, and growth opportunities",
    ],
    
    whatToExpect: [
      "Introduction to the role and team (5 minutes)",
      "Discussion of your portfolio and past projects (20 minutes)",
      "Design problem-solving exercise or case study (20 minutes)",
      "Questions about teamwork and communication (10 minutes)",
      "Your questions and closing (5 minutes)",
    ],
    
    requirementsChecklist: [
      "Bring 2 printed copies of your portfolio or resume",
      "Have your design tools portfolio link ready on your phone",
      "Dress business casual",
      "Arrive 10 minutes early",
      "Bring a notebook to take notes",
    ],
    
    createdAt: new Date(2026, 3, 9, 11, 0),
    status: "pending",
  },
  
  {
    id: "invite-2",
    applicationId: "app-2",
    jobId: "job-2",
    jobTitle: "Lead Backend Engineer (Node.js)",
    companyName: "Skyline Solutions",
    companyAvatar: "S",
    
    interviewType: "technical",
    format: "virtual",
    scheduledDate: new Date(2026, 3, 12), // April 12
    scheduledTime: "14:30",
    estimatedDuration: 90,
    
    meetingLink: "https://meet.google.com/skyline-tech-interview-2026",
    
    interviewer: {
      name: "Kevin Habimana",
      title: "Principal Engineer",
      email: "kevin.habimana@skyline.rw",
      linkedinProfile: "linkedin.com/in/kevinhabimana",
    },
    
    description:
      "Congratulations! We'd like to invite you to a technical interview where you'll demonstrate your backend engineering expertise. This round focuses on system design, database optimization, and your problem-solving approach with real-world scenarios.",
    
    preprationTips: [
      "Review common Node.js design patterns (middleware, async/await, error handling)",
      "Brush up on database optimization and query performance",
      "Be prepared to discuss your experience with REST APIs and microservices",
      "Have examples ready that show scalability and performance improvements you've made",
      "Prepare to code live - have your coding environment ready (VS Code, Node.js installed)",
    ],
    
    whatToExpect: [
      "Welcome and role overview (5 minutes)",
      "Live coding challenge on Node.js and database optimization (40 minutes)",
      "System design discussion - designing a scalable API (30 minutes)",
      "Questions about your experience and career goals (10 minutes)",
      "Your questions (5 minutes)",
    ],
    
    requirementsChecklist: [
      "Stable internet connection (test before the call)",
      "Quiet, professional environment",
      "Working microphone and webcam",
      "VS Code or preferred code editor with Node.js installed",
      "Have scratch paper nearby for whiteboarding thoughts",
    ],
    
    createdAt: new Date(2026, 3, 8, 16, 30),
    status: "pending",
  },

  {
    id: "invite-3",
    applicationId: "app-3",
    jobId: "job-3",
    jobTitle: "Data Scientist",
    companyName: "Quantum Analytics",
    companyAvatar: "Q",
    
    interviewType: "hr",
    format: "virtual",
    scheduledDate: new Date(2026, 3, 14), // April 14
    scheduledTime: "09:00",
    estimatedDuration: 45,
    
    meetingLink: "https://zoom.us/j/quantum-analytics-hr-screen",
    
    interviewer: {
      name: "Amara Okafor",
      title: "Head of Talent",
      email: "amara.okafor@quantumanalytics.com",
      linkedinProfile: "linkedin.com/in/amaraokafor",
    },
    
    description:
      "We're pleased to invite you to an HR screening round. This is a chance for us to learn more about your background, career aspirations, and how well you'd fit within our team culture. We'll also discuss compensation expectations and logistics.",
    
    preprationTips: [
      "Prepare a 2-minute summary of your background and why you're interested in data science",
      "Think about 2-3 challenges you've overcome in your career",
      "Research Quantum Analytics' work and be ready to discuss what excites you",
      "Prepare questions about team dynamics, growth opportunities, and company culture",
      "Have your calendar ready to discuss potential start date",
    ],
    
    whatToExpect: [
      "Introduction and welcome (5 minutes)",
      "Discussion of your background and experience (15 minutes)",
      "Why Quantum Analytics and expectations (10 minutes)",
      "Compensation and logistics discussion (10 minutes)",
      "Your questions (5 minutes)",
    ],
    
    requirementsChecklist: [
      "Professional appearance (this is on video)",
      "Quiet room without distractions",
      "Have resume open on your computer for reference",
      "Keep water nearby",
      "Smile and be enthusiastic!",
    ],
    
    createdAt: new Date(2026, 3, 9, 14, 0),
    status: "accepted",
  },
];

export function getInterviewStats(): InterviewStats {
  const today = new Date(2026, 3, 10); // April 10, 2026
  const upcoming = mockInterviewInvitations.filter((inv) => inv.scheduledDate > today);

  return {
    totalInvitations: mockInterviewInvitations.length,
    accepted: mockInterviewInvitations.filter((inv) => inv.status === "accepted").length,
    pending: mockInterviewInvitations.filter((inv) => inv.status === "pending").length,
    declined: mockInterviewInvitations.filter((inv) => inv.status === "declined").length,
    upcomingInDays: upcoming.length,
  };
}

export function getUpcomingInterviews(): InterviewInvitation[] {
  const today = new Date(2026, 3, 10); // April 10, 2026
  return mockInterviewInvitations
    .filter((inv) => inv.scheduledDate >= today && inv.status !== "declined")
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
}

export function getTodayInterviews(): InterviewInvitation[] {
  const today = new Date(2026, 3, 10); // April 10, 2026
  return mockInterviewInvitations.filter(
    (inv) =>
      inv.scheduledDate.getTime() === today.getTime() &&
      inv.status !== "declined"
  );
}
