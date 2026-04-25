import { callGemini } from "../config/gemini.js";

export type ParsedCandidateData = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  currentRole: string | null;
  location: string | null;
  skills: string[];
  yearsOfExperience: number;
  education: {
    highestDegree: "phd" | "masters" | "bachelor" | "diploma" | "none";
    fieldOfStudy: string;
    institution: string;
    graduationYear: number | null;
  };
  certifications: string[];
  projects: string[];
  workHistory: Array<{
    role: string;
    company: string;
    years: number;
    current: boolean;
    description: string;
  }>;
  languages: string[];
  industries: string[];
  dataQuality: "complete" | "partial" | "minimal";
};

export type ExplanationResult = {
  applicantId: string;
  projectRelevanceScore: number;
  industryFitScore: number;
  strengths: string[];
  gaps: string[];
  reasoning: string;
  confidence: "high" | "medium" | "uncertain";
  recommendation: string;
};

export type ShortlistStats = {
  degrees: Record<string, number>;
  institutions: Record<string, number>;
  expMin: number;
  expMax: number;
  industries: Record<string, number>;
  skillsWeight: number;
};

export type PoolStats = {
  totalCount: number;
  avgScore: number;
  topScore: number;
  skillCoverage: Record<string, number>;
  topGaps: string[];
};

export async function safeGeminiCall<T>(
  callFn: () => Promise<T>,
  fallback: T,
  context: string,
): Promise<T> {
  try {
    return await callFn();
  } catch (error: any) {
    console.error(`[GEMINI FAILED: ${context}]`, error?.message ?? error);
    return fallback;
  }
}

function parseJsonSafe<T>(raw: string, fallback: T, context: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (error: any) {
    console.error(`[GEMINI JSON PARSE FAILED: ${context}]`, error?.message ?? error);
    return fallback;
  }
}

export async function suggestJobSkills(
  title: string,
  description: string,
  currentSkills: string[],
): Promise<{ suggestedSkills: string[]; reasoning: string }> {
  const prompt = `
You are a senior technical recruiter.
A company is creating a job posting.

Job Title: ${title}
Description: ${description}
Skills already listed: ${currentSkills.join(", ")}

Suggest up to 6 additional skills that are commonly required
for this role but are NOT already in the list above.
Only suggest skills directly relevant to this specific title.
Be precise. No generic skills like "communication."

Return ONLY valid JSON. No text before or after.
{
  "suggestedSkills": string[],
  "reasoning": string
}
`;
  const raw = await callGemini(prompt);
  return parseJsonSafe(raw, { suggestedSkills: [], reasoning: "" }, "suggestJobSkills");
}

export async function extractResumeData(rawText: string): Promise<ParsedCandidateData> {
  const prompt = `
You are a precision resume parser with 20 years experience.
Extract structured information from the text below.
Do not invent information. If a field is not present, use null.

RESUME TEXT:
${rawText.slice(0, 8000)}

Return ONLY valid JSON:
{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "currentRole": string | null,
  "location": string | null,
  "skills": string[],
  "yearsOfExperience": number,
  "education": {
    "highestDegree": "phd"|"masters"|"bachelor"|"diploma"|"none",
    "fieldOfStudy": string,
    "institution": string,
    "graduationYear": number | null
  },
  "certifications": string[],
  "projects": string[],
  "workHistory": [
    { "role": string, "company": string, "years": number,
      "current": boolean, "description": string }
  ],
  "languages": string[],
  "industries": string[],
  "dataQuality": "complete" | "partial" | "minimal"
}
`;
  const raw = await callGemini(prompt);
  const fallback: ParsedCandidateData = {
    fullName: null,
    email: null,
    phone: null,
    currentRole: null,
    location: null,
    skills: [],
    yearsOfExperience: 0,
    education: {
      highestDegree: "none",
      fieldOfStudy: "",
      institution: "",
      graduationYear: null,
    },
    certifications: [],
    projects: [],
    workHistory: [],
    languages: [],
    industries: [],
    dataQuality: "minimal",
  };
  return parseJsonSafe(raw, fallback, "extractResumeData");
}

