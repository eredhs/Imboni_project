import type { NextFunction, Request, Response } from "express";
import { getUserById, verifyAccessToken } from "../services/auth.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof getUserById>>;
    }
  }
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void | Promise<void> {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    Promise.resolve(getUserById(payload.sub))
      .then((user) => {
        request.user = user;
        next();
      })
      .catch(() => {
        response.status(401).json({ message: "Invalid or expired token." });
      });
  } catch (_error) {
    response.status(401).json({ message: "Invalid or expired token." });
  }
}
