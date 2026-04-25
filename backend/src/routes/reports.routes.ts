import { Router } from "express";
import {
  getBiasHistory,
  getOverview,
  getSkillsFrequency,
  getTimeline,
} from "../controllers/reports.controller.js";
import { requireRoles } from "../middleware/authorization.js";

export const reportsRouter = Router();

reportsRouter.get("/overview", requireRoles("recruiter", "system_controller"), getOverview);
reportsRouter.get("/screenings-timeline", requireRoles("recruiter", "system_controller"), getTimeline);
reportsRouter.get("/skills-frequency", requireRoles("recruiter", "system_controller"), getSkillsFrequency);
reportsRouter.get("/bias-history", requireRoles("recruiter", "system_controller"), getBiasHistory);
