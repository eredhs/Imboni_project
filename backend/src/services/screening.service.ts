import { talentProfilesByApplicantId } from "../data/talent-profiles.js";
import { ApplicantModel } from "../models/applicant.model.js";
import { JobModel } from "../models/job.model.js";
import { ScreeningResultModel, ScreeningRunModel } from "../models/screening.model.js";
import { applicationService } from "./application.service.js";
import { ensureApplicantForApplication } from "./talent.service.js";
import { getUserById } from "./auth.service.js";
import {
  detectBias,
  generateCandidateExplanations,
  generatePoolIntelligence,
  safeGeminiCall,
} from "./gemini.service.js";
import { normalizeSkills } from "./normalization.service.js";
import {
  calculateConfidenceScore,
  calculateDeterministicScores,
} from "./scoring.service.js";

type ScreeningStage =
  | "idle"
  | "parsing"
  | "extracting"
  | "scoring"
  | "explaining"
  | "bias_check"
  | "finalizing"
  | "complete"
  | "failed";

type ScreeningRun = {
  runId: string;
  jobId: string;
  status: ScreeningStage;
  progress: { done: number; total: number };
  message: string;
  startedAt: number;
  completedAt?: number;
  timeTakenSeconds?: number;
  biasResult?: {
    biasDetected: boolean;
    biasType: string | null;
    explanation: string | null;
    affectedCandidates: number | null;
    recommendation: string | null;
  };
  poolIntelligence?: string;
};

type ScoredCandidate = {
  _id: string;
  userId?: string;
  applicationId?: string;
  fullName: string;
  yearsExperience: number;
  location: string;
  currentRole: string;
  parsedData: {
    normalizedSkills: string[];
    yearsOfExperience: number;
    education: { highestDegree: string; institution: string };
    certifications: string[];
    projects: string[];
    workHistory: unknown[];
    industries: string[];
    email?: string | null;
    phone?: string | null;
  };
  systemScore: number;
  deterministic: ReturnType<typeof calculateDeterministicScores>;
  confidence: ReturnType<typeof calculateConfidenceScore>;
  projectRelevanceScore?: number;
  industryFitScore?: number;
  finalScore?: number;
  reasoning?: string;
  gaps?: string[];
  strengths?: string[];
  recommendation?: string;
};

const runStates = new Map<string, ScreeningRun>();
const screeningResultsByJob = new Map<string, any>();

const stageMessages: Record<ScreeningStage, string> = {
  idle: "No active screening job.",
  parsing: "Loading applicants...",
  extracting: "Extracting candidate information...",
  scoring: "Scoring candidates...",
  explaining: "Generating explanations...",
  bias_check: "Running bias detection...",
  finalizing: "Finalizing shortlist...",
  complete: "Complete! Redirecting...",
  failed: "Screening failed.",
};

