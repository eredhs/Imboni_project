import { Schema, model } from "mongoose";

const candidateNoteSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    candidateId: { type: String, required: true, index: true },
    recruiterName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const CandidateNoteModel = model("CandidateNote", candidateNoteSchema);
