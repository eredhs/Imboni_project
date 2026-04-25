import { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import { jobs, users } from "../data/seed.js";
import { JobModel } from "../models/job.model.js";
import { UserModel } from "../models/user.model.js";
import { applicationService } from "../services/application.service.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export async function verifyAdminKey(request: Request, response: Response) {
  try {
    const { secretKey } = request.body;

    if (!secretKey) {
      throw new HttpError(400, "Secret key required");
    }

    const isValid = secretKey === env.ADMIN_SECRET_KEY;

    if (!isValid) {
      throw new HttpError(401, "Invalid secret key");
    }

    response.json({ valid: true });
  } catch (error: any) {
    response.status(error.statusCode || 500).json({
      message: error.message || "Verification failed",
    });
  }
}

export async function getAdminStats(req: Request, res: Response) {
  try {
    const allJobs = getDataMode() === "mongo" ? await JobModel.find().lean() : jobs;
    const allUsers = getDataMode() === "mongo" ? await UserModel.find().lean() : users;

    // Get all applications
    const appsByJobId = new Map<string, any[]>();
    for (const job of allJobs) {
      const apps = await applicationService.getApplicationsByJobId(job.id);
      appsByJobId.set(job.id, apps);
    }

    const totalApps = Array.from(appsByJobId.values()).reduce((sum, arr) => sum + arr.length, 0);

    res.json({
      success: true,
      platformStats: {
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter((j) => j.status === "active").length,
        totalApplications: totalApps,
        totalUsers: allUsers.length,
        avgApplicationsPerJob: Math.round(totalApps / Math.max(allJobs.length, 1)),
      },
      jobBreakdown: allJobs.map((job) => ({
        jobId: job.id,
        title: job.title,
        department: job.department,
        status: job.status,
        applications: appsByJobId.get(job.id)?.length ?? 0,
      })),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function getPlatformInsights(req: Request, res: Response) {
  try {
    const allJobs = getDataMode() === "mongo" ? await JobModel.find().lean() : jobs;
    const jobsbyStatus = new Map<string, number>();
    const departments = new Map<string, number>();

    allJobs.forEach((job) => {
      jobsbyStatus.set(job.status, (jobsbyStatus.get(job.status) ?? 0) + 1);
      departments.set(job.department, (departments.get(job.department) ?? 0) + 1);
    });

    res.json({
      success: true,
      insights: {
        jobsByStatus: Object.fromEntries(jobsbyStatus),
        jobsByDepartment: Object.fromEntries(departments),
        totalActive: allJobs.filter((j) => j.status === "active").length,
        closingThisWeek: allJobs.filter((j) => {
          const deadline = new Date(j.applicationDeadline);
          const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          return deadline < weekFromNow && deadline > new Date();
        }).length,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}
