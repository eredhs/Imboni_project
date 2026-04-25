import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];

    response.status(400).json({
      message: firstIssue?.message || "Invalid request payload.",
    });
    return;
  }

  if (isMongoDuplicateKeyError(error)) {
    response.status(409).json({
      message: "An account with that email already exists.",
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message:
      env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Internal server error",
  });
}

function isMongoDuplicateKeyError(
  error: unknown,
): error is { code: number; keyPattern?: Record<string, unknown> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}
