import type { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import { jobs, reportsOverview } from "../data/seed.js";
import { ApplicantModel } from "../models/applicant.model.js";
import { JobModel } from "../models/job.model.js";
import { ScreeningResultModel, ScreeningRunModel } from "../models/screening.model.js";

export async function getDashboardOverview(_request: Request, response: Response) {
  const allJobs = getDataMode() === "mongo" ? await JobModel.find().lean() : jobs;

  const activeJobs = allJobs.filter((job) => job.status === "active").length;
  const closingThisWeek = allJobs.filter((job) => {
    const deadline = new Date(job.applicationDeadline);
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return deadline < weekFromNow && deadline > new Date();
  }).length;
  const pendingScreenings = allJobs.filter((job) => job.screeningStatus === "Pending").length;

  const recentScreenings = allJobs
    .filter((job) => job.screeningStatus)
    .slice(0, 3)
    .map((job) => ({
      id: job.id,
      jobTitle: job.title,
      applicants: job.applicantCount,
      topScore: job.topScore,
      status:
        job.screeningStatus === "Completed"
          ? "completed"
          : job.screeningStatus === "In Progress"
            ? "in_progress"
            : "pending",
    }));

  if (getDataMode() === "mongo") {
    const [screeningRuns, screeningResults, applicants] = await Promise.all([
      ScreeningRunModel.find().sort({ startedAt: -1 }).lean(),
      ScreeningResultModel.find().lean(),
      ApplicantModel.find().lean(),
    ]);

    const shortlistedToday = screeningResults.filter((item) => {
      const createdAt = new Date(item.createdAt ?? Date.now());
      return createdAt.toDateString() === new Date().toDateString();
    }).length;

    const shortlistRoles = new Set(screeningResults.map((item) => item.jobId)).size;
    const topSkill = Object.entries(
      applicants.flatMap((item) => item.skills ?? []).reduce<Record<string, number>>((acc, skill) => {
        acc[skill] = (acc[skill] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? reportsOverview.keyIndicators.skillStrength;

    response.json({
      activeJobs,
      closingThisWeek,
      pendingScreenings,
      shortlistedToday,
      shortlistRoles,
      timeSavedHours: Number((screeningRuns.length * 1.4).toFixed(1)),
      recentScreenings: screeningRuns.slice(0, 3).map((run) => {
        const job = allJobs.find((item) => item.id === run.jobId);
        return {
          id: run.jobId,
          jobTitle: job?.title ?? run.jobId,
          applicants: applicants.filter((item) => item.jobId === run.jobId).length,
          topScore: Math.max(
            0,
            ...screeningResults
              .filter((item) => item.jobId === run.jobId)
              .map((item) => Number(item.score ?? 0)),
          ),
          status:
            run.status === "complete"
              ? "completed"
              : run.status === "failed"
                ? "pending"
                : "in_progress",
        };
      }),
      optimizationSuggestion: {
        title: "AI Optimization Available",
        text: "Adding GraphQL and Testing to Frontend Developer would match more top candidates.",
      },
      poolIntelligence: {
        text:
          screeningRuns.find((run) => typeof run.poolIntelligence === "string")?.poolIntelligence ??
          reportsOverview.poolIntelligence,
        skillStrength: topSkill,
        marketFitPercentile: applicants.length >= 10 ? "Top 20% Percentile" : reportsOverview.keyIndicators.marketFit,
        updatedMinutesAgo: screeningRuns[0]?.completedAt
          ? Math.max(1, Math.round((Date.now() - screeningRuns[0].completedAt) / 60000))
          : reportsOverview.updatedHoursAgo * 60,
      },
    });
    return;
  }

  response.json({
    activeJobs,
    closingThisWeek,
    pendingScreenings,
    shortlistedToday: reportsOverview.shortlistedToday,
    shortlistRoles: reportsOverview.shortlistedAcrossRoles,
    timeSavedHours: reportsOverview.dashboardTimeSavedHours,
    recentScreenings,
    optimizationSuggestion: {
      title: "AI Optimization Available",
      text: "Adding GraphQL and Testing to Frontend Developer would match 68% more top candidates.",
    },
    poolIntelligence: {
      text: reportsOverview.poolIntelligence,
      skillStrength: reportsOverview.keyIndicators.skillStrength,
      marketFitPercentile: reportsOverview.keyIndicators.marketFit,
      updatedMinutesAgo: reportsOverview.updatedHoursAgo * 60,
    },
  });
}
