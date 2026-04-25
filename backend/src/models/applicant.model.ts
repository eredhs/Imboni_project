import { Schema, model } from "mongoose";

const applicantSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    applicationId: { type: String, index: true },
    fullName: { type: String, required: true },
    location: { type: String, required: true },
    currentRole: { type: String, required: true },
    yearsExperience: { type: Number, required: true },
    score: { type: Number, required: true },
    status: { type: String, required: true },
    confidence: { type: String, required: true },
    skills: { type: [String], default: [] },
    email: { type: String },
    talentProfile: { type: Schema.Types.Mixed, required: true },
    candidateProfile: { type: Schema.Types.Mixed },
    resume: {
      fileName: { type: String },
      mimeType: { type: String },
      fileSize: { type: Number },
      url: { type: String },
      extractedText: { type: String },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    versionKey: false,
  },
);

export const ApplicantModel = model("Applicant", applicantSchema);
