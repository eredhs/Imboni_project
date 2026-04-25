import type { Request, Response } from "express";
import { z } from "zod";
import {
  getUserById,
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";
import { env } from "../config/env.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  organization: z.string().min(2),
  location: z.string().optional(),
  role: z.enum(["recruiter", "job_seeker"]).optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["recruiter", "job_seeker", "system_controller"]).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

const adminKeySchema = z.object({
  secretKey: z.string(),
});

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  const result = await registerUser(input);
  response.status(201).json(result);
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await loginUser(input);
  response.json(result);
}

export async function refresh(request: Request, response: Response) {
  const { refreshToken } = refreshSchema.parse(request.body);
  response.json(await refreshAccessToken(refreshToken));
}

export async function getCurrentUser(request: Request, response: Response) {
  if (!request.user) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  response.json(await getUserById(request.user.id));
}

export async function verifyAdminKey(request: Request, response: Response) {
  try {
    const { secretKey } = request.body;
    
    if (!secretKey || typeof secretKey !== 'string') {
      response.status(400).json({ message: "secretKey is required" });
      return;
    }
    
    const expectedKey = env.ADMIN_SECRET_KEY;
    const isValid = secretKey === expectedKey;
    
    response.json({ valid: isValid });
  } catch (error: any) {
    console.error('verifyAdminKey error:', error);
    response.status(400).json({ message: "Invalid request", error: error.message });
  }
}
