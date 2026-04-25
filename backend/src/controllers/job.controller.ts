import type { Request, Response } from "express";
import { getDataMode } from "../config/db.js";
import { jobs } from "../data/seed.js";
import { JobModel } from "../models/job.model.js";
import { applicationService } from "../services/application.service.js";
import { safeGeminiCall, suggestJobSkills } from "../services/gemini.service.js";

async function getStoredJobs(request: Request) {
  const isSystemController = request.user?.role === "system_controller";
  const hrId = request.user?.id;

  if (getDataMode() === "mongo") {
    const query =
      isSystemController || !hrId
        ? JobModel.find()
        : JobModel.find({ hrId });

    return query.sort({ createdAt: -1 }).lean();
  }

  if (isSystemController || !hrId) {
    return jobs;
  }

  return jobs.filter((job) => job.hrId === hrId);
}

export async function getJobs(request: Request, response: Response) {
  const items = await getStoredJobs(request);
  response.json({
    items,
    total: items.length,
  });
}

export async function getSeekerJobs(request: Request, response: Response) {
  const allJobs = getDataMode() === "mongo" ? await JobModel.find().sort({ createdAt: -1 }).lean() : jobs;
  const now = new Date();
  const seekerId = request.user?.id;
  const seekerApplications = seekerId ? await applicationService.getApplicationsByUserId(seekerId) : [];
  const applicationStatusByJobId = new Map(
    seekerApplications.map((application) => [application.jobId, application.status]),
  );
  const activeJobs = allJobs.filter((job) => {
    if (job.status !== "active") return false;
    const deadline = new Date(job.applicationDeadline);
    return deadline > now;
  });

  response.json({
    items: activeJobs.map((job) => ({
      ...job,
      isNew: (Date.now() - new Date(job.createdAt || Date.now()).getTime()) < 24 * 60 * 60 * 1000,
      applicationStatus: applicationStatusByJobId.get(job.id) ?? "not_applied",
    })),
    total: activeJobs.length,
  });
}

export async function createJob(request: Request, response: Response) {
  if (!request.user?.id) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  const payload = request.body;
  const item = {
    id: `job-${Date.now()}`,
    hrId: request.user.role === "system_controller" ? String(payload.hrId ?? request.user.id) : request.user.id,
    applicantCount: 0,
    topScore: 0,
    createdAt: new Date().toISOString(),
    screeningStatus: "Pending",
    status: "active",
    ...payload,
  };

  if (getDataMode() === "mongo") {
    await JobModel.create(item);
  } else {
    jobs.unshift(item);
  }

  response.status(201).json({
    message: getDataMode() === "mongo" ? "Job created in MongoDB." : "Job created in seed mode.",
    item,
  });
}

export async function updateJob(request: Request, response: Response) {
  if (getDataMode() === "mongo") {
    const query =
      request.user?.role === "system_controller"
        ? { id: request.params.id }
        : { id: request.params.id, hrId: request.user?.id };

    const updated = await JobModel.findOneAndUpdate(
      query,
      { $set: request.body },
      { new: true },
    ).lean();

    if (!updated) {
      response.status(404).json({ message: "Job not found." });
      return;
    }

    response.json({
      message: `Job ${request.params.id} updated in MongoDB.`,
      item: updated,
    });
    return;
  }

  const index = jobs.findIndex((job) => job.id === request.params.id);
  if (index === -1) {
    response.status(404).json({ message: "Job not found." });
    return;
  }

  jobs[index] = {
    ...jobs[index],
    ...request.body,
  };

  response.json({
    message: `Job ${request.params.id} updated in seed mode.`,
    item: jobs[index],
  });
}

export async function getAiSkillSuggestions(request: Request, response: Response) {
  const title = String(request.body?.title ?? "");
  const description = String(request.body?.description ?? "");
  const currentSkills = Array.isArray(request.body?.currentSkills)
    ? (request.body.currentSkills as string[])
    : [];

  const result = await safeGeminiCall(
    () => suggestJobSkills(title, description, currentSkills),
    {
      suggestedSkills: title.toLowerCase().includes("frontend")
        ? ["React", "TypeScript", "Node.js", "Testing"]
        : ["Stakeholder Management", "Analytics", "Product Strategy"],
      reasoning: "Fallback suggestions generated.",
    },
    "suggestJobSkills",
  );

  response.json({
    suggestions: result.suggestedSkills,
    reasoning: result.reasoning,
  });
}
