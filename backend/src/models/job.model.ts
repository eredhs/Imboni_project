import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    hrId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    seniority: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    applicantCount: { type: Number, default: 0 },
    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    minExperienceYears: { type: Number, default: 0 },
    educationLevel: { type: String, required: true },
    screeningStatus: { type: String, required: true },
    topScore: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    applicationDeadline: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const JobModel = model("Job", jobSchema);
