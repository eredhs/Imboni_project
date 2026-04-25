import type { Request, Response } from "express";
import {
  addCandidateNote as saveCandidateNote,
  getCandidateDetailById,
  getCandidateNotes,
} from "../services/talent.service.js";

export async function getCandidateDetail(request: Request, response: Response) {
  const candidate = await getCandidateDetailById(String(request.params.id ?? ""));

  if (!candidate) {
    response.status(404).json({ message: "Candidate not found." });
    return;
  }

  response.json({
    ...candidate,
    notes: await getCandidateNotes(candidate.id),
  });
}

export async function addCandidateNote(request: Request, response: Response) {
  const candidateId = String(request.params.id ?? "");
  const recruiterName = request.user?.name ?? "Recruiter";
  const text = String(request.body?.text ?? "").trim();

  if (!text) {
    response.status(400).json({ message: "Note text is required." });
    return;
  }

  const note = await saveCandidateNote(candidateId, recruiterName, text);

  response.status(201).json(note);
}
