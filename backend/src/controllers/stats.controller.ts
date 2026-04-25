import { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import { ApplicationMongoModel } from "../models/application.mongo.model.js";
import { JobModel } from "../models/job.model.js";
import { ScreeningRunModel } from "../models/screening.model.js";
import { jobs } from "../data/seed.js";
import { applicationService } from "../services/application.service.js";

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const { hrId } = req.params;

    if (!hrId) {
      res.status(400).json({ error: "HR ID required" });
      return;
    }

    const hrJobs = getDataMode() === "mongo"
      ? await JobModel.find({ hrId }).lean()
      : jobs.filter((job) => job.hrId === hrId);
    
    // Get real application data
    const jobStatsPromises = hrJobs.map(async (job) => {
      const applications = await applicationService.getApplicationsByJobId(job.id);
      return {
        jobId: job.id,
        jobTitle: job.title,
        totalApplications: applications.length,
        reviewed: applications.filter((a) => a.status !== "applied").length,
        shortlisted: applications.filter((a) => a.status === "under_review").length,
        interviewed: applications.filter((a) => a.status === "interview_scheduled").length,
        offers: applications.filter((a) => a.status === "offer_extended").length,
      };
    });

    const jobStats = await Promise.all(jobStatsPromises);

    res.json({
      success: true,
      totalJobs: hrJobs.length,
      totalApplications: jobStats.reduce((sum, j) => sum + j.totalApplications, 0),
      jobStats,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function getActivityLog(req: Request, res: Response) {
  try {
    const { hrId } = req.params;

    if (!hrId) {
      res.status(400).json({ error: "HR ID required" });
      return;
    }

    const activityLog =
      getDataMode() === "mongo"
        ? [
            ...(await ApplicationMongoModel.find({ hrId })
              .sort({ appliedAt: -1 })
              .limit(5)
              .lean())
              .map((application) => ({
                id: application.id,
                type:
                  application.status === "interview_scheduled"
                    ? "interview_scheduled"
                    : "application_received",
                message:
                  application.status === "interview_scheduled"
                    ? "Interview scheduled"
                    : "New application received",
                timestamp: application.updatedAt ?? application.appliedAt,
                jobId: application.jobId,
              })),
            ...(await ScreeningRunModel.find({
              status: "complete",
              jobId: { $in: getDataMode() === "mongo" ? (await JobModel.find({ hrId }).distinct("id")) : jobs.filter((job) => job.hrId === hrId).map((job) => job.id) },
            })
              .sort({ completedAt: -1 })
              .limit(3)
              .lean())
              .map((run) => ({
                id: run.runId,
                type: "screening_completed",
                message: "AI screening completed",
                timestamp: new Date(run.completedAt ?? run.startedAt).toISOString(),
                jobId: run.jobId,
              })),
          ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 8)
        : [
            {
              id: "act-1",
              type: "application_received",
              message: "New application received",
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              jobId: "job-frontend",
            },
            {
              id: "act-2",
              type: "screening_completed",
              message: "AI screening completed",
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              jobId: "job-product",
            },
            {
              id: "act-3",
              type: "interview_scheduled",
              message: "Interview scheduled",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              jobId: "job-devops",
            },
          ];

    res.json({
      success: true,
      activities: activityLog,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}
