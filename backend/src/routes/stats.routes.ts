import { Router } from "express";
import { getDashboardStats, getActivityLog } from "../controllers/stats.controller.js";
import { requireSelfOrRoles } from "../middleware/authorization.js";

export const statsRouter = Router();

statsRouter.get("/dashboard/:hrId", requireSelfOrRoles("hrId", "system_controller"), getDashboardStats);
statsRouter.get("/activity/:hrId", requireSelfOrRoles("hrId", "system_controller"), getActivityLog);
