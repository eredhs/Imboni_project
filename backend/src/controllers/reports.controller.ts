import type { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import {
  biasHistory,
  reportsOverview,
  skillsFrequency,
  timeline,
} from "../data/seed.js";
import { ApplicantModel } from "../models/applicant.model.js";
import { ApplicationMongoModel } from "../models/application.mongo.model.js";
import { JobModel } from "../models/job.model.js";
import { ScreeningResultModel, ScreeningRunModel } from "../models/screening.model.js";
import { buildSkillTrendInsight } from "../services/reports.service.js";

export async function getOverview(_request: Request, response: Response) {
  if (getDataMode() === "mongo") {
    const [allJobs, applicantsList, applications, screeningRuns, screeningResults] = await Promise.all([
      JobModel.find().lean(),
      ApplicantModel.find().lean(),
      ApplicationMongoModel.find().lean(),
      ScreeningRunModel.find().lean(),
      ScreeningResultModel.find().lean(),
    ]);

    const frequenciesMap = applicantsList
      .flatMap((applicant) => applicant.skills ?? [])
      .reduce<Record<string, number>>((acc, skill) => {
        acc[skill] = (acc[skill] ?? 0) + 1;
        return acc;
      }, {});
    const computedSkillsFrequency = Object.entries(frequenciesMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const computedTimeline = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (5 - index) * 5);
      const day = date.getDate().toString().padStart(2, "0");
      return {
        day,
        uploaded: applicantsList.filter((item) => new Date(item.createdAt ?? Date.now()) <= date).length,
        shortlisted: screeningResults.filter((item) => new Date(item.createdAt ?? Date.now()) <= date).length,
      };
    });

    const computedBiasHistory = screeningRuns
      .filter((run) => run.biasResult?.biasDetected)
      .slice(-5)
      .reverse()
      .map((run, index) => ({
        id: `bias-${index + 1}`,
        date: new Date(run.completedAt ?? run.startedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        targetRole: allJobs.find((job) => job.id === run.jobId)?.title ?? "Role",
        alertType: run.biasResult?.biasType ?? "Bias Alert",
        actionTaken: run.biasResult?.recommendation ?? "Manual review",
      }));

    const kpis = {
      ...reportsOverview,
      activeJobs: allJobs.filter((job) => job.status === "active").length,
      closingThisWeek: allJobs.filter((job) => {
        const deadline = new Date(job.applicationDeadline);
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return deadline < weekFromNow && deadline > new Date();
      }).length,
      pendingScreenings: allJobs.filter((job) => job.screeningStatus === "Pending").length,
      shortlistedToday: screeningResults.filter((item) => new Date(item.createdAt ?? Date.now()).toDateString() === new Date().toDateString()).length,
      shortlistedAcrossRoles: new Set(screeningResults.map((item) => item.jobId)).size,
      totalScreened: applicantsList.length,
      avgTimeSavedHours: Number((screeningRuns.length * 1.2).toFixed(1)),
      dashboardTimeSavedHours: Number((screeningRuns.length * 1.4).toFixed(1)),
      outcomes: {
        hired: applications.filter((item) => item.status === "accepted" || item.status === "offer_extended").length,
        rejected: applications.filter((item) => item.status === "rejected").length,
        inProgress: applications.filter((item) => ["applied", "under_review", "interview_scheduled"].includes(item.status)).length,
      },
      keyIndicators: {
        skillStrength: computedSkillsFrequency[0]?.skill ?? reportsOverview.keyIndicators.skillStrength,
        marketFit: applicantsList.length >= 10 ? "Top 20% Percentile" : reportsOverview.keyIndicators.marketFit,
      },
    };

    response.json({
      kpis,
      screeningsTimeline: computedTimeline,
      skillsFrequency: computedSkillsFrequency.length ? computedSkillsFrequency : skillsFrequency,
      outcomes: kpis.outcomes,
      biasHistory: computedBiasHistory.length ? computedBiasHistory : biasHistory,
      skillTrend: buildSkillTrendInsight(kpis.totalScreened, computedSkillsFrequency),
    });
    return;
  }

  response.json({
    kpis: reportsOverview,
    screeningsTimeline: timeline,
    skillsFrequency,
    outcomes: reportsOverview.outcomes,
    biasHistory,
    skillTrend: buildSkillTrendInsight(reportsOverview.totalScreened, skillsFrequency),
  });
}

export async function getTimeline(_request: Request, response: Response) {
  if (getDataMode() === "mongo") {
    const applicantsList = await ApplicantModel.find().lean();
    response.json(
      Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (5 - index) * 5);
        return {
          day: date.getDate().toString().padStart(2, "0"),
          uploaded: applicantsList.filter((item) => new Date(item.createdAt ?? Date.now()) <= date).length,
          shortlisted: 0,
        };
      }),
    );
    return;
  }
  response.json(timeline);
}

export async function getSkillsFrequency(_request: Request, response: Response) {
  if (getDataMode() === "mongo") {
    const applicantsList = await ApplicantModel.find().lean();
    const computed = Object.entries(
      applicantsList.flatMap((applicant) => applicant.skills ?? []).reduce<Record<string, number>>((acc, skill) => {
        acc[skill] = (acc[skill] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
    response.json(computed);
    return;
  }
  response.json(skillsFrequency);
}

export async function getBiasHistory(_request: Request, response: Response) {
  if (getDataMode() === "mongo") {
    const [runs, allJobs] = await Promise.all([ScreeningRunModel.find().lean(), JobModel.find().lean()]);
    const computed = runs
      .filter((run) => run.biasResult?.biasDetected)
      .map((run, index) => ({
        id: `bias-${index + 1}`,
        date: new Date(run.completedAt ?? run.startedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        targetRole: allJobs.find((job) => job.id === run.jobId)?.title ?? "Role",
        alertType: run.biasResult?.biasType ?? "Bias Alert",
        actionTaken: run.biasResult?.recommendation ?? "Manual review",
      }));
    response.json(computed.length ? computed : biasHistory);
    return;
  }
  response.json(biasHistory);
}
