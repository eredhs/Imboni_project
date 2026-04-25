import type { NextFunction, Request, Response } from "express";
import { applicationService } from "../services/application.service.js";

type AppRole = "recruiter" | "job_seeker" | "system_controller";

function hasRole(request: Request, allowedRoles: readonly AppRole[]) {
  const role = request.user?.role;
  return typeof role === "string" && allowedRoles.includes(role as AppRole);
}

function deny(response: Response) {
  response.status(403).json({ message: "Forbidden." });
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function requireRoles(...allowedRoles: AppRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }

    if (!hasRole(request, allowedRoles)) {
      deny(response);
      return;
    }

    next();
  };
}

export function requireSelfOrRoles(paramName: string, ...allowedRoles: AppRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }

    const paramValue = firstParam(request.params[paramName]);
    if (request.user.id === paramValue || hasRole(request, allowedRoles)) {
      next();
      return;
    }

    deny(response);
  };
}

export function requireBodyUserMatchOrRoles(fieldName: string, ...allowedRoles: AppRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }

    const fieldValue = typeof request.body?.[fieldName] === "string" ? request.body[fieldName] : "";
    if (request.user.id === fieldValue || hasRole(request, allowedRoles)) {
      next();
      return;
    }

    deny(response);
  };
}

export function requireApplicationParticipantOrRoles(...allowedRoles: AppRole[]) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }

    const applicationId = firstParam(request.params.applicationId);
    const application = await applicationService.getApplication(applicationId);

    if (!application) {
      response.status(404).json({ error: "Application not found" });
      return;
    }

    if (
      request.user.id === application.userId ||
      request.user.id === application.hrId ||
      hasRole(request, allowedRoles)
    ) {
      next();
      return;
    }

    deny(response);
  };
}

export function requireApplicationHrAccess(...allowedRoles: AppRole[]) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }

    const applicationId = firstParam(request.params.applicationId);
    const application = await applicationService.getApplication(applicationId);

    if (!application) {
      response.status(404).json({ error: "Application not found" });
      return;
    }

    if (request.user.id === application.hrId || hasRole(request, allowedRoles)) {
      next();
      return;
    }

    deny(response);
  };
}
