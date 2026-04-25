import { Schema, model } from "mongoose";

const screeningRunSchema = new Schema(
  {
    runId: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    status: { type: String, required: true },
    progress: {
      done: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    message: { type: String, required: true },
    startedAt: { type: Number, required: true },
    completedAt: { type: Number },
    timeTakenSeconds: { type: Number },
    biasResult: { type: Schema.Types.Mixed },
    poolIntelligence: { type: String },
  },
  {
    versionKey: false,
  },
);

const screeningResultSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    location: { type: String, required: true },
    currentRole: { type: String, required: true },
    yearsExperience: { type: Number, required: true },
    score: { type: Number, required: true },
    status: { type: String, required: true },
    confidence: { type: String, required: true },
    confidenceScore: { type: Number },
    skills: { type: [String], default: [] },
    gap: { type: String, required: true },
    quote: { type: String, required: true },
    overview: { type: String, required: true },
    reasoning: { type: String, required: true },
    recommendation: { type: String, required: true },
    verifiedExpertise: { type: Boolean, default: false },
    topCandidateLabel: { type: String, required: true },
    scoreBreakdown: { type: [Schema.Types.Mixed], default: [] },
    talentProfile: { type: Schema.Types.Mixed, required: true },
    action: { type: String, default: "pending" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    versionKey: false,
  },
);

export const ScreeningRunModel = model("ScreeningRun", screeningRunSchema);
export const ScreeningResultModel = model("ScreeningResult", screeningResultSchema);
