import type { TalentProfileRecord } from "../schemas/talent-profile.schema.js";
import { talentProfilesByApplicantId } from "./talent-profiles.js";

export type JobStatus = "active" | "draft" | "closed" | "screened";
export type ScreeningStatus = "Completed" | "In Progress" | "Pending";
export type ApplicantStatus = "Shortlisted" | "Review" | "Pending" | "Rejected";
export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  location?: string;
  passwordHash: string;
  refreshTokens: string[];
};

export type JobRecord = {
  id: string;
  hrId: string;
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
};

export type ApplicantRecord = {
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
  talentProfile: TalentProfileRecord;
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
};

export type ShortlistCandidateRecord = ApplicantRecord & {
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

export const users: UserRecord[] = [
  {
    id: "user-sarah",
    email: "sarah@talentlens.ai",
    name: "Sarah Jenkins",
    role: "recruiter",
    organization: "TalentLens Demo",
    passwordHash: "$2b$12$UOtdWebfUOlh0PxV/1btgucfexW7/k66HhRnjd3moF6.VIw49cpbm",
    refreshTokens: [],
  },
  {
    id: "recruiter-1",
    email: "demohr@talentlens.ai",
    name: "Demo Recruiter",
    role: "recruiter",
    organization: "TalentLens Demo Company",
    passwordHash: "$2b$12$xzTAY.KK6KZo6toeHOkuJ.KQXiVXrblRe2.CJ3nYfCI9.6MsMdXSq",
    refreshTokens: [],
  },
  {
    id: "seeker-1",
    email: "demouser@talentlens.ai",
    name: "James Uwase",
    role: "job_seeker",
    organization: "Individual",
    passwordHash: "$2b$12$Gml.7A1FhS1O0PktdwSdPOUxV6oGyDYJrsMCeJbdw05WAG8oxBwrS",
    refreshTokens: [],
  },
  {
    id: "recruiter-demo",
    email: "recruiter@imboni.demo",
    name: "Sarah Johnson",
    role: "recruiter",
    organization: "IMBONI Demo Company",
    passwordHash: "$2b$12$8J7.vZQ8C0Z9K.pL3mN4h.qR5sT6uV7wX8yZ0aB1cD2eF3gH4iJ5k",
    refreshTokens: [],
  },
  {
    id: "hr-demo",
    email: "hrdemo@gmail.com",
    name: "Demo HR",
    role: "recruiter",
    organization: "IMBONI Demo",
    passwordHash: "$2b$12$2xZSCIwSYHXdZaSyHPOR..8P4dfJfVYtV52riRJcTSqDt4B/T/3ni",
    refreshTokens: [],
  },
];

export const user = {
  id: users[0].id,
  email: users[0].email,
  name: users[0].name,
  role: users[0].role,
};

export const jobs: JobRecord[] = [
  {
    id: "job-frontend",
    hrId: "recruiter-1",
    title: "Frontend Developer",
    description: "Build polished product experiences with React and TypeScript.",
    department: "Engineering",
    location: "Kigali",
    seniority: "Senior",
    type: "Full-time",
    status: "active",
    applicantCount: 47,
    requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
    preferredSkills: ["Testing", "GraphQL", "Next.js"],
    minExperienceYears: 4,
    educationLevel: "Bachelor",
    screeningStatus: "Completed",
    topScore: 94,
    createdAt: "2026-04-01T08:30:00.000Z",
    applicationDeadline: "2026-04-30T23:59:59.000Z",
  },
  {
    id: "job-product",
    hrId: "recruiter-1",
    title: "Product Manager",
    description: "Lead product strategy and cross-functional delivery.",
    department: "Product",
    location: "Muhanga",
    seniority: "Mid-level",
    type: "Full-time",
    status: "active",
    applicantCount: 31,
    requiredSkills: ["Roadmapping", "Analytics", "Stakeholder Management"],
    preferredSkills: ["B2B SaaS", "Experimentation"],
    minExperienceYears: 3,
    educationLevel: "Bachelor",
    screeningStatus: "In Progress",
    topScore: 88,
    createdAt: "2026-03-22T09:15:00.000Z",
    applicationDeadline: "2026-04-25T23:59:59.000Z",
  },
  {
    id: "job-devops-dominik",
    hrId: "user-sarah",
    title: "DevOps Engineer",
    description: "Own platform reliability and CI/CD practices.",
    department: "Engineering",
    location: "Kigali",
    seniority: "Senior",
    type: "Full-time",
    status: "active",
    applicantCount: 22,
    requiredSkills: ["AWS", "CI/CD", "Kubernetes"],
    preferredSkills: ["Terraform", "Observability"],
    minExperienceYears: 4,
    educationLevel: "Bachelor",
    screeningStatus: "Pending",
    topScore: 79,
    createdAt: "2026-03-18T11:40:00.000Z",
    applicationDeadline: "2026-04-28T23:59:59.000Z",
  },
  {
    id: "job-ux",
    hrId: "user-sarah",
    title: "UX Designer",
    description: "Design user journeys and production-ready product flows.",
    department: "Design",
    location: "Kigali",
    seniority: "Mid-level",
    type: "Full-time",
    status: "active",
    applicantCount: 18,
    requiredSkills: ["Figma", "Research", "Wireframing"],
    preferredSkills: ["Animation", "Design Systems"],
    minExperienceYears: 3,
    educationLevel: "Bachelor",
    screeningStatus: "Pending",
    topScore: 94,
    createdAt: "2026-03-11T06:00:00.000Z",
    applicationDeadline: "2026-05-10T23:59:59.000Z",
  },
  {
    id: "job-backend",
    hrId: "recruiter-1",
    title: "Backend Engineer",
    description: "Build scalable APIs and data services.",
    department: "Engineering",
    location: "Muhanga",
    seniority: "Mid-level",
    type: "Full-time",
    status: "active",
    applicantCount: 15,
    requiredSkills: ["Node.js", "MongoDB", "API Design"],
    preferredSkills: ["Redis", "Queues"],
    minExperienceYears: 3,
    educationLevel: "Bachelor",
    screeningStatus: "Pending",
    topScore: 85,
    createdAt: "2026-04-04T10:00:00.000Z",
    applicationDeadline: "2026-05-15T23:59:59.000Z",
  },
  {
    id: "job-data",
    hrId: "user-sarah",
    title: "Data Analyst",
    description: "Deliver business insights and dashboard reporting.",
    department: "Analytics",
    location: "Kigali",
    seniority: "Mid-level",
    type: "Full-time",
    status: "active",
    applicantCount: 54,
    requiredSkills: ["SQL", "Excel", "Dashboarding"],
    preferredSkills: ["Python", "Forecasting"],
    minExperienceYears: 2,
    educationLevel: "Bachelor",
    screeningStatus: "Completed",
    topScore: 91,
    createdAt: "2026-02-28T14:20:00.000Z",
    applicationDeadline: "2026-05-20T23:59:59.000Z",
  },
  {
    id: "job-devops",
    hrId: "recruiter-dominik",
    title: "DevOps Engineer",
    description: "Build and maintain CI/CD pipelines and infrastructure.",
    department: "Infrastructure",
    location: "Kigali",
    seniority: "Senior",
    type: "Full-time",
    status: "active",
    applicantCount: 28,
    requiredSkills: ["Kubernetes", "Docker", "Terraform", "AWS"],
    preferredSkills: ["Go", "GraphQL", "AWS Lambda"],
    minExperienceYears: 5,
    educationLevel: "Bachelor",
    screeningStatus: "Completed",
    topScore: 96,
    createdAt: "2026-04-10T09:00:00.000Z",
    applicationDeadline: "2026-05-10T23:59:59.000Z",
  },
  {
    id: "job-fullstack",
    hrId: "recruiter-dominik",
    title: "Full Stack Developer",
    description: "Build modern web applications with React and Node.js.",
    department: "Engineering",
    location: "Muhanga",
    seniority: "Mid-level",
    type: "Full-time",
    status: "active",
    applicantCount: 42,
    requiredSkills: ["React", "Node.js", "PostgreSQL"],
    preferredSkills: ["TypeScript", "Docker", "AWS"],
    minExperienceYears: 3,
    educationLevel: "Bachelor",
    screeningStatus: "In Progress",
    topScore: 89,
    createdAt: "2026-04-12T11:30:00.000Z",
    applicationDeadline: "2026-05-25T23:59:59.000Z",
  },
];

export const applicants: ApplicantRecord[] = [
  {
    id: "app-alice",
    jobId: "job-frontend",
    fullName: "Alice Mwangi",
    location: "Nairobi, Kenya",
    currentRole: "Senior Frontend Engineer",
    yearsExperience: 5,
    score: 94,
    status: "Shortlisted",
    confidence: "high",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    email: "alice.mwangi@example.com",
    talentProfile: talentProfilesByApplicantId["app-alice"],
  },
  {
    id: "app-jordan",
    jobId: "job-frontend",
    fullName: "Jordan Smith",
    location: "Kigali, Rwanda",
    currentRole: "Frontend Developer",
    yearsExperience: 4,
    score: 88,
    status: "Shortlisted",
    confidence: "high",
    skills: ["Next.js", "GraphQL", "Accessibility"],
    email: "jordan.smith@example.com",
    talentProfile: talentProfilesByApplicantId["app-jordan"],
  },
  {
    id: "app-sarah",
    jobId: "job-frontend",
    fullName: "Sarah Chen",
    location: "Cape Town, South Africa",
    currentRole: "UI Engineer",
    yearsExperience: 3,
    score: 82,
    status: "Review",
    confidence: "medium",
    skills: ["React", "CSS Animations", "Figma"],
    email: "sarah.chen@example.com",
    talentProfile: talentProfilesByApplicantId["app-sarah"],
  },
  {
    id: "app-elena",
    jobId: "job-frontend",
    fullName: "Elena Rodriguez",
    location: "Accra, Ghana",
    currentRole: "Frontend Lead",
    yearsExperience: 7,
    score: 91,
    status: "Shortlisted",
    confidence: "high",
    skills: ["React Native", "Mentorship", "CI/CD"],
    email: "elena.rodriguez@example.com",
    talentProfile: talentProfilesByApplicantId["app-elena"],
  },
  {
    id: "app-priya",
    jobId: "job-frontend",
    fullName: "Priya Sharma",
    location: "Kigali, Rwanda",
    currentRole: "Lead Frontend Developer",
    yearsExperience: 6,
    score: 95,
    status: "Shortlisted",
    confidence: "high",
    skills: ["React", "Architecture", "Web Performance"],
    email: "priya.sharma@example.com",
    talentProfile: talentProfilesByApplicantId["app-priya"],
  },
  {
    id: "app-marcus",
    jobId: "job-frontend",
    fullName: "Marcus Holloway",
    location: "Lagos, Nigeria",
    currentRole: "Fullstack Developer",
    yearsExperience: 5,
    score: 78,
    status: "Review",
    confidence: "high",
    skills: ["React", "Node.js", "GraphQL"],
    email: "marcus.holloway@example.com",
    talentProfile: talentProfilesByApplicantId["app-marcus"],
  },
  {
    id: "app-david",
    jobId: "job-frontend",
    fullName: "David Kim",
    location: "Accra, Ghana",
    currentRole: "Software Engineer",
    yearsExperience: 4,
    score: 68,
    status: "Pending",
    confidence: "medium",
    skills: ["JavaScript", "HTML/CSS", "Python"],
    email: "david.kim@example.com",
    talentProfile: talentProfilesByApplicantId["app-david"],
  },
  {
    id: "app-james",
    jobId: "job-frontend",
    fullName: "James Wilson",
    location: "Cape Town, South Africa",
    currentRole: "Senior Developer",
    yearsExperience: 4,
    score: 84,
    status: "Review",
    confidence: "medium",
    skills: ["Vue.js", "TypeScript", "Testing"],
    email: "james.wilson@example.com",
    talentProfile: talentProfilesByApplicantId["app-james"],
  },
  {
    id: "app-lila",
    jobId: "job-frontend",
    fullName: "Lila Thorne",
    location: "London, United Kingdom",
    currentRole: "Frontend Engineer",
    yearsExperience: 3,
    score: 72,
    status: "Pending",
    confidence: "uncertain",
    skills: ["JavaScript", "Three.js", "Web3"],
    email: "lila.thorne@example.com",
    talentProfile: talentProfilesByApplicantId["app-lila"],
  },
  {
    id: "app-samir",
    jobId: "job-frontend",
    fullName: "Samir Gupta",
    location: "Dubai, UAE",
    currentRole: "Frontend Architect",
    yearsExperience: 7,
    score: 89,
    status: "Shortlisted",
    confidence: "high",
    skills: ["Micro-frontends", "React", "DevOps"],
    email: "samir.gupta@example.com",
    talentProfile: talentProfilesByApplicantId["app-samir"],
  },
  {
    id: "app-devops-1",
    jobId: "job-devops",
    fullName: "Kumar Singh",
    location: "Bangalore, India",
    currentRole: "Senior DevOps Engineer",
    yearsExperience: 6,
    score: 96,
    status: "Shortlisted",
    confidence: "high",
    skills: ["Kubernetes", "Terraform", "AWS", "Docker"],
    email: "kumar.singh@example.com",
    talentProfile: talentProfilesByApplicantId["app-samir"],
  },
  {
    id: "app-devops-2",
    jobId: "job-devops",
    fullName: "Charlotte Dupont",
    location: "Paris, France",
    currentRole: "Infrastructure Engineer",
    yearsExperience: 5,
    score: 91,
    status: "Shortlisted",
    confidence: "high",
    skills: ["Kubernetes", "Go", "Terraform", "AWS"],
    email: "charlotte.dupont@example.com",
    talentProfile: talentProfilesByApplicantId["app-marcus"],
  },
  {
    id: "app-fullstack-1",
    jobId: "job-fullstack",
    fullName: "Amara Okafor",
    location: "Lagos, Nigeria",
    currentRole: "Full Stack Developer",
    yearsExperience: 4,
    score: 89,
    status: "Shortlisted",
    confidence: "high",
    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
    email: "amara.okafor@example.com",
    talentProfile: talentProfilesByApplicantId["app-alice"],
  },
  {
    id: "app-fullstack-2",
    jobId: "job-fullstack",
    fullName: "Yuki Tanaka",
    location: "Tokyo, Japan",
    currentRole: "Senior Full Stack Engineer",
    yearsExperience: 5,
    score: 85,
    status: "Review",
    confidence: "high",
    skills: ["Next.js", "TypeScript", "MongoDB", "AWS"],
    email: "yuki.tanaka@example.com",
    talentProfile: talentProfilesByApplicantId["app-jordan"],
  },
];

export const shortlistCandidates: ShortlistCandidateRecord[] = [
  {
    ...applicants[0],
    gap: "System Design",
    quote:
      "Strong architectural patterns and clean code advocate with 6+ years experience.",
    overview:
      "Alice demonstrates strong React and TypeScript depth with reliable delivery in product-facing teams. She is the strongest immediate-fit candidate for this shortlist.",
    notes: [
      "Prefers teams with strong engineering standards.",
      "Has led component library migrations before.",
      "Could need onboarding support in distributed systems design.",
    ],
    reasoning:
      "Alice demonstrates strong React expertise with five years of production delivery. Her TypeScript depth and UI ownership align tightly with the core frontend stack requirements.",
    recommendation:
      "Alice is uniquely qualified to contribute immediately while still offering room for long-term growth into architectural ownership.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 2% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React, TS, Testing)", value: 96 },
      { label: "Industry Experience", value: 88 },
      { label: "Communication & Leadership", value: 82 },
      { label: "Culture Alignment", value: 75 },
      { label: "Certifications & Education", value: 60 },
    ],
  },
  {
    ...applicants[1],
    gap: "State Management",
    quote:
      "Exceptional UI implementation speed with startup experience shipping accessible interfaces.",
    overview:
      "Jordan is fast, product-aware, and dependable in frontend execution, with strong accessibility signal and modern app-stack fluency.",
    notes: [
      "Strong interface execution.",
      "Needs deeper architectural ownership examples.",
      "Good fit for high-velocity feature teams.",
    ],
    reasoning:
      "Jordan pairs modern frontend depth with solid accessibility practice and a good delivery pace. The main risk is lighter evidence of architectural ownership at scale.",
    recommendation:
      "Jordan is a high-upside finalist for teams that value shipping velocity and polished product execution.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 5% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (Next.js, GraphQL, Accessibility)", value: 90 },
      { label: "Industry Experience", value: 84 },
      { label: "Communication & Leadership", value: 79 },
      { label: "Culture Alignment", value: 77 },
      { label: "Certifications & Education", value: 65 },
    ],
  },
  {
    ...applicants[2],
    gap: "Unit Testing",
    quote:
      "Visual-first engineer who bridges design-to-code workflows with strong motion and polish instincts.",
    overview:
      "Sarah is strongest where design precision and polished implementation matter. Testing maturity is the main gap for the current role.",
    notes: [
      "Very strong design-to-code execution.",
      "Good motion and visual system instincts.",
      "Needs a stronger testing story.",
    ],
    reasoning:
      "Sarah has a strong frontend craft signal around interface polish and design collaboration. The main concern is weaker evidence of testing rigor in production teams.",
    recommendation:
      "Sarah is best suited for product teams that prioritize high-quality UI craft alongside coaching on testing discipline.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 10% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React, Figma, CSS)", value: 86 },
      { label: "Industry Experience", value: 72 },
      { label: "Communication & Leadership", value: 78 },
      { label: "Culture Alignment", value: 80 },
      { label: "Certifications & Education", value: 66 },
    ],
  },
  {
    ...applicants[5],
    gap: "Frontend Performance",
    quote:
      "Versatile engineer with strong backend understanding and high adaptability across product domains.",
    overview:
      "Marcus is adaptable and well-rounded, but the role needs more obvious frontend performance specialization.",
    notes: [
      "Strong generalist profile.",
      "Useful if the team values backend overlap.",
      "Would benefit from focused frontend tuning practice.",
    ],
    reasoning:
      "Marcus brings useful full-stack breadth and solid React familiarity. He is slightly below the top finalists because the role prioritizes deeper frontend specialization.",
    recommendation:
      "Marcus is a credible backup option if the team values cross-functional engineering coverage.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 18% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React, GraphQL, Node.js)", value: 79 },
      { label: "Industry Experience", value: 81 },
      { label: "Communication & Leadership", value: 74 },
      { label: "Culture Alignment", value: 70 },
      { label: "Certifications & Education", value: 58 },
    ],
  },
  {
    ...applicants[3],
    gap: "Cloud Infrastructure",
    quote:
      "Proven leadership in distributed teams with deep mobile-first and delivery discipline.",
    overview:
      "Elena brings mature leadership, delivery rigor, and team leverage. She is a strong finalist for long-term team growth.",
    notes: [
      "Strong mentoring signals.",
      "Would raise team delivery standards.",
      "Infrastructure depth is the main watch area.",
    ],
    reasoning:
      "Elena combines senior delivery leadership with frontend execution credibility. Her infrastructure depth is lighter than her product engineering leadership signal.",
    recommendation:
      "Elena is a strong strategic hire if the team needs senior leadership alongside frontend depth.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 3% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React Native, CI/CD, Mentorship)", value: 92 },
      { label: "Industry Experience", value: 90 },
      { label: "Communication & Leadership", value: 89 },
      { label: "Culture Alignment", value: 82 },
      { label: "Certifications & Education", value: 64 },
    ],
  },
  {
    ...applicants[6],
    gap: "Modern Frameworks",
    quote:
      "Solid CS fundamentals. Needs structured training on the current React production ecosystem.",
    overview:
      "David is technically capable but less ready for the role's expected frontend stack and production patterns.",
    notes: [
      "Foundational engineering ability is clear.",
      "Would require more role-specific ramp-up.",
      "Better fit for junior-to-mid platform growth path.",
    ],
    reasoning:
      "David shows clear engineering potential and strong fundamentals. He ranks lower because the role expects immediate strength in modern React application patterns.",
    recommendation:
      "David is a promising long-term option but not the best immediate fit for this shortlist.",
    verifiedExpertise: false,
    topCandidateLabel: "Growth Potential",
    scoreBreakdown: [
      { label: "Skills Match (JavaScript, HTML/CSS, Python)", value: 63 },
      { label: "Industry Experience", value: 67 },
      { label: "Communication & Leadership", value: 72 },
      { label: "Culture Alignment", value: 74 },
      { label: "Certifications & Education", value: 61 },
    ],
  },
  {
    ...applicants[4],
    gap: "NoSQL Databases",
    quote:
      "Performance expert with significant contributions to large-scale design systems.",
    overview:
      "Priya combines architecture, scale, and performance discipline. She reads like a standout for frontend platform responsibility.",
    notes: [
      "Very strong architecture profile.",
      "Good candidate for senior ownership.",
      "Database breadth is not a major blocker here.",
    ],
    reasoning:
      "Priya has the strongest combination of scale, architecture, and web performance discipline in the pool. Her profile maps cleanly to senior frontend platform responsibility.",
    recommendation:
      "Priya is one of the clearest immediate-impact hires in the current shortlist.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 1% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React, Architecture, WebPerf)", value: 97 },
      { label: "Industry Experience", value: 91 },
      { label: "Communication & Leadership", value: 85 },
      { label: "Culture Alignment", value: 81 },
      { label: "Certifications & Education", value: 69 },
    ],
  },
  {
    ...applicants[7],
    gap: "React Context API",
    quote:
      "Cross-functional engineer with strong logical reasoning and steady delivery habits.",
    overview:
      "James is thoughtful and technically sound, but the React-specific signal is weaker than the top shortlist candidates.",
    notes: [
      "Strong problem-solving posture.",
      "May translate well between stacks.",
      "Would need React-specific assessment follow-up.",
    ],
    reasoning:
      "James is technically strong and adapts well across stacks. His relative ranking is limited by weaker direct evidence in React-heavy product environments.",
    recommendation:
      "James is a reliable secondary option if the team values broad engineering versatility.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 12% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (Vue, TypeScript, Testing)", value: 82 },
      { label: "Industry Experience", value: 79 },
      { label: "Communication & Leadership", value: 81 },
      { label: "Culture Alignment", value: 78 },
      { label: "Certifications & Education", value: 62 },
    ],
  },
  {
    ...applicants[8],
    gap: "Team Collaboration",
    quote:
      "Niche visual specialist best suited for experimental, graphics-heavy frontend work.",
    overview:
      "Lila has interesting specialization, but the role needs steadier evidence in mainstream frontend collaboration and delivery.",
    notes: [
      "Specialist profile.",
      "May fit innovation-heavy work better.",
      "Confidence is lower due to narrower experience match.",
    ],
    reasoning:
      "Lila has a differentiated creative frontend profile but a narrower match for the team's core delivery needs. Confidence is lower because the experience is more specialized.",
    recommendation:
      "Lila is better suited to innovation-heavy teams than this core frontend opening.",
    verifiedExpertise: false,
    topCandidateLabel: "Specialist Profile",
    scoreBreakdown: [
      { label: "Skills Match (JavaScript, Three.js, Web3)", value: 71 },
      { label: "Industry Experience", value: 68 },
      { label: "Communication & Leadership", value: 69 },
      { label: "Culture Alignment", value: 63 },
      { label: "Certifications & Education", value: 56 },
    ],
  },
  {
    ...applicants[9],
    gap: "Visual Design",
    quote:
      "Heavyweight technical architect with strong infrastructure and scalability instincts.",
    overview:
      "Samir is highly credible on architecture and scale. If technical depth is prioritized over visual craft, he moves up quickly.",
    notes: [
      "Excellent systems thinking.",
      "Would strengthen platform and scale decisions.",
      "Less design-oriented than some other finalists.",
    ],
    reasoning:
      "Samir stands out for architecture and scale, especially where platform thinking matters. He ranks slightly behind the very top candidates because the role also values visual product craft.",
    recommendation:
      "Samir is a strong choice for teams optimizing for frontend architecture and platform maturity.",
    verifiedExpertise: true,
    topCandidateLabel: "Top 4% Candidate",
    scoreBreakdown: [
      { label: "Skills Match (React, Micro-frontends, DevOps)", value: 90 },
      { label: "Industry Experience", value: 87 },
      { label: "Communication & Leadership", value: 80 },
      { label: "Culture Alignment", value: 76 },
      { label: "Certifications & Education", value: 67 },
    ],
  },
];

