import { Schema, model } from "mongoose";

interface IApiKey {
  hrId: string;
  name: string;
  key: string; // Hashed API key
  prefix: string; // First 8 chars of key for display
  lastUsed?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    hrId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      description: "User-friendly name for the API key",
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    prefix: {
      type: String,
      required: true,
      description: "First 8 chars of key for display purposes",
    },
    lastUsed: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      description: "Optional expiration date",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ApiKey = model<IApiKey>("ApiKey", apiKeySchema);
