import type { Request, Response } from "express";
import { updateCandidateActionById } from "../services/talent.service.js";

const allowedActions = new Set(["approved", "rejected", "flagged"]);

export async function updateScreeningAction(request: Request, response: Response) {
  const candidateId = String(request.params.id ?? "");
  const action = String(request.body?.action ?? "");

  if (!allowedActions.has(action)) {
    response.status(400).json({ message: "Invalid action." });
    return;
  }

  await updateCandidateActionById(
    candidateId,
    action as "approved" | "rejected" | "flagged",
  );

  response.json({
    id: candidateId,
    action,
  });
}
