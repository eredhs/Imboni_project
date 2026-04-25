import { Application, ApplicationEvent, ApplicationStatus, Notification } from "../models/application.model.js";
import { ApplicationMongoModel, NotificationModel } from "../models/application.mongo.model.js";
import { JobModel } from "../models/job.model.js";
import { getUserById } from "./auth.service.js";
import { ensureApplicantForApplication } from "./talent.service.js";

// Helper to generate IDs
const generateId = (type: string): string => `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ==================== APPLICATION SERVICE ====================

export const applicationService = {
  // Create a new application
  async createApplication(
    jobId: string,
    userId: string,
    coverLetter?: string,
    resumeUrl?: string,
    requestedHrId?: string,
    details?: {
      candidateProfile?: Application["candidateProfile"];
      resume?: Application["resume"];
    },
  ): Promise<Application> {
    const applicationId = generateId("app");
    const now = new Date().toISOString();
    const job = await this.getJobById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    if (requestedHrId && job.hrId !== requestedHrId) {
      throw new Error("Application HR does not match the stored job owner");
    }

    // Check if user already applied for this job
    const existing = await ApplicationMongoModel.findOne({ jobId, userId }).lean();

    if (existing) {
      throw new Error("User has already applied for this job");
    }

    const application: Application = {
      id: applicationId,
      jobId,
      userId,
      hrId: job.hrId,
      status: "applied",
      appliedAt: now,
      updatedAt: now,
      coverLetter,
      resumeUrl,
      candidateProfile: details?.candidateProfile,
      resume: details?.resume,
      screeningStatus: "pending",
      timeline: [
        {
          id: generateId("event"),
          type: "applied",
          timestamp: now,
          actorType: "candidate",
          actorId: userId,
          message: "Application submitted",
          details: {
            jobTitle: (job as any).title ?? "Job Application",
            companyName: (job as any).department ?? "Hiring Team",
            location: (job as any).location ?? "Location not specified",
          },
        },
      ],
    };

    await ApplicationMongoModel.create(application);
    await JobModel.updateOne({ id: jobId }, { $inc: { applicantCount: 1 } });

    const candidateUser = await getUserById(userId);
    if (candidateUser) {
      try {
        await ensureApplicantForApplication({
          applicationId,
          job: {
            id: jobId,
            title: (job as any).title ?? "Job Application",
            requiredSkills: Array.isArray((job as any).requiredSkills) ? (job as any).requiredSkills : [],
            preferredSkills: Array.isArray((job as any).preferredSkills) ? (job as any).preferredSkills : [],
            location: (job as any).location ?? "Not specified",
            minExperienceYears: Number((job as any).minExperienceYears ?? 0),
          },
          user: candidateUser,
          coverLetter,
          resumeUrl,
          candidateProfile: details?.candidateProfile,
          resume: details?.resume,
        });
      } catch (applicantError) {
        // Log the error but don't prevent application submission
        console.error(
          `[APPLICATION] Failed to create applicant for ${applicationId}:`,
          applicantError instanceof Error ? applicantError.message : applicantError
        );
        // Continue - application is still valid without applicant enrichment
      }
    }

    // Create notification for HR
    await this.createNotification(
      job.hrId,
      "hr",
      "application_received",
      `New application received for ${jobId}`,
      `A job seeker has applied for your job posting`,
      jobId,
      "job",
      `/applicants?jobId=${jobId}`
    );

    return application;
  },

  async getJobById(jobId: string) {
    return JobModel.findOne({ id: jobId }).lean<{ id: string; hrId: string } | null>();
  },

  // Get application by ID
  async getApplication(applicationId: string): Promise<Application | null> {
    return ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
  },

  // Get applications for a user (job seeker)
  async getApplicationsByUserId(userId: string): Promise<Application[]> {
    return ApplicationMongoModel.find({ userId }).lean<Application[]>();
  },

  // Get applications for a job (HR)
  async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    return ApplicationMongoModel.find({ jobId }).lean<Application[]>();
  },

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    reason?: string
  ): Promise<Application> {
    const app = await ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
    if (!app) throw new Error("Application not found");

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();

    // Add event to timeline
    const event: ApplicationEvent = {
      id: generateId("event"),
      type: (() => {
        if (newStatus === "rejected") return "rejected";
        if (newStatus === "interview_scheduled") return "interview_scheduled";
        if (newStatus === "offer_extended") return "offer_made";
        if (newStatus === "under_review") return "reviewed";
        return "reviewed";
      })(),
      timestamp: app.updatedAt,
      actorType: "hr",
      actorId: app.hrId,
      message: `Application ${newStatus === "rejected" ? "rejected" : "status updated to " + newStatus}`,
      details: reason ? { reason } : undefined,
    };

    app.timeline.push(event);
    await ApplicationMongoModel.updateOne({ id: applicationId }, { $set: app });

    // Create notification for candidate
    const notificationMessages: Record<ApplicationStatus, { title: string; message: string }> = {
      applied: { title: "Application Sent", message: "Your application has been sent" },
      under_review: { title: "Under Review", message: "Your application is being reviewed" },
      interview_scheduled: { title: "Interview Scheduled", message: "You have been invited for an interview" },
      rejected: { title: "Application Closed", message: reason || "Your application was not selected" },
      accepted: { title: "Accepted", message: "Congratulations! Your application has been accepted" },
      offer_extended: { title: "Offer Extended", message: "We are pleased to extend an offer to you" },
      withdrawn: { title: "Application Withdrawn", message: "Your application has been withdrawn" },
    };

    const msg = notificationMessages[newStatus];
    await this.createNotification(
      app.userId,
      "candidate",
      (() => {
        if (newStatus === "rejected") return "rejected";
        if (newStatus === "interview_scheduled") return "interview_scheduled";
        if (newStatus === "offer_extended") return "offer_made";
        return "application_reviewed";
      })(),
      msg.title,
      msg.message,
      applicationId,
      "application",
      `/seeker/applications`
    );

    return app;
  },

  // Add HR notes
  async addApplicationNote(applicationId: string, note: string): Promise<Application> {
    const app = await ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
    if (!app) throw new Error("Application not found");

    if (!app.notes) app.notes = [];
    app.notes.push(note);
    app.updatedAt = new Date().toISOString();
    await ApplicationMongoModel.updateOne({ id: applicationId }, { $set: app });

    return app;
  },

  // Schedule interview
  async scheduleInterview(applicationId: string, dateTime: string): Promise<Application> {
    const app = await ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
    if (!app) throw new Error("Application not found");

    app.status = "interview_scheduled";
    app.interviewScheduledAt = dateTime;
    app.updatedAt = new Date().toISOString();

    const event: ApplicationEvent = {
      id: generateId("event"),
      type: "interview_scheduled",
      timestamp: app.updatedAt,
      actorType: "hr",
      actorId: app.hrId,
      message: `Interview scheduled for ${dateTime}`,
    };

    app.timeline.push(event);
    await ApplicationMongoModel.updateOne({ id: applicationId }, { $set: app });

    // Notify candidate
    await this.createNotification(
      app.userId,
      "candidate",
      "interview_scheduled",
      "Interview Scheduled",
      `Your interview has been scheduled for ${dateTime}`,
      applicationId,
      "application",
      `/seeker/interviews`
    );

    return app;
  },

  // Extend offer
  async extendOffer(
    applicationId: string,
    salary: number,
    startDate: string,
    benefits: string[]
  ): Promise<Application> {
    const app = await ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
    if (!app) throw new Error("Application not found");

    app.status = "offer_extended";
    app.offerDetails = { salary, startDate, benefits };
    app.updatedAt = new Date().toISOString();

    const event: ApplicationEvent = {
      id: generateId("event"),
      type: "offer_made",
      timestamp: app.updatedAt,
      actorType: "hr",
      actorId: app.hrId,
      message: `Offer extended: $${salary}`,
      details: { salary, startDate, benefits },
    };

    app.timeline.push(event);
    await ApplicationMongoModel.updateOne({ id: applicationId }, { $set: app });

    // Notify candidate
    await this.createNotification(
      app.userId,
      "candidate",
      "offer_made",
      "Offer Extended",
      `Congratulations! You have received an offer. Salary: $${salary}`,
      applicationId,
      "application",
      `/seeker/applications`
    );

    return app;
  },

  // Update screening score
  async updateScreeningScore(
    applicationId: string,
    score: number,
    screeningDate: string
  ): Promise<Application> {
    const app = await ApplicationMongoModel.findOne({ id: applicationId }).lean<Application | null>();
    if (!app) throw new Error("Application not found");

    app.screeningScore = score;
    app.screeningStatus = "completed";
    app.screeningDate = screeningDate;
    app.updatedAt = new Date().toISOString();

    const event: ApplicationEvent = {
      id: generateId("event"),
      type: "screening_completed",
      timestamp: app.updatedAt,
      actorType: "system",
      actorId: "ai-screening",
      message: `AI screening completed. Score: ${score}`,
      details: { score },
    };

    app.timeline.push(event);
    await ApplicationMongoModel.updateOne({ id: applicationId }, { $set: app });

    return app;
  },

  async syncScreeningScores(
    entries: Array<{
      applicationId?: string;
      userId?: string;
      jobId: string;
      score: number;
      screeningDate: string;
      shortlisted?: boolean;
      jobTitle?: string;
    }>,
  ): Promise<void> {
    for (const entry of entries) {
      const app = await ApplicationMongoModel.findOne(
        entry.applicationId
          ? { id: entry.applicationId }
          : { jobId: entry.jobId, userId: entry.userId },
      ).lean<Application | null>();

      if (!app) {
        continue;
      }

      app.screeningScore = entry.score;
      app.screeningStatus = "completed";
      app.screeningDate = entry.screeningDate;
      app.updatedAt = entry.screeningDate;

      const hasCompletionEvent = app.timeline.some(
        (event) =>
          event.type === "screening_completed" &&
          typeof event.details?.score === "number" &&
          Number(event.details.score) === entry.score,
      );

      if (!hasCompletionEvent) {
        app.timeline.push({
          id: generateId("event"),
          type: "screening_completed",
          timestamp: entry.screeningDate,
          actorType: "system",
          actorId: "ai-screening",
          message: `AI screening completed. Score: ${entry.score}`,
          details: { score: entry.score },
        });
      }

      if (entry.shortlisted) {
        const hasShortlistEvent = app.timeline.some((event) => event.type === "shortlisted");

        if (!hasShortlistEvent) {
          app.timeline.push({
            id: generateId("event"),
            type: "shortlisted",
            timestamp: entry.screeningDate,
            actorType: "system",
            actorId: "ai-screening",
            message: `You were shortlisted for ${entry.jobTitle ?? "this role"}.`,
            details: { score: entry.score, jobId: entry.jobId },
          });
        }

        const existingNotifications = await this.getNotifications(app.userId);
        const hasShortlistNotification = existingNotifications.some(
          (notification) =>
            notification.type === "shortlisted" &&
            notification.relatedEntityId === app.id,
        );

        if (!hasShortlistNotification) {
          await this.createNotification(
            app.userId,
            "candidate",
            "shortlisted",
            "Shortlisted for Next Review",
            `Your application for ${entry.jobTitle ?? "this role"} was shortlisted after screening.`,
            app.id,
            "application",
            `/seeker/applications`,
          );
        }
      }

      await ApplicationMongoModel.updateOne({ id: app.id }, { $set: app });
    }
  },

  // ==================== NOTIFICATION SERVICE ====================

  async createNotification(
    userId: string,
    userType: "hr" | "candidate",
    type: Notification["type"],
    title: string,
    message: string,
    relatedEntityId: string,
    relatedEntityType: "application" | "job",
    actionUrl?: string
  ): Promise<Notification> {
    const notification: Notification = {
      id: generateId("notif"),
      userId,
      userType,
      type,
      title,
      message,
      relatedEntityId,
      relatedEntityType,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl,
    };

    await NotificationModel.create(notification);
    return notification;
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean<Notification[]>();
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return NotificationModel.find({ userId, read: false }).sort({ createdAt: -1 }).lean<Notification[]>();
  },

  async markNotificationRead(notificationId: string, userId: string): Promise<void> {
    await NotificationModel.updateOne({ id: notificationId, userId }, { $set: { read: true } });
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ userId, read: false }, { $set: { read: true } });
  },
};
