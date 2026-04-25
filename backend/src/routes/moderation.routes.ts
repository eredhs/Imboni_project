import { Router } from "express";
import { getModerationDashboard, getRecentActivities } from "../controllers/moderation.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRoles } from "../middleware/authorization.js";

const moderationRouter = Router();

moderationRouter.get("/dashboard", authMiddleware, requireRoles("system_controller"), getModerationDashboard);
moderationRouter.get("/activities", authMiddleware, requireRoles("system_controller"), getRecentActivities);

export default moderationRouter;
