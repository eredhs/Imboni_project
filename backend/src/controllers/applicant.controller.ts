import type { Request, Response } from "express";
import { extractResumeData, safeGeminiCall } from "../services/gemini.service.js";
import {
  createApplicantFromParsedData,
  deleteApplicantById,
  getApplicantsByJob,
} from "../services/talent.service.js";
import {
  buildFallbackParsedResume,
  extractResumeInputsFromFiles,
} from "../services/resume-upload.service.js";

export async function getApplicants(request: Request, response: Response) {
  const jobId = String(request.params.id ?? "");
  const items = await getApplicantsByJob(jobId);

  response.json({
    items,
    total: items.length,
  });
}

export async function uploadApplicants(request: Request, response: Response) {
  const jobId = String(request.params.id ?? "");
  const rawText = typeof request.body?.rawText === "string" ? request.body.rawText : "";
  const uploadedFiles = Array.isArray((request as Request & { files?: Express.Multer.File[] }).files)
    ? ((request as Request & { files?: Express.Multer.File[] }).files ?? [])
    : [];

  if (rawText.trim()) {
    const parsed = await safeGeminiCall(
      () => extractResumeData(rawText),
      buildFallbackParsedResume(rawText),
      "extractResumeData",
    );

    const applicant = await createApplicantFromParsedData(jobId, parsed as Record<string, unknown>);

    response.status(201).json({
      message: "Resume parsed with AI and saved.",
      parsingStatus: "1 applicant imported.",
      preview: [
        {
          id: applicant.id,
          fullName: applicant.fullName,
          email: applicant.email,
          yearsExperience: applicant.yearsExperience,
          skills: applicant.skills,
        },
      ],
    });
    return;
  }

  if (uploadedFiles.length > 0) {
    const extractedInputs = await extractResumeInputsFromFiles(uploadedFiles);
    const applicants = [];

    for (const item of extractedInputs) {
      const parsed = await safeGeminiCall(
        () => extractResumeData(item.rawText),
        buildFallbackParsedResume(item.rawText),
        `extractResumeData:${item.sourceName}`,
      );

      const applicant = await createApplicantFromParsedData(
        jobId,
        parsed as unknown as Record<string, unknown>,
      );
      applicants.push(applicant);
    }

    response.status(201).json({
      message:
        applicants.length > 0
          ? "Resume files parsed and applicants saved."
          : "No applicants could be extracted from the uploaded files.",
      parsingStatus: `${applicants.length} applicant${applicants.length === 1 ? "" : "s"} imported.`,
      preview: applicants.slice(0, 5).map((applicant) => ({
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        yearsExperience: applicant.yearsExperience,
        skills: applicant.skills,
      })),
    });
    return;
  }

  response.status(201).json({
    message: "No resume content was provided.",
    parsingStatus: "0 applicants imported.",
    preview: [],
  });
}

export async function deleteApplicant(request: Request, response: Response) {
  const applicantId = String(request.params.applicantId ?? "");
  await deleteApplicantById(applicantId);

  response.json({
    message: `Applicant ${applicantId} deleted.`,
  });
}
