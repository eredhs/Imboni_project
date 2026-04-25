import { ApplicantModel } from "../models/applicant.model.js";
import { CandidateNoteModel } from "../models/candidate-note.model.js";
import { ScreeningResultModel } from "../models/screening.model.js";
import { talentProfileSchema } from "../schemas/talent-profile.schema.js";
import type { ParsedCandidateData } from "./gemini.service.js";
import type {
  JobRecord,
  ApplicantRecord,
  ShortlistCandidateRecord,
  UserRecord,
} from "../data/seed.js";

type CandidateNote = {
  id: string;
  recruiterName: string;
  text: string;
  createdAt: string;
};

export async function getApplicantsByJob(jobId: string) {
  return ApplicantModel.find({ jobId }).lean<ApplicantRecord[]>();
}

export async function getApplicantById(applicantId: string) {
  return ApplicantModel.findOne({ id: applicantId }).lean<ApplicantRecord | null>();
}

export async function deleteApplicantById(applicantId: string) {
  await ApplicantModel.deleteOne({ id: applicantId });
}

export async function createApplicantFromParsedData(jobId: string, parsed: Record<string, unknown>) {
  const talentProfile = talentProfileSchema.safeParse(parsed).success
    ? talentProfileSchema.parse(parsed)
    : mapResumeExtractionToTalentProfile(parsed as ParsedCandidateData);
  const now = Date.now();
  const skillNames = Array.isArray(talentProfile.skills)
    ? talentProfile.skills
        .map((skill) => {
          if (typeof skill === "string") return skill;
          if (typeof skill === "object" && skill && "name" in skill && typeof skill.name === "string") {
            return skill.name;
          }
          return null;
        })
        .filter((skill): skill is string => Boolean(skill))
    : [];

  const firstName = talentProfile.firstName;
  const lastName = talentProfile.lastName;
  const experience = talentProfile.experience;
  const yearsExperience = experience.length;

  const applicant: ApplicantRecord = {
    id: `app-${now}`,
    jobId,
    fullName: `${firstName} ${lastName}`.trim(),
    location: talentProfile.location,
    currentRole: talentProfile.headline,
    yearsExperience,
    score: 70,
    status: "Pending",
    confidence: "medium",
    skills: skillNames,
    email: talentProfile.email,
    talentProfile,
  };

  await ApplicantModel.create(applicant);

  return applicant;
}

export async function ensureApplicantForApplication(params: {
  applicationId: string;
  job: Pick<JobRecord, "id" | "title" | "requiredSkills" | "preferredSkills" | "location" | "minExperienceYears">;
  user: Pick<UserRecord, "id" | "name" | "email" | "location" | "organization">;
  coverLetter?: string;
  resumeUrl?: string;
  candidateProfile?: ApplicantRecord["candidateProfile"];
  resume?: ApplicantRecord["resume"];
}) {
  const existing = await findApplicantForApplication(params.applicationId, params.job.id, params.user.id);
  const applicant = buildApplicantFromApplication(params, existing?.id);

  await ApplicantModel.findOneAndUpdate(
    {
      $or: [
        { applicationId: params.applicationId },
        { jobId: params.job.id, userId: params.user.id },
      ],
    },
    { $set: applicant },
    { upsert: true, new: true },
  );
  return applicant;
}