export async function triggerScreening(params: {
  jobId: string;
  weights: { skills: number; experience: number; communication: number; culture: number };
  biasDetection: boolean;
  shortlistSize: 10 | 20;
}) {
  const runId = `run-${params.jobId}-${Date.now()}`;
  const run: ScreeningRun = {
    runId,
    jobId: params.jobId,
    status: "parsing",
    progress: { done: 0.01, total: 1 },
    message: stageMessages.parsing,
    startedAt: Date.now(),
  };
  runStates.set(runId, run);
  
  try {
    // CRITICAL FIX: Ensure run is created in MongoDB BEFORE starting the process
    await ScreeningRunModel.create(run);
    console.log(`[SCREENING ${runId}] ✓ Created screening run in MongoDB`);
    
    // Update job status to indicate screening is in progress
    await JobModel.updateOne(
      { id: params.jobId },
      { $set: { screeningStatus: "In Progress" } }
    );
    console.log(`[SCREENING ${runId}] ✓ Updated job status to "In Progress"`);
  } catch (error) {
    console.error(`[SCREENING ${runId}] ✗ Failed to initialize run in MongoDB:`, error instanceof Error ? error.message : error);
    runStates.delete(runId);
    throw new Error(`Failed to initialize screening run: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  // Start the background screening process (fire-and-forget is OK now that MongoDB is initialized)
  void processScreening(runId, params).catch(async (error) => {
    console.error(`[SCREENING ${runId}] FATAL ERROR:`, error);
    await updateRun(runId, { status: "failed", message: `Critical error: ${error instanceof Error ? error.message : String(error)}` });
  });

  return {
    runId,
    jobId: params.jobId,
    status: "running",
  };
}

export async function getScreeningStatus(runId: string) {
  const run = await ScreeningRunModel.findOne({ runId }).lean<ScreeningRun | null>();

  if (!run) {
    return {
      status: "idle",
      progress: 0,
      message: stageMessages.idle,
    };
  }

  const progress =
    run.progress.total > 0 ? Math.round((run.progress.done / run.progress.total) * 100) : 0;

  return {
    runId: run.runId,
    jobId: run.jobId,
    status: run.status === "complete" ? "complete" : run.status === "failed" ? "failed" : "running",
    progress,
    message: run.message,
    redirectTo: run.status === "complete" ? `/screening/results?jobId=${run.jobId}` : null,
  };
}

export async function getScreeningResults(jobId: string) {
  const [job, latestRun, items] = await Promise.all([
    JobModel.findOne({ id: jobId }).lean(),
    ScreeningRunModel.findOne({ jobId }).sort({ startedAt: -1 }).lean<ScreeningRun | null>(),
    ScreeningResultModel.find({ jobId }).sort({ score: -1 }).lean<any[]>(),
  ]);

  if (!items.length) {
    return null;
  }

  return {
    job,
    analyzed: items.length,
    durationSeconds: latestRun?.timeTakenSeconds ?? 43,
    biasAlert: latestRun?.biasResult?.biasDetected
      ? {
          detected: true,
          message: latestRun.biasResult.explanation ?? "Potential bias pattern detected.",
        }
      : { detected: false, message: "No meaningful bias detected." },
    items,
    poolIntelligence: latestRun?.poolIntelligence ?? null,
  };
}

async function updateRun(runId: string, patch: Partial<ScreeningRun>) {
  const run = runStates.get(runId);
  if (!run) {
    console.warn(`[SCREENING ${runId}] Attempted to update non-existent run in memory`);
    return;
  }
  
  const updated = { ...run, ...patch };
  runStates.set(runId, updated);
  
  try {
    // CRITICAL FIX: Await MongoDB update to ensure persistence
    const result = await ScreeningRunModel.updateOne(
      { runId },
      { $set: updated },
      { upsert: true }
    );
    console.log(`[SCREENING ${runId}] ✓ Updated run in MongoDB: ${JSON.stringify(patch)}`);
  } catch (error) {
    console.error(`[SCREENING ${runId}] ✗ Failed to update run in MongoDB:`, error instanceof Error ? error.message : error);
  }
}

async function processScreening(
  runId: string,
  params: {
    jobId: string;
    weights: { skills: number; experience: number; communication: number; culture: number };
    biasDetection: boolean;
    shortlistSize: 10 | 20;
  },
) {
  console.log(`[SCREENING ${runId}] Starting process for job: ${params.jobId}`);
  
  const job = await JobModel.findOne({ id: params.jobId }).lean();
  if (!job) {
    console.error(`[SCREENING ${runId}] Job not found: ${params.jobId}`);
    await updateRun(runId, { status: "failed", message: "Job not found" });
    return;
  }

  try {
    console.log(`[SCREENING ${runId}] Found job: ${job.title}`);
    
    // Ensure applicants are created from applications if they don't exist yet
    console.log(`[SCREENING ${runId}] Syncing applicants from applications...`);
    try {
      const applications = await applicationService.getApplicationsByJobId(params.jobId);
      
      for (const app of applications) {
        try {
          const user = await getUserById(app.userId);
          if (user) {
            await ensureApplicantForApplication({
              applicationId: app.id,
              job: {
                id: params.jobId,
                title: (job as any).title ?? "Job Application",
                requiredSkills: Array.isArray((job as any).requiredSkills) ? (job as any).requiredSkills : [],
                preferredSkills: Array.isArray((job as any).preferredSkills) ? (job as any).preferredSkills : [],
                location: (job as any).location ?? "Not specified",
                minExperienceYears: Number((job as any).minExperienceYears ?? 0),
              },
              user,
              coverLetter: app.coverLetter,
              resumeUrl: app.resumeUrl,
              candidateProfile: app.candidateProfile,
              resume: app.resume,
            });
          }
        } catch (syncError) {
          console.warn(
            `[SCREENING ${runId}] Could not sync applicant for application ${app.id}:`,
            syncError instanceof Error ? syncError.message : syncError
          );
        }
      }
    } catch (syncError) {
      console.warn(`[SCREENING ${runId}] Applicant sync failed (non-critical):`, syncError instanceof Error ? syncError.message : syncError);
    }
    
    const jobApplicants = await ApplicantModel.find({ jobId: params.jobId }).lean<any[]>();
    console.log(`[SCREENING ${runId}] Found ${jobApplicants.length} applicants`);
    
    if (jobApplicants.length === 0) {
      console.warn(`[SCREENING ${runId}] No applicants found for job`);
    }
    
    const totalApplicants = jobApplicants.length || 1;
    console.log(`[SCREENING ${runId}] Starting enrichment of ${totalApplicants} applicants...`);
    await updateRun(runId, {
      status: "extracting",
      message: stageMessages.extracting,
      progress: { done: 0.05, total: 1 },
    });

    const enrichedCandidates: ScoredCandidate[] = jobApplicants.map((applicant) => {
      const profile = applicant.talentProfile ?? talentProfilesByApplicantId[applicant.id];
      const skills =
        profile?.skills?.map((skill: { name: string }) => skill.name) ?? applicant.skills ?? [];
      const normalizedSkills = normalizeSkills(skills);
      const educationEntry = profile?.education?.[0];
      const highestDegree = normalizeDegree(educationEntry?.degree);
      const parsedData = {
        normalizedSkills,
        yearsOfExperience: applicant.yearsExperience,
        education: {
          highestDegree,
          institution: educationEntry?.institution ?? "Unknown",
        },
        certifications:
          profile?.certifications?.map((cert: { name: string }) => cert.name) ?? [],
        projects:
          profile?.projects?.map((project: { name: string }) => project.name) ?? [],
        workHistory: profile?.experience ?? [],
        industries: [],
        email: profile?.email ?? applicant.email ?? null,
        phone: null,
      };

      const deterministic = calculateDeterministicScores(
        {
          parsedData,
        },
        {
          requiredSkills: job.requiredSkills,
          preferredSkills: job.preferredSkills,
          minExperienceYears: job.minExperienceYears,
          educationLevel: job.educationLevel,
        },
      );
      const confidence = calculateConfidenceScore(parsedData);

      return {
        _id: applicant.id,
        userId: applicant.userId,
        applicationId: applicant.applicationId,
        fullName: applicant.fullName,
        yearsExperience: applicant.yearsExperience,
        location: applicant.location,
        currentRole: applicant.currentRole,
        parsedData,
        systemScore: applicant.score,
        deterministic,
        confidence,
      };
    });

    await updateRun(runId, { status: "scoring", message: stageMessages.scoring, progress: { done: 25, total: 100 } });

    await updateRun(runId, { status: "explaining", message: stageMessages.explaining, progress: { done: 35, total: 100 } });

    const batches = chunk(enrichedCandidates, 8);
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const explanations = await safeGeminiCall(
        () =>
          generateCandidateExplanations(
            {
              title: job.title,
              requiredSkills: job.requiredSkills,
              preferredSkills: job.preferredSkills,
              minExperienceYears: job.minExperienceYears,
              educationLevel: job.educationLevel,
            },
            batch.map((candidate) => ({
              _id: candidate._id,
              fullName: candidate.fullName,
              parsedData: candidate.parsedData,
              systemScore: candidate.systemScore,
            })),
          ),
        batch.map((candidate) => ({
          applicantId: candidate._id,
          projectRelevanceScore: 50,
          industryFitScore: 50,
          strengths: [],
          gaps: [],
          reasoning: "AI analysis unavailable.",
          confidence: "uncertain" as const,
          recommendation: "Manual review required.",
        })),
        "generateCandidateExplanations",
      );

      explanations.forEach((explanation) => {
        const candidate = enrichedCandidates.find((item) => item._id === explanation.applicantId);
        if (!candidate) return;
        candidate.projectRelevanceScore = explanation.projectRelevanceScore ?? 50;
        candidate.industryFitScore = explanation.industryFitScore ?? 50;
        candidate.strengths = explanation.strengths ?? [];
        candidate.gaps = explanation.gaps ?? [];
        candidate.reasoning = explanation.reasoning ?? "AI analysis unavailable.";
        candidate.recommendation = explanation.recommendation ?? "Manual review required.";
      });

      // Update progress based on batches completed
      const progressPercent = Math.round(35 + (batchIndex + 1) / batches.length * 20);
      await updateRun(runId, { progress: { done: progressPercent, total: 100 } });
    }

    const weightedCandidates = enrichedCandidates.map((candidate) => {
      const projectScore = candidate.projectRelevanceScore ?? 50;
      const industryScore = candidate.industryFitScore ?? 50;
      const { skillsMatch, experienceScore, educationFit, certScore, resumeQuality } =
        candidate.deterministic;

      const finalScore =
        skillsMatch * (params.weights.skills / 100) +
        experienceScore * (params.weights.experience / 100) +
        educationFit * 0.1 +
        projectScore * 0.1 +
        certScore * 0.05 +
        industryScore * 0.05 +
        resumeQuality * 0.05;

      return { ...candidate, finalScore: Math.round(finalScore) };
    });

    await updateRun(runId, { status: "bias_check", message: stageMessages.bias_check, progress: { done: 60, total: 100 } });

    const sorted = [...weightedCandidates].sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
    const topCandidates = sorted.slice(0, params.shortlistSize);
    const shortlistStats = buildShortlistStats(topCandidates, params.weights.skills);

    const biasResult = params.biasDetection
      ? await safeGeminiCall(
          () => detectBias(job.title, shortlistStats),
          {
            biasDetected: false,
            biasType: null,
            explanation: null,
            affectedCandidates: null,
            recommendation: null,
          },
          "detectBias",
        )
      : {
          biasDetected: false,
          biasType: null,
          explanation: null,
          affectedCandidates: null,
          recommendation: null,
        };

    await updateRun(runId, { biasResult, progress: { done: 75, total: 100 } });

    await updateRun(runId, { status: "finalizing", message: stageMessages.finalizing, progress: { done: 85, total: 100 } });

    const poolStats = buildPoolStats(weightedCandidates, job.requiredSkills);
    const poolIntelligence = await safeGeminiCall(
      () => generatePoolIntelligence(job.title, poolStats),
      "AI market summary unavailable.",
      "generatePoolIntelligence",
    );
    const screeningDate = new Date().toISOString();

    const results = topCandidates.map((candidate, index) => ({
      id: candidate._id,
      jobId: params.jobId,
      fullName: candidate.fullName,
      location: candidate.location,
      currentRole: candidate.currentRole,
      yearsExperience: candidate.yearsExperience,
      score: candidate.finalScore ?? candidate.systemScore,
      status: "Shortlisted",
      confidence: candidate.confidence.label,
      confidenceScore: candidate.confidence.score,
      skills: candidate.parsedData.normalizedSkills,
      gap: candidate.gaps?.[0] ?? "No critical gaps noted",
      quote: candidate.reasoning ?? "AI analysis unavailable.",
      overview: candidate.reasoning ?? "AI analysis unavailable.",
      notes: [],
      reasoning: candidate.reasoning ?? "AI analysis unavailable.",
      recommendation: candidate.recommendation ?? "Manual review required.",
      verifiedExpertise: (candidate.finalScore ?? 0) >= 85,
      topCandidateLabel: `Top ${Math.max(1, Math.round(((index + 1) / topCandidates.length) * 100))}% Candidate`,
      scoreBreakdown: [
        { label: "Skills Match", value: candidate.deterministic.skillsMatch },
        { label: "Experience", value: candidate.deterministic.experienceScore },
        { label: "Education Fit", value: candidate.deterministic.educationFit },
        { label: "Project Relevance", value: candidate.projectRelevanceScore ?? 50 },
        { label: "Industry Fit", value: candidate.industryFitScore ?? 50 },
      ],
      talentProfile:
        jobApplicants.find((applicant) => applicant.id === candidate._id)?.talentProfile ??
        talentProfilesByApplicantId[candidate._id],
      action: "pending",
      updatedAt: screeningDate,
    }));

    await applicationService.syncScreeningScores(
      weightedCandidates.map((candidate) => ({
        applicationId: candidate.applicationId,
        userId: candidate.userId,
        jobId: params.jobId,
        score: candidate.finalScore ?? candidate.systemScore,
        screeningDate,
        shortlisted: topCandidates.some((topCandidate) => topCandidate._id === candidate._id),
        jobTitle: job.title,
      })),
    );

    const resultPayload = {
      job,
      analyzed: jobApplicants.length,
      durationSeconds: Math.round((Date.now() - (runStates.get(runId)?.startedAt ?? Date.now())) / 1000),
      biasAlert: biasResult.biasDetected
        ? {
            detected: true,
            message: biasResult.explanation ?? "Potential bias pattern detected.",
          }
        : { detected: false, message: "No meaningful bias detected." },
      items: results,
      poolIntelligence,
    };

    await ScreeningResultModel.deleteMany({ jobId: params.jobId });
    if (results.length > 0) {
      await ScreeningResultModel.insertMany(results);
    }
    await JobModel.updateOne(
      { id: params.jobId },
      {
        $set: {
          screeningStatus: "Completed",
          topScore: results[0]?.score ?? 0,
        },
      },
    );

    await updateRun(runId, {
      status: "complete",
      message: stageMessages.complete,
      completedAt: Date.now(),
      timeTakenSeconds: Math.round(
        (Date.now() - (runStates.get(runId)?.startedAt ?? Date.now())) / 1000,
      ),
      poolIntelligence,
      progress: { done: 100, total: 100 },
    });
  } catch (error: any) {
    console.error("[SCREENING PIPELINE FAILED]", error?.message ?? error);
    await JobModel.updateOne({ id: params.jobId }, { $set: { screeningStatus: "Pending" } });
    await updateRun(runId, { status: "failed", message: stageMessages.failed });
  }
}

function normalizeDegree(degree?: string) {
  const value = degree?.toLowerCase() ?? "none";
  if (value.includes("phd") || value.includes("doctor")) return "phd";
  if (value.includes("master")) return "masters";
  if (value.includes("bachelor")) return "bachelor";
  if (value.includes("diploma")) return "diploma";
  return "none";
}

function buildShortlistStats(candidates: ScoredCandidate[], skillsWeight: number) {
  const degrees: Record<string, number> = {};
  const institutions: Record<string, number> = {};
  const industries: Record<string, number> = {};
  let expMin = Number.POSITIVE_INFINITY;
  let expMax = 0;

  candidates.forEach((candidate) => {
    const degree = candidate.parsedData.education.highestDegree || "none";
    degrees[degree] = (degrees[degree] ?? 0) + 1;
    const institution = candidate.parsedData.education.institution || "Unknown";
    institutions[institution] = (institutions[institution] ?? 0) + 1;
    const industry = candidate.parsedData.industries?.[0] ?? "Unknown";
    industries[industry] = (industries[industry] ?? 0) + 1;
    expMin = Math.min(expMin, candidate.parsedData.yearsOfExperience);
    expMax = Math.max(expMax, candidate.parsedData.yearsOfExperience);
  });

  return {
    degrees,
    institutions,
    expMin: Number.isFinite(expMin) ? expMin : 0,
    expMax,
    industries,
    skillsWeight,
  };
}

function buildPoolStats(candidates: ScoredCandidate[], requiredSkills: string[]) {
  const totalCount = candidates.length;
  const totalScore = candidates.reduce((sum, candidate) => sum + (candidate.finalScore ?? 0), 0);
  const avgScore = totalCount ? Math.round(totalScore / totalCount) : 0;
  const topScore = candidates.reduce((max, candidate) => Math.max(max, candidate.finalScore ?? 0), 0);

  const coverage: Record<string, number> = {};
  requiredSkills.forEach((skill) => {
    const count = candidates.filter((candidate) =>
      candidate.parsedData.normalizedSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase()),
    ).length;
    coverage[skill] = totalCount ? Math.round((count / totalCount) * 100) : 0;
  });

  const gapCounts: Record<string, number> = {};
  candidates.forEach((candidate) => {
    (candidate.gaps ?? []).forEach((gap) => {
      gapCounts[gap] = (gapCounts[gap] ?? 0) + 1;
    });
  });

  const topGaps = Object.entries(gapCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([gap]) => gap);

  return {
    totalCount,
    avgScore,
    topScore,
    skillCoverage: coverage,
    topGaps: topGaps.length > 0 ? topGaps : ["No dominant gaps detected"],
  };
}

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}
