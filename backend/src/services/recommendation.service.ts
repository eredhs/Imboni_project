export function scoreJobForSeeker(
  seekerSkills: string[],
  job: { requiredSkills: string[]; preferredSkills: string[] },
): number {
  const normalizedSeekerSkills = new Set(seekerSkills.map((skill) => skill.toLowerCase()));
  const required = job.requiredSkills.map((skill) => skill.toLowerCase());
  const preferred = job.preferredSkills.map((skill) => skill.toLowerCase());

  const requiredMatches = required.filter((skill) => normalizedSeekerSkills.has(skill)).length;
  const preferredMatches = preferred.filter((skill) => normalizedSeekerSkills.has(skill)).length;

  const requiredScore = required.length > 0 ? (requiredMatches / required.length) * 70 : 0;
  const preferredScore = preferred.length > 0 ? (preferredMatches / preferred.length) * 30 : 0;

  return Math.round(requiredScore + preferredScore);
}

export function rankJobsForSeeker<T extends { requiredSkills: string[]; preferredSkills: string[] }>(
  jobs: T[],
  seekerProfile: { skills: string[] },
): Array<T & { matchScore: number }> {
  return jobs
    .map((job) => ({
      ...job,
      matchScore: scoreJobForSeeker(seekerProfile.skills, job),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
