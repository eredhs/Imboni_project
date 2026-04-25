import { Router } from "express";
import {
  createJob,
  getAiSkillSuggestions,
  getJobs,
  getSeekerJobs,
  updateJob,
} from "../controllers/job.controller.js";
import {
  deleteApplicant,
  getApplicants,
  uploadApplicants,
} from "../controllers/applicant.controller.js";
import {
  screeningResults,
  screeningStatus,
  startScreening,
  compareCandidates,
} from "../controllers/screening.controller.js";
import { requireRoles } from "../middleware/authorization.js";
import { upload } from "../middleware/upload.js";

export const jobRouter = Router();

jobRouter.get("/", requireRoles("recruiter", "system_controller"), getJobs);
jobRouter.get("/seeker/browse", requireRoles("job_seeker", "system_controller"), getSeekerJobs);
jobRouter.post("/", requireRoles("recruiter", "system_controller"), createJob);
jobRouter.put("/:id", requireRoles("recruiter", "system_controller"), updateJob);
jobRouter.post("/ai-suggest", requireRoles("recruiter", "system_controller"), getAiSkillSuggestions);
jobRouter.get("/:id/applicants", requireRoles("recruiter", "system_controller"), getApplicants);
jobRouter.post(
  "/:id/applicants/upload",
  requireRoles("recruiter", "system_controller"),
  upload.array("files", 500),
  uploadApplicants,
);
jobRouter.delete("/:id/applicants/:applicantId", requireRoles("recruiter", "system_controller"), deleteApplicant);
jobRouter.post("/:id/screening/trigger", requireRoles("recruiter", "system_controller"), startScreening);
jobRouter.get("/:id/screening/status", requireRoles("recruiter", "system_controller"), screeningStatus);
jobRouter.get("/:id/screening/results", requireRoles("recruiter", "system_controller"), screeningResults);
jobRouter.post("/:id/screening/compare", requireRoles("recruiter", "system_controller"), compareCandidates);
