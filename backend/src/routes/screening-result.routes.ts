import { Router } from "express";
import { updateScreeningAction } from "../controllers/screening-result.controller.js";
import { requireRoles } from "../middleware/authorization.js";

export const screeningResultRouter = Router();

screeningResultRouter.patch("/:id/action", requireRoles("recruiter", "system_controller"), updateScreeningAction);