function mapResumeExtractionToTalentProfile(parsed: ParsedCandidateData) {
  const fullName = (parsed.fullName || "Unknown Candidate").trim();
  const [firstName = "Unknown", ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ") || "Candidate";
  const currentYear = new Date().getFullYear();

  const skills = (parsed.skills || []).length > 0
    ? parsed.skills.map((skill) => ({
        name: skill,
        level: getSkillLevel(parsed.yearsOfExperience),
        yearsOfExperience: Math.max(0, parsed.yearsOfExperience),
      }))
    : [
        {
          name: "General Experience",
          level: getSkillLevel(parsed.yearsOfExperience),
          yearsOfExperience: Math.max(0, parsed.yearsOfExperience),
        },
      ];

  const experience = (parsed.workHistory || []).length > 0
    ? parsed.workHistory.map((item, index) => ({
        company: item.company || `Company ${index + 1}`,
        role: item.role || parsed.currentRole || "Professional",
        startDate: `${Math.max(2000, currentYear - Math.max(1, item.years || 1))}-01`,
        endDate: item.current ? "Present" : `${Math.max(2000, currentYear - 1)}-12`,
        description: item.description || "Imported from uploaded resume.",
        technologies: parsed.skills?.length ? parsed.skills : ["General Experience"],
        isCurrent: Boolean(item.current),
      }))
    : [
        {
          company: "Imported Resume",
          role: parsed.currentRole || "Professional",
          startDate: `${Math.max(2000, currentYear - Math.max(1, parsed.yearsOfExperience || 1))}-01`,
          endDate: "Present",
          description: "Imported from uploaded resume.",
          technologies: parsed.skills?.length ? parsed.skills : ["General Experience"],
          isCurrent: true,
        },
      ];

  const education = [
    {
      institution: parsed.education?.institution || "Not specified",
      degree: parsed.education?.highestDegree
        ? parsed.education.highestDegree.toUpperCase()
        : "Not specified",
      fieldOfStudy: parsed.education?.fieldOfStudy || "General Studies",
      startYear:
        parsed.education?.graduationYear && parsed.education.graduationYear > 3
          ? parsed.education.graduationYear - 3
          : Math.max(2000, currentYear - 4),
      endYear:
        parsed.education?.graduationYear && parsed.education.graduationYear > 0
          ? parsed.education.graduationYear
          : currentYear,
    },
  ];

  const projects = (parsed.projects || []).length > 0
    ? parsed.projects.map((project, index) => ({
        name: truncate(project, 48) || `Project ${index + 1}`,
        description: project,
        technologies: parsed.skills?.length ? parsed.skills.slice(0, 5) : ["General Experience"],
        role: parsed.currentRole || "Contributor",
        link: "https://example.com",
        startDate: `${Math.max(2000, currentYear - 1)}-01`,
        endDate: `${currentYear}-01`,
      }))
    : [
        {
          name: "Imported Resume Project",
          description: "Project details were not explicitly provided in the uploaded resume.",
          technologies: parsed.skills?.length ? parsed.skills.slice(0, 5) : ["General Experience"],
          role: parsed.currentRole || "Contributor",
          link: "https://example.com",
          startDate: `${Math.max(2000, currentYear - 1)}-01`,
          endDate: `${currentYear}-01`,
        },
      ];

  return talentProfileSchema.parse({
    firstName,
    lastName,
    email: parsed.email || `imported-${Date.now()}@example.com`,
    headline: parsed.currentRole || "Imported Candidate",
    bio: parsed.workHistory?.[0]?.description || "Imported from uploaded resume.",
    location: parsed.location || "Not specified",
    skills,
    languages: (parsed.languages || []).map((language) => ({
      name: language,
      proficiency: "Conversational",
    })),
    experience,
    education,
    certifications: (parsed.certifications || []).map((certification) => ({
      name: certification,
      issuer: "Imported Resume",
      issueDate: `${currentYear}-01`,
    })),
    projects,
    availability: {
      status: "Open to Opportunities",
      type: "Full-time",
    },
    socialLinks: {},
  });
}

async function findApplicantForApplication(applicationId: string, jobId: string, userId: string) {
  return ApplicantModel.findOne({
    $or: [{ applicationId }, { jobId, userId }],
  }).lean<ApplicantRecord | null>();
}

function buildApplicantFromApplication(
  params: {
    applicationId: string;
    job: Pick<JobRecord, "id" | "title" | "requiredSkills" | "preferredSkills" | "location" | "minExperienceYears">;
    user: Pick<UserRecord, "id" | "name" | "email" | "location" | "organization">;
    coverLetter?: string;
    resumeUrl?: string;
    candidateProfile?: ApplicantRecord["candidateProfile"];
    resume?: ApplicantRecord["resume"];
  },
  existingId?: string,
): ApplicantRecord {
  const fullName = params.candidateProfile?.fullName?.trim() || params.user.name.trim() || "Unknown Candidate";
  const [firstName = "Unknown", ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ") || "Candidate";
  const currentYear = new Date().getFullYear();
  const yearsExperience = Math.max(0, params.candidateProfile?.yearsOfExperience ?? params.job.minExperienceYears ?? 0);
  const declaredJobSkills = Array.from(
    new Set(
      [...params.job.requiredSkills, ...params.job.preferredSkills]
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8);
  const skills = extractSkillsFromApplication(params, declaredJobSkills);
  const location = params.candidateProfile?.location?.trim() || params.user.location?.trim() || params.job.location || "Not specified";
  const bio =
    params.candidateProfile?.professionalSummary?.trim() ||
    params.coverLetter?.trim() ||
    `Applied for ${params.job.title}.`;
  const technologies =
    skills.length > 0
      ? skills
      : declaredJobSkills.length > 0
        ? declaredJobSkills
        : ["General Experience"];
  const headline =
    params.candidateProfile?.currentRole?.trim() ||
    (yearsExperience > 0 ? `${params.job.title} Candidate` : "Applicant awaiting resume enrichment");
  const inferredRole = params.candidateProfile?.currentRole?.trim() || (skills[0] ? `${skills[0]} Professional` : params.job.title);
  const resumeLink = params.resume?.url || params.resumeUrl;
  const profile = talentProfileSchema.parse({
    firstName,
    lastName,
    email: params.candidateProfile?.email?.trim() || params.user.email,
    headline,
    bio,
    location,
    skills: technologies.map((skill) => ({
      name: skill,
      level: getSkillLevel(yearsExperience),
      yearsOfExperience: yearsExperience,
    })),
    languages: [],
    experience: [
      {
        company: params.user.organization || "Individual",
        role: inferredRole,
        startDate: `${Math.max(2000, currentYear - Math.max(1, yearsExperience || 1))}-01`,
        endDate: "Present",
        description: bio,
        technologies,
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: params.user.organization || "Not specified",
        degree: "Not specified",
        fieldOfStudy: "General Studies",
        startYear: Math.max(2000, currentYear - 4),
        endYear: currentYear,
      },
    ],
    certifications: resumeLink
      ? [
          {
            name: "Resume submitted",
            issuer: "Candidate Upload",
            issueDate: `${currentYear}-01`,
          },
        ]
      : [],
    projects: [
      {
        name: `${params.job.title} Application`,
        description: bio,
        technologies,
        role: "Applicant",
        link: resumeLink && /^https?:\/\/.+/.test(resumeLink) ? resumeLink : "",
        startDate: `${currentYear}-01`,
        endDate: `${currentYear}-12`,
      },
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Full-time",
    },
    socialLinks: {
      ...(params.candidateProfile?.linkedinUrl && /^https?:\/\/.+/.test(params.candidateProfile.linkedinUrl) ? { linkedin: params.candidateProfile.linkedinUrl } : {}),
      ...(params.candidateProfile?.portfolioUrl && /^https?:\/\/.+/.test(params.candidateProfile.portfolioUrl) ? { portfolio: params.candidateProfile.portfolioUrl } : {}),
      ...(!params.candidateProfile?.portfolioUrl && resumeLink && /^https?:\/\/.+/.test(resumeLink) ? { portfolio: resumeLink } : {}),
    },
  });

  return {
    id: existingId || `app-${params.applicationId}`,
    jobId: params.job.id,
    userId: params.user.id,
    applicationId: params.applicationId,
    fullName,
    location,
    currentRole: headline,
    yearsExperience,
    score: 65,
    status: "Pending",
    confidence: params.coverLetter?.trim() ? "medium" : "uncertain",
    skills: technologies,
    email: params.candidateProfile?.email?.trim() || params.user.email,
    talentProfile: profile,
    candidateProfile: params.candidateProfile,
    resume: params.resume,
  };
}

function extractSkillsFromApplication(
  params: {
    coverLetter?: string;
    candidateProfile?: ApplicantRecord["candidateProfile"];
    resume?: ApplicantRecord["resume"];
  },
  declaredJobSkills: string[],
) {
  if (declaredJobSkills.length === 0) {
    return [];
  }

  const textSources = [
    params.candidateProfile?.currentRole,
    params.candidateProfile?.professionalSummary,
    params.coverLetter,
    params.resume?.extractedText,
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.toLowerCase());

  if (textSources.length === 0) {
    return [];
  }

  return declaredJobSkills.filter((skill) =>
    textSources.some((text) => text.includes(skill.toLowerCase())),
  );
}

function getSkillLevel(yearsOfExperience: number) {
  if (yearsOfExperience >= 7) return "Expert";
  if (yearsOfExperience >= 4) return "Advanced";
  if (yearsOfExperience >= 2) return "Intermediate";
  return "Beginner";
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

export async function getScreeningResultsByJob(jobId: string) {
  return ScreeningResultModel.find({ jobId })
    .sort({ score: -1, createdAt: -1 })
    .lean<Array<ShortlistCandidateRecord & { action?: string }>>();
}

export async function getCandidateDetailById(candidateId: string) {
  const candidate = await ScreeningResultModel.findOne({ id: candidateId }).lean<
    (ShortlistCandidateRecord & { action?: string }) | null
  >();
  if (candidate) {
    return candidate;
  }

  const applicant = await ApplicantModel.findOne({ id: candidateId }).lean<ApplicantRecord | null>();
  if (!applicant) {
    return null;
  }

  return applicantToCandidateDetail(applicant);
}

export async function getCandidateNotes(candidateId: string): Promise<CandidateNote[]> {
  return CandidateNoteModel.find({ candidateId })
    .sort({ createdAt: -1 })
    .lean<CandidateNote[]>();
}

export async function addCandidateNote(candidateId: string, recruiterName: string, text: string) {
  const note = {
    id: `note-${Date.now()}`,
    candidateId,
    recruiterName,
    text,
    createdAt: new Date().toISOString(),
  };

  await CandidateNoteModel.create(note);
  return note;
}

export async function updateCandidateActionById(candidateId: string, action: "approved" | "rejected" | "flagged") {
  await ScreeningResultModel.updateOne(
    { id: candidateId },
    { $set: { action, updatedAt: new Date().toISOString() } },
  );
}

function applicantToCandidateDetail(applicant: ApplicantRecord): ShortlistCandidateRecord {
  return {
    ...applicant,
    gap: "No critical gaps noted",
    quote: applicant.talentProfile.headline ?? "Imported applicant profile.",
    overview: applicant.talentProfile.bio ?? "Imported applicant profile.",
    notes: [],
    reasoning: applicant.talentProfile.bio ?? "Imported applicant profile.",
    recommendation: "Manual review recommended.",
    verifiedExpertise: applicant.score >= 85,
    topCandidateLabel: applicant.score >= 85 ? "High Match Candidate" : "Growth Potential",
    scoreBreakdown: [
      { label: "Skills Match", value: applicant.score },
      { label: "Experience", value: Math.min(100, applicant.yearsExperience * 12) },
      { label: "Profile Completeness", value: applicant.talentProfile.projects?.length ? 85 : 60 },
    ],
  };
}
