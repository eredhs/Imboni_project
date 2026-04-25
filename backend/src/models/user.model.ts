import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String, required: true },
    location: { type: String },
    passwordHash: { type: String, required: true },
    refreshTokens: { type: [String], default: [] },
  },
  {
    versionKey: false,
  },
);

export const UserModel = model("User", userSchema);
