import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { applicationService } from "../services/application.service.js";
import { extractResumeInputsFromFiles } from "../services/resume-upload.service.js";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

// ==================== APPLY TO JOB ====================
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const jobId = firstParam(req.params.jobId);
    const {
      userId,
      hrId,
      coverLetter,
      resumeUrl,
      fullName,
      email,
      phone,
      location,
      currentRole,
      yearsOfExperience,
      linkedinUrl,
      portfolioUrl,
      expectedSalary,
      availableFrom,
      workAuthorization,
      professionalSummary,
    } = req.body;
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;

    if (!userId || !jobId) {
      res.status(400).json({ error: "Missing required fields: userId, jobId" });
      return;
    }

    if (typeof fullName !== "string" || !fullName.trim()) {
      res.status(400).json({ error: "Full name is required." });
      return;
    }

    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const hasResumeUrl = typeof resumeUrl === "string" && resumeUrl.trim() !== "";
    if (!uploadedFile && !hasResumeUrl) {
      res.status(400).json({ error: "A CV upload is required to complete the application." });
      return;
    }

    let finalResumeUrl = typeof resumeUrl === "string" ? resumeUrl : undefined;
    let resume:
      | {
          fileName: string;
          mimeType: string;
          fileSize: number;
          url: string;
          extractedText?: string;
        }
      | undefined;

    if (uploadedFile) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const uploadsDir = path.resolve(__dirname, "../../uploads/resumes");
      const safeFileName = uploadedFile.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storedFileName = `${Date.now()}-${safeFileName}`;
      const filePath = path.join(uploadsDir, storedFileName);

      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(filePath, uploadedFile.buffer);

      let extractedText: string | undefined = undefined;
      try {
        const extractedInputs = await extractResumeInputsFromFiles([uploadedFile]);
        extractedText = extractedInputs.map((item) => item.rawText).join("\n\n").trim() || undefined;
      } catch (extractError) {
        console.error("Error extracting resume text:", extractError);
        // CV was saved, but text extraction failed - continue with just the file URL
      }
      
      finalResumeUrl = `/uploads/resumes/${storedFileName}`;
      resume = {
        fileName: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        fileSize: uploadedFile.size,
        url: finalResumeUrl,
        extractedText,
      };
    }

    const application = await applicationService.createApplication(
      jobId,
      userId,
      coverLetter,
      finalResumeUrl,
      hrId,
      {
        candidateProfile: {
          fullName: typeof fullName === "string" ? fullName.trim() : "",
          email: typeof email === "string" ? email.trim() : "",
          phone: typeof phone === "string" ? phone.trim() : "",
          location: typeof location === "string" ? location.trim() : "",
          currentRole: typeof currentRole === "string" ? currentRole.trim() : "",
          yearsOfExperience:
            typeof yearsOfExperience === "string" && yearsOfExperience.trim() !== ""
              ? Number(yearsOfExperience)
              : undefined,
          linkedinUrl: typeof linkedinUrl === "string" ? linkedinUrl.trim() : "",
          portfolioUrl: typeof portfolioUrl === "string" ? portfolioUrl.trim() : "",
          expectedSalary: typeof expectedSalary === "string" ? expectedSalary.trim() : "",
          availableFrom: typeof availableFrom === "string" ? availableFrom.trim() : "",
          workAuthorization: typeof workAuthorization === "string" ? workAuthorization.trim() : "",
          professionalSummary:
            typeof professionalSummary === "string" ? professionalSummary.trim() : "",
        },
        resume,
      },
    );

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errorMessage });
  }
};

// ==================== GET APPLICATIONS ====================
export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const jobId = firstParam(req.params.jobId);

    if (!jobId) {
      res.status(400).json({ error: "Job ID is required" });
      return;
    }

    const applications = await applicationService.getApplicationsByJobId(jobId);
    res.status(200).json({
      success: true,
      data: applications,
      count: applications.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const getApplicationsByUser = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const applications = await applicationService.getApplicationsByUserId(userId);
    res.status(200).json({
      success: true,
      data: applications,
      count: applications.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const getApplicationDetail = async (req: Request, res: Response) => {
  try {
    const applicationId = firstParam(req.params.applicationId);

    if (!applicationId) {
      res.status(400).json({ error: "Application ID is required" });
      return;
    }

    const application = await applicationService.getApplication(applicationId);

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

// ==================== UPDATE APPLICATION STATUS ====================
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = firstParam(req.params.applicationId);
    const { status, reason } = req.body;

    if (!applicationId || !status) {
      res.status(400).json({ error: "Application ID and status are required" });
      return;
    }

    const application = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      reason
    );

    res.status(200).json({
      success: true,
      data: application,
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errorMessage });
  }
};

// ==================== ADD NOTES ====================
export const addApplicationNote = async (req: Request, res: Response) => {
  try {
    const applicationId = firstParam(req.params.applicationId);
    const { note } = req.body;

    if (!applicationId || !note) {
      res.status(400).json({ error: "Application ID and note are required" });
      return;
    }

    const application = await applicationService.addApplicationNote(
      applicationId,
      note
    );

    res.status(200).json({
      success: true,
      data: application,
      message: "Note added successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errorMessage });
  }
};

// ==================== SCHEDULE INTERVIEW ====================
export const scheduleInterview = async (req: Request, res: Response) => {
  try {
    const applicationId = firstParam(req.params.applicationId);
    const { dateTime } = req.body;

    if (!applicationId || !dateTime) {
      res.status(400).json({ error: "Application ID and dateTime are required" });
      return;
    }

    const application = await applicationService.scheduleInterview(
      applicationId,
      dateTime
    );

    res.status(200).json({
      success: true,
      data: application,
      message: "Interview scheduled successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errorMessage });
  }
};

// ==================== EXTEND OFFER ====================
export const extendOffer = async (req: Request, res: Response) => {
  try {
    const applicationId = firstParam(req.params.applicationId);
    const { salary, startDate, benefits } = req.body;

    if (!applicationId || !salary || !startDate) {
      res.status(400).json({
        error: "Application ID, salary, and startDate are required",
      });
      return;
    }

    const application = await applicationService.extendOffer(
      applicationId,
      salary,
      startDate,
      benefits || []
    );

    res.status(200).json({
      success: true,
      data: application,
      message: "Offer extended successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errorMessage });
  }
};

// ==================== NOTIFICATIONS ====================
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const notifications = await applicationService.getNotifications(userId);
    const unread = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: unread,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const notificationId = firstParam(req.params.notificationId);
    const userId = firstParam(req.params.userId);

    if (!notificationId || !userId) {
      res.status(400).json({ error: "Notification ID and User ID are required" });
      return;
    }

    await applicationService.markNotificationRead(notificationId, userId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    await applicationService.markAllNotificationsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};
