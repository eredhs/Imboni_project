import { Request, Response, NextFunction } from "express";
import { verifyApiKey } from "../services/api-key.service.js";

/**
 * Authenticate using API key from Authorization header
 * Format: Authorization: Bearer imb_xxxxxxxxxxxx
 */
export async function apiKeyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }

    const apiKey = authHeader.substring(7); // Remove "Bearer "

    const apiKeyDoc = await verifyApiKey(apiKey);

    if (!apiKeyDoc) {
      res.status(401).json({ error: "Invalid or expired API key" });
      return;
    }

    // Attach user hrId to request for API key based auth
    req.user = {
      id: apiKeyDoc.hrId,
      email: "",
      role: "recruiter",
      name: "API Client",
      organization: "",
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
}