export async function generateCandidateExplanations(
  job: {
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
    minExperienceYears: number;
    educationLevel: string;
  },
  candidates: Array<{
    _id: string;
    fullName: string;
    parsedData: {
      normalizedSkills: string[];
      yearsOfExperience: number;
      education: { highestDegree: string };
      certifications: string[];
      projects: string[];
      industries: string[];
    };
    systemScore: number;
  }>,
): Promise<ExplanationResult[]> {
  const prompt = `
You are a principal talent acquisition specialist.
Evaluate these candidates for the role below.
Be specific. Reference actual skills from each profile.
Never use generic phrases without evidence from the data.

JOB TITLE: ${job.title}
REQUIRED SKILLS: ${job.requiredSkills.join(", ")}
PREFERRED SKILLS: ${job.preferredSkills.join(", ")}
MIN EXPERIENCE: ${job.minExperienceYears} years
EDUCATION: ${job.educationLevel}

CANDIDATES (already scored by deterministic engine):
${JSON.stringify(
  candidates.map((c) => ({
    id: c._id,
    name: c.fullName,
    skills: c.parsedData.normalizedSkills,
    experience: c.parsedData.yearsOfExperience,
    education: c.parsedData.education.highestDegree,
    certifications: c.parsedData.certifications,
    projects: c.parsedData.projects,
    industries: c.parsedData.industries,
    systemScore: c.systemScore,
  })),
)}

For each candidate return:
- Exactly 3 specific strengths tied to THIS job's requirements
- 1-2 critical gaps
- A 2-3 sentence reasoning paragraph
- One direct recommendation sentence
- A confidence level based on how complete the data is
- A projectRelevanceScore 0-100
- An industryFitScore 0-100

Return ONLY valid JSON array:
[
  {
    "applicantId": string,
    "projectRelevanceScore": number,
    "industryFitScore": number,
    "strengths": string[],
    "gaps": string[],
    "reasoning": string,
    "confidence": "high" | "medium" | "uncertain",
    "recommendation": string
  }
]
`;
  const raw = await callGemini(prompt);
  const fallback: ExplanationResult[] = candidates.map((candidate) => ({
    applicantId: candidate._id,
    projectRelevanceScore: 50,
    industryFitScore: 50,
    strengths: [],
    gaps: [],
    reasoning: "AI analysis unavailable.",
    confidence: "uncertain",
    recommendation: "Manual review required.",
  }));
  return parseJsonSafe(raw, fallback, "generateCandidateExplanations");
}

export async function generateComparisonRecommendation(
  jobTitle: string,
  candidates: Array<{
    totalScore: number;
    yearsOfExperience: number;
    strengths: string[];
    gaps: string[];
    reasoning: string;
  }>,
): Promise<string> {
  const prompt = `
You are a hiring manager making a final recommendation
for the role of ${jobTitle}.

FINALIST CANDIDATES:
${candidates
  .map(
    (c, i) => `
CANDIDATE ${["A", "B", "C"][i]}:
  Score: ${c.totalScore}%
  Experience: ${c.yearsOfExperience} years
  Top Skills: ${c.strengths.join(", ")}
  Critical Gap: ${c.gaps[0]}
  Summary: ${c.reasoning}
`,
  )
  .join("\n")}

Write a 3-4 sentence recommendation.
State which candidate is best for immediate productivity and why.
State which has stronger long-term potential if different.
Name the single most important trade-off.
Use "Candidate A", "Candidate B", "Candidate C" only.
Be direct. Be specific. No filler sentences.
Return only the recommendation text. No JSON.
`;
  return callGemini(prompt);
}

export async function detectBias(
  jobTitle: string,
  shortlistStats: ShortlistStats,
): Promise<{
  biasDetected: boolean;
  biasType: string | null;
  explanation: string | null;
  affectedCandidates: number | null;
  recommendation: string | null;
}> {
  const prompt = `
You are an HR compliance officer reviewing an AI-generated
shortlist for bias patterns.

JOB: ${jobTitle}
SHORTLIST STATISTICS:
- Degree distribution: ${JSON.stringify(shortlistStats.degrees)}
- Institution types: ${JSON.stringify(shortlistStats.institutions)}
- Experience range: ${shortlistStats.expMin}-${shortlistStats.expMax} years
- Industry backgrounds: ${JSON.stringify(shortlistStats.industries)}
- Skills weight used: ${shortlistStats.skillsWeight}%

Identify the most significant bias risk if any exists.
Be honest. If no meaningful bias exists, say so clearly.

Return ONLY valid JSON:
{
  "biasDetected": boolean,
  "biasType": string | null,
  "explanation": string | null,
  "affectedCandidates": number | null,
  "recommendation": string | null
}
`;
  const raw = await callGemini(prompt);
  return parseJsonSafe(
    raw,
    {
      biasDetected: false,
      biasType: null,
      explanation: null,
      affectedCandidates: null,
      recommendation: null,
    },
    "detectBias",
  );
}

export async function generatePoolIntelligence(
  jobTitle: string,
  stats: PoolStats,
): Promise<string> {
  const prompt = `
You are an HR market intelligence analyst.
Give a sharp 2-3 sentence summary to a recruiter.

JOB: ${jobTitle}
TOTAL APPLICANTS: ${stats.totalCount}
AVERAGE SCORE: ${stats.avgScore}%
TOP SCORE: ${stats.topScore}%
SKILL COVERAGE (% of applicants with each required skill):
${JSON.stringify(stats.skillCoverage)}
MOST COMMON GAPS: ${stats.topGaps.join(", ")}

Tell them:
1. Overall pool quality in honest terms
2. The biggest skill gap across all candidates
3. One specific actionable recommendation

Return only the summary text. No JSON. No bullet points.
`;
  return callGemini(prompt);
}