export const reportsOverview = {
  activeJobs: 12,
  closingThisWeek: 3,
  pendingScreenings: 47,
  shortlistedToday: 8,
  shortlistedAcrossRoles: 3,
  totalScreened: 312,
  totalScreenedDelta: 12,
  avgTimeSavedHours: 5.8,
  efficiencyGainPercent: 82,
  dashboardTimeSavedHours: 14.2,
  shortlistAcceptance: 73,
  shortlistDelta: 5,
  poolIntelligence:
    "Applicant pool is strong in React skills but weak in system design. Consider relaxing DevOps requirement or expanding the search.",
  keyIndicators: {
    skillStrength: "Frontend Engineering",
    marketFit: "Top 15% Percentile",
  },
  updatedHoursAgo: 2,
  outcomes: {
    hired: 18,
    rejected: 52,
    inProgress: 30,
  },
};

export const timeline = [
  { day: "01", uploaded: 12, shortlisted: 8 },
  { day: "05", uploaded: 18, shortlisted: 12 },
  { day: "10", uploaded: 25, shortlisted: 15 },
  { day: "15", uploaded: 45, shortlisted: 32 },
  { day: "20", uploaded: 37, shortlisted: 28 },
  { day: "25", uploaded: 51, shortlisted: 41 },
  { day: "30", uploaded: 47, shortlisted: 35 },
];

