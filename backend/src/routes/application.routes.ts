import { Router } from "express";
import {
  applyToJob,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationDetail,
  updateApplicationStatus,
  addApplicationNote,
  scheduleInterview,
  extendOffer,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/application.controller.js";
import {
  requireApplicationHrAccess,
  requireApplicationParticipantOrRoles,
  requireBodyUserMatchOrRoles,
  requireRoles,
  requireSelfOrRoles,
} from "../middleware/authorization.js";
import { upload } from "../middleware/upload.js";

export const applicationRouter = Router();

// Application Management
applicationRouter.post("/:jobId/apply", upload.single("cv"), requireBodyUserMatchOrRoles("userId", "system_controller"), requireRoles("job_seeker", "system_controller"), applyToJob); // POST /api/applications/:jobId/apply
applicationRouter.get("/job/:jobId", requireRoles("recruiter", "system_controller"), getApplicationsByJob); // Get all applications for a job
applicationRouter.get("/user/:userId", requireSelfOrRoles("userId", "system_controller"), getApplicationsByUser); // Get all applications by user
applicationRouter.get("/:applicationId", requireApplicationParticipantOrRoles("system_controller"), getApplicationDetail); // Get application details

// HR Actions
applicationRouter.patch("/:applicationId/status", requireApplicationHrAccess("system_controller"), updateApplicationStatus); // Update application status
applicationRouter.post("/:applicationId/notes", requireApplicationHrAccess("system_controller"), addApplicationNote); // Add HR notes
applicationRouter.post("/:applicationId/interview", requireApplicationHrAccess("system_controller"), scheduleInterview); // Schedule interview
applicationRouter.post("/:applicationId/offer", requireApplicationHrAccess("system_controller"), extendOffer); // Extend offer

// Notifications
applicationRouter.get("/notifications/:userId", requireSelfOrRoles("userId", "system_controller"), getNotifications); // Get user notifications
applicationRouter.patch("/notifications/:userId/:notificationId/read", requireSelfOrRoles("userId", "system_controller"), markNotificationRead); // Mark one as read
applicationRouter.patch("/notifications/:userId/read-all", requireSelfOrRoles("userId", "system_controller"), markAllNotificationsRead); // Mark all as read
