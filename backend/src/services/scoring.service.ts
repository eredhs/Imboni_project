export type DeterministicScores = {
  skillsMatch: number;
  experienceScore: number;
  educationFit: number;
  certScore: number;
  resumeQuality: number;
};

export function calculateDeterministicScores(
  applicant: {
    parsedData: {
      normalizedSkills: string[];
      yearsOfExperience: number;
      education: { highestDegree?: string | null };
      certifications: string[];
      workHistory: unknown[];
      projects: string[];
      email?: string | null;
      phone?: string | null;
    };
  },
  job: {
    requiredSkills: string[];
    preferredSkills: string[];
    minExperienceYears: number;
    educationLevel: string;
  },
): DeterministicScores {
  const applicantSkills = applicant.parsedData.normalizedSkills.map((skill) => skill.toLowerCase());
  const requiredSkills = job.requiredSkills.map((skill) => skill.toLowerCase());
  const preferredSkills = job.preferredSkills.map((skill) => skill.toLowerCase());

  const requiredMatches = requiredSkills.filter((skill) => applicantSkills.includes(skill)).length;
  const preferredMatches = preferredSkills.filter((skill) => applicantSkills.includes(skill)).length;

  const requiredScore = requiredSkills.length
    ? (requiredMatches / requiredSkills.length) * 70
    : 0;
  const preferredScore = preferredSkills.length
    ? (preferredMatches / preferredSkills.length) * 30
    : 0;

  const skillsMatch = Math.round(requiredScore + preferredScore);
  const experienceScore = Math.min(
    100,
    Math.round((applicant.parsedData.yearsOfExperience / Math.max(1, job.minExperienceYears)) * 100),
  );

  const degree = (applicant.parsedData.education.highestDegree ?? "none").toLowerCase();
  const jobDegree = job.educationLevel.toLowerCase();
  const educationFit = degree === "none" ? 40 : degree.includes(jobDegree) ? 100 : 70;

  const certScore = Math.min(100, applicant.parsedData.certifications.length * 12 + 40);
  const resumeQuality = Math.min(
    100,
    40 +
      applicant.parsedData.projects.length * 8 +
      applicant.parsedData.workHistory.length * 6,
  );

  return {
    skillsMatch,
    experienceScore,
    educationFit,
    certScore,
    resumeQuality,
  };
}

export function calculateConfidenceScore(parsedData: {
  email?: string | null;
  phone?: string | null;
  normalizedSkills: string[];
  workHistory: unknown[];
  education: { highestDegree?: string | null };
  projects: string[];
  certifications: string[];
  yearsOfExperience: number;
}): { score: number; label: "high" | "medium" | "uncertain" } {
  const hasEmail = Boolean(parsedData.email);
  const hasPhone = Boolean(parsedData.phone);
  const skillCount = parsedData.normalizedSkills.length;
  const hasWorkHistory = parsedData.workHistory.length > 0;
  const hasEducation =
    parsedData.education.highestDegree && parsedData.education.highestDegree !== "none";
  const hasProjects = parsedData.projects.length > 0;
  const hasCerts = parsedData.certifications.length > 0;
  const yearsExperience = parsedData.yearsOfExperience;

  const score =
    (hasEmail ? 10 : 0) +
    (hasPhone ? 5 : 0) +
    (skillCount >= 5 ? 20 : skillCount * 4) +
    (hasWorkHistory ? 20 : 0) +
    (hasEducation ? 15 : 0) +
    (hasProjects ? 15 : 0) +
    (hasCerts ? 10 : 0) +
    (yearsExperience > 0 ? 5 : 0);

  const label = score >= 70 ? "high" : score >= 40 ? "medium" : "uncertain";

  return { score, label };
}
