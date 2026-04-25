import type { Request, Response } from "express";
import { jobs, shortlistCandidates } from "../data/seed.js";
import {
  getScreeningResults,
  getScreeningStatus,
  triggerScreening,
} from "../services/screening.service.js";
import { getScreeningResultsByJob } from "../services/talent.service.js";
import {
  generateComparisonRecommendation,
  safeGeminiCall,
} from "../services/gemini.service.js";

export async function startScreening(request: Request, response: Response) {
  try {
    const jobId = String(request.params.id ?? "");
    const payload = request.body ?? {};
    
    if (!jobId) {
      return response.status(400).json({ error: "Job ID is required" });
    }

    console.log("[SCREENING] Starting screening for job:", jobId);
    console.log("[SCREENING] Weights:", payload.weights);
    console.log("[SCREENING] Bias Detection:", payload.biasDetection);

    // CRITICAL FIX: Await the triggerScreening call to ensure MongoDB is initialized
    const result = await triggerScreening({
      jobId,
      weights: payload.weights ?? {
        skills: 40,
        experience: 25,
        communication: 20,
        culture: 15,
      },
      biasDetection: Boolean(payload.biasDetection ?? true),
      shortlistSize: payload.shortlistSize === 20 ? 20 : 10,
    });
    
    console.log("[SCREENING] Screening triggered successfully:", result.runId);
    response.status(202).json(result);
  } catch (error: any) {
    console.error("[SCREENING] Error starting screening:", error?.message ?? error);
    response.status(500).json({ 
      error: "Failed to start screening",
      details: error?.message ?? "Unknown error"
    });
  }
}

export async function screeningStatus(request: Request, response: Response) {
  try {
    const rawRunId = request.query.runId;
    const runId =
      typeof rawRunId === "string"
        ? rawRunId
        : Array.isArray(rawRunId) && typeof rawRunId[0] === "string"
          ? rawRunId[0]
          : "";

    if (!runId) {
      return response.status(400).json({ error: "Run ID is required" });
    }

    const status = await getScreeningStatus(runId);
    response.json(status);
  } catch (error: any) {
    console.error("[SCREENING] Error getting status:", error?.message ?? error);
    response.status(500).json({ 
      error: "Failed to get screening status",
      details: error?.message ?? "Unknown error"
    });
  }
}

export async function screeningResults(request: Request, response: Response) {
  const job = jobs.find((item) => item.id === request.params.id);
  const computed = await getScreeningResults(String(request.params.id ?? ""));
  const fallbackResults = await getScreeningResultsByJob(String(request.params.id ?? ""));
  const shortlisted = computed?.items
    ? computed.items
    : fallbackResults.length
      ? fallbackResults
      : shortlistCandidates
          .filter((item) => item.jobId === request.params.id)
          .sort((left, right) => right.score - left.score);

  response.json({
    job,
    analyzed: computed?.analyzed ?? job?.applicantCount ?? shortlisted.length,
    durationSeconds: computed?.durationSeconds ?? 43,
    biasAlert:
      computed?.biasAlert ?? {
        detected: true,
        message:
          "Top 5 candidates share similar educational backgrounds (Ivy League / G5 universities).",
      },
    items: shortlisted,
    poolIntelligence: computed?.poolIntelligence ?? null,
  });
}

export async function compareCandidates(request: Request, response: Response) {
  const ids = Array.isArray(request.body?.candidateIds)
    ? (request.body.candidateIds as string[])
    : [];

  const jobId = String(request.params.id ?? "");
  const computed = await getScreeningResults(jobId);
  const fallbackResults = await getScreeningResultsByJob(jobId);
  const candidates = computed?.items
    ? computed.items.filter((candidate: any) => ids.includes(candidate.id))
    : fallbackResults.length
      ? fallbackResults.filter((candidate: any) => ids.includes(candidate.id))
      : shortlistCandidates.filter((candidate) => ids.includes(candidate.id));

  const aiRecommendation = await safeGeminiCall(
    () =>
      generateComparisonRecommendation(
        jobs.find((item) => item.id === jobId)?.title ?? "Role",
        candidates.map((candidate: any) => ({
          totalScore: candidate.score ?? candidate.totalScore ?? 0,
          yearsOfExperience: candidate.yearsExperience ?? 0,
          strengths: candidate.strengths ?? [],
          gaps: candidate.gaps ?? [candidate.gap].filter(Boolean),
          reasoning: candidate.reasoning ?? candidate.overview ?? "",
        })),
      ),
    "AI recommendation unavailable. Compare candidates manually for now.",
    "generateComparisonRecommendation",
  );

  response.json({
    candidates,
    aiRecommendation,
  });
}
