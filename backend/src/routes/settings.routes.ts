import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateScoring,
  updateNotifications,
  getTeamMembers,
  createTeamMember,
  deleteTeamMember,
  updateBiasDetection,
} from "../controllers/settings.controller.js";

export const settingsRouter = Router();

// Main settings
settingsRouter.get("/", getSettings);
settingsRouter.put("/", updateSettings);

// Scoring weights
settingsRouter.patch("/scoring", updateScoring);

// Notifications
settingsRouter.patch("/notifications", updateNotifications);

// Bias detection
settingsRouter.patch("/bias-detection", updateBiasDetection);

// Team members
settingsRouter.get("/team", getTeamMembers);
settingsRouter.post("/team", createTeamMember);
settingsRouter.delete("/team/:memberId", deleteTeamMember);
