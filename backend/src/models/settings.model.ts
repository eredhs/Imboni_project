import { Schema, model } from "mongoose";

const teamMemberSchema = new Schema(
  {
    id: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    joinedAt: { type: String, required: true },
  },
  { _id: false },
);

const settingsSchema = new Schema(
  {
    hrId: { type: String, required: true, unique: true, index: true },
    scoringWeights: {
      skills: { type: Number, default: 40 },
      experience: { type: Number, default: 25 },
      communication: { type: Number, default: 20 },
      cultureFit: { type: Number, default: 15 },
    },
    notificationPreferences: {
      emailOnApplication: { type: Boolean, default: true },
      emailOnScreeningComplete: { type: Boolean, default: true },
      emailOnShortlist: { type: Boolean, default: true },
      emailOnOffer: { type: Boolean, default: true },
      slackIntegration: { type: Boolean, default: false },
    },
    biasDetectionSettings: {
      enableRealTimeAlerts: { type: Boolean, default: true },
      educationUniformityGuard: { type: Boolean, default: true },
      experienceClustering: { type: Boolean, default: false },
    },
    shortlistDefaults: {
      shortlistSize: { type: Number, default: 10 },
      autoRescreen: { type: Boolean, default: true },
    },
    teamSettings: {
      members: { type: [teamMemberSchema], default: [] },
    },
    integrations: {
      slack: {
        connected: { type: Boolean, default: false },
        webhookUrl: { type: String },
      },
      zapier: {
        connected: { type: Boolean, default: false },
        apiKey: { type: String },
      },
      airtable: {
        connected: { type: Boolean, default: false },
        baseId: { type: String },
      },
    },
  },
  {
    versionKey: false,
  },
);

export const SettingsModel = model("Settings", settingsSchema);
