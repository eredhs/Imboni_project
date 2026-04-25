import { Router } from "express";
import { getAdminStats, getPlatformInsights, verifyAdminKey } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRoles } from "../middleware/authorization.js";

const adminRouter = Router();

adminRouter.post("/verify-key", verifyAdminKey);
adminRouter.get("/stats", authMiddleware, requireRoles("system_controller"), getAdminStats);
adminRouter.get("/insights", authMiddleware, requireRoles("system_controller"), getPlatformInsights);

export default adminRouter;
