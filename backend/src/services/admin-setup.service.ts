import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { HttpError } from "../utils/http-error.js";

export interface AdminSetupRequest {
  email: string;
  password: string;
  name: string;
  organization?: string;
}

/**
 * Creates a system controller admin account for initial setup.
 * This is the primary method for initializing a fresh MongoDB instance.
 */
export async function createSystemController(input: AdminSetupRequest) {
  if (!input.email || !input.password || input.password.length < 8) {
    throw new HttpError(400, "Email and password (min 8 chars) are required");
  }

  const normalizedEmail = input.email.toLowerCase().trim();
  const existing = await UserModel.findOne({ email: normalizedEmail });

  if (existing) {
    throw new HttpError(
      409,
      "An account with that email already exists. Delete it first if you need to recreate it."
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const systemController = {
    id: `admin-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    role: "system_controller" as const,
    organization: input.organization?.trim() || "IMBONI Administration",
    passwordHash,
    refreshTokens: [],
  };

  await UserModel.create(systemController);

  return {
    id: systemController.id,
    email: systemController.email,
    name: systemController.name,
    role: systemController.role,
    message: "System controller account created successfully",
  };
}

/**
 * Creates a recruiter/HR account
 */
export async function createRecruiter(input: AdminSetupRequest) {
  if (!input.email || !input.password || input.password.length < 8) {
    throw new HttpError(400, "Email and password (min 8 chars) are required");
  }

  const normalizedEmail = input.email.toLowerCase().trim();
  const existing = await UserModel.findOne({ email: normalizedEmail });

  if (existing) {
    throw new HttpError(409, "An account with that email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const recruiter = {
    id: `recruiter-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    role: "recruiter" as const,
    organization: input.organization?.trim() || "My Organization",
    passwordHash,
    refreshTokens: [],
  };

  await UserModel.create(recruiter);

  return {
    id: recruiter.id,
    email: recruiter.email,
    name: recruiter.name,
    role: recruiter.role,
    message: "Recruiter account created successfully",
  };
}

/**
 * Lists all system controllers (for admin verification)
 */
export async function listSystemControllers() {
  const controllers = await UserModel.find({ role: "system_controller" }).select(
    "id email name organization createdAt"
  );
  return controllers;
}

/**
 * Checks if any system controller exists
 */
export async function hasSystemControllers(): Promise<boolean> {
  const count = await UserModel.countDocuments({ role: "system_controller" });
  return count > 0;
}
