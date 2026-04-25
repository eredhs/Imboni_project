import { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import { ApplicationMongoModel } from "../models/application.mongo.model.js";
import { JobModel } from "../models/job.model.js";
import { ScreeningRunModel } from "../models/screening.model.js";
import { jobs } from "../data/seed.js";

export async function getModerationDashboard(req: Request, res: Response) {
  try {
    const allJobs = getDataMode() === "mongo" ? await JobModel.find().lean() : jobs;
    const totalJobs = allJobs.length;
    const activeJobs = allJobs.filter(j => j.status === "active").length;
    const draftJobs = allJobs.filter(j => j.status === "draft").length;
    const closedJobs = allJobs.filter(j => j.status === "closed").length;
    const activities = await buildActivities();

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        draftJobs,
        closedJobs,
      },
      activities,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function getRecentActivities(req: Request, res: Response) {
  try {
    const activities = await buildActivities(true);

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

async function buildActivities(includeUser = false) {
  if (getDataMode() !== "mongo") {
    return [
      {
        id: "act-1",
        type: "job_posted",
        title: "Frontend Developer",
        description: "New job posted in Engineering",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: includeUser ? "Demo Recruiter" : undefined,
        icon: "briefcase",
      },
      {
        id: "act-2",
        type: "application_received",
        title: "5 new applications",
        description: "For Product Manager role",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: includeUser ? "System" : undefined,
        icon: "file-text",
      },
      {
        id: "act-3",
        type: "placement",
        title: "Candidate hired",
        description: "Candidate placed successfully",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        user: includeUser ? "System" : undefined,
        icon: "check-circle",
      },
    ];
  }

  const [allJobs, applications, completedRuns] = await Promise.all([
    JobModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ApplicationMongoModel.find().sort({ appliedAt: -1 }).limit(5).lean(),
    ScreeningRunModel.find({ status: "complete" }).sort({ completedAt: -1 }).limit(5).lean(),
  ]);

  return [
    ...allJobs.map((job) => ({
      id: `job-${job.id}`,
      type: "job_posted",
      title: job.title,
      description: `New job posted in ${job.department}`,
      timestamp: job.createdAt ?? new Date().toISOString(),
      user: includeUser ? "Recruiter" : undefined,
      icon: "briefcase",
    })),
    ...applications.map((application) => ({
      id: `app-${application.id}`,
      type: "application_received",
      title: "New application",
      description: `Application received for ${application.jobId}`,
      timestamp: application.appliedAt,
      user: includeUser ? "System" : undefined,
      icon: "file-text",
    })),
    ...completedRuns.map((run) => ({
      id: `run-${run.runId}`,
      type: "placement",
      title: "Screening completed",
      description: `AI screening completed for ${run.jobId}`,
      timestamp: new Date(run.completedAt ?? run.startedAt).toISOString(),
      user: includeUser ? "System" : undefined,
      icon: "check-circle",
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}
