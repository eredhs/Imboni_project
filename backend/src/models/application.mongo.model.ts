import { Schema, model } from "mongoose";

const applicationEventSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: String, required: true },
    actorType: { type: String, required: true },
    actorId: { type: String, required: true },
    message: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const applicationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    hrId: { type: String, required: true, index: true },
    status: { type: String, required: true },
    appliedAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    candidateProfile: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      location: { type: String },
      currentRole: { type: String },
      yearsOfExperience: { type: Number },
      linkedinUrl: { type: String },
      portfolioUrl: { type: String },
      expectedSalary: { type: String },
      availableFrom: { type: String },
      workAuthorization: { type: String },
      professionalSummary: { type: String },
    },
    resume: {
      fileName: { type: String },
      mimeType: { type: String },
      fileSize: { type: Number },
      url: { type: String },
      extractedText: { type: String },
    },
    screeningScore: { type: Number },
    screeningStatus: { type: String },
    screeningDate: { type: String },
    notes: { type: [String], default: [] },
    interviewScheduledAt: { type: String },
    rejectionReason: { type: String },
    offerDetails: {
      salary: { type: Number },
      startDate: { type: String },
      benefits: { type: [String], default: [] },
    },
    timeline: { type: [applicationEventSchema], default: [] },
  },
  {
    versionKey: false,
  },
);

const notificationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userType: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntityId: { type: String, required: true },
    relatedEntityType: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
    actionUrl: { type: String },
  },
  {
    versionKey: false,
  },
);

export const ApplicationMongoModel = model("Application", applicationSchema);
export const NotificationModel = model("Notification", notificationSchema);
