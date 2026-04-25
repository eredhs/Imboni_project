import { Router } from "express";
import {
  addCandidateNote,
  getCandidateDetail,
} from "../controllers/candidate.controller.js";
import { requireRoles } from "../middleware/authorization.js";

export const candidateRouter = Router();

candidateRouter.get("/:id/detail", requireRoles("recruiter", "system_controller"), getCandidateDetail);
candidateRouter.post("/:id/notes", requireRoles("recruiter", "system_controller"), addCandidateNote);
