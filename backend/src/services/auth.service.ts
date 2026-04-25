import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";
import type { UserRecord } from "../data/seed.js";
import { HttpError } from "../utils/http-error.js";

type PublicUser = Omit<UserRecord, "passwordHash" | "refreshTokens">;

const accessExpiry = "15m";
const refreshExpiry = "7d";

function toPublicUser(user: UserRecord): PublicUser {
  const { passwordHash: _passwordHash, refreshTokens: _refreshTokens, ...safeUser } = user;
  return safeUser;
}

async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  return UserModel.findOne({ email: normalizedEmail }).lean<UserRecord | null>();
}

async function findUserById(id: string) {
  return UserModel.findOne({ id }).lean<UserRecord | null>();
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  organization: string;
  location?: string;
  role?: "recruiter" | "job_seeker";
}) {
  const normalizedEmail = input.email.toLowerCase().trim();

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new HttpError(409, "An account with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const newUser: UserRecord = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: input.name.trim(),
    role: input.role?.trim() || "recruiter",
    organization: input.organization.trim(),
    location: input.location?.trim(),
    passwordHash,
    refreshTokens: [],
  };

  await UserModel.create(newUser);

  const tokens = issueTokens(newUser);
  await UserModel.updateOne(
    { id: newUser.id },
    { $push: { refreshTokens: tokens.refreshToken } },
  );

  return {
    user: toPublicUser(newUser),
    ...tokens,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
  role?: "recruiter" | "job_seeker" | "system_controller";
}) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  if (typeof user.passwordHash !== "string" || !user.passwordHash) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new HttpError(401, "Invalid email or password.");
  }

  if (input.role && user.role !== input.role) {
    throw new HttpError(403, `This account is registered as ${user.role.replaceAll("_", " ")}.`);
  }

  const tokens = issueTokens(user);
  await UserModel.updateOne(
    { id: user.id },
    { $push: { refreshTokens: tokens.refreshToken } },
  );

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
    sub: string;
    email: string;
  };

  const user = await findUserById(payload.sub);
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new HttpError(401, "Invalid refresh token.");
  }

  return {
    accessToken: jwt.sign({ email: user.email }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: accessExpiry,
    }),
  };
}

export async function getUserById(id: string) {
  const user = await findUserById(id);
  return user ? toPublicUser(user) : null;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as {
    sub: string;
    email: string;
  };
}

function issueTokens(user: UserRecord) {
  const accessToken = jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: accessExpiry,
  });
  const refreshToken = jwt.sign({ email: user.email }, env.JWT_REFRESH_SECRET, {
    subject: user.id,
    expiresIn: refreshExpiry,
  });

  return {
    accessToken,
    refreshToken,
  };
}