export const skillsFrequency = [
  { skill: "React", count: 52 },
  { skill: "Python", count: 44 },
  { skill: "TypeScript", count: 41 },
  { skill: "Node.js", count: 36 },
  { skill: "AWS", count: 28 },
];

export const biasHistory = [
  {
    id: "bias-1",
    date: "Oct 24, 2023",
    targetRole: "Frontend Developer",
    alertType: "Gender Distribution",
    actionTaken: "Weight Adjusted",
  },
  {
    id: "bias-2",
    date: "Oct 22, 2023",
    targetRole: "Data Analyst",
    alertType: "Education Bias",
    actionTaken: "University Masking",
  },
  {
    id: "bias-3",
    date: "Oct 19, 2023",
    targetRole: "DevOps Engineer",
    alertType: "Experience Clustering",
    actionTaken: "Criteria Refined",
  },
  {
    id: "bias-4",
    date: "Oct 15, 2023",
    targetRole: "Backend Engineer",
    alertType: "Location Neutrality",
    actionTaken: "Review Completed",
  },
];

export const settings = {
  weights: {
    skills: 40,
    experience: 25,
    communication: 20,
    culture: 15,
  },
  biasDetection: {
    enabled: true,
    educationGuard: true,
    clustering: false,
  },
  shortlistSize: 10,
  autoRescreen: true,
};

export const candidateNotes: Record<
  string,
  Array<{ id: string; recruiterName: string; text: string; createdAt: string }>
> = {
  "app-alice": [
    {
      id: "note-1",
      recruiterName: "Sarah Jenkins",
      text: "Strong fit for immediate interview shortlist.",
      createdAt: "2026-04-08T08:10:00.000Z",
    },
  ],
};

export const screeningActions: Record<string, "approved" | "rejected" | "flagged" | "pending"> =
  Object.fromEntries(shortlistCandidates.map((candidate) => [candidate.id, "pending"]));
