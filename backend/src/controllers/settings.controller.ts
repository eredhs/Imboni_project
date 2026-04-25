import { Request, Response } from "express";
import {
  getHRSettings,
  updateHRSettings,
  updateScoringWeights,
  updateNotificationPreferences,
  addTeamMember,
  removeTeamMember,
} from "../services/settings.service.js";

function getAuthUserId(req: Request): string | null {
  return req.user?.id ?? null;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export async function getSettings(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const settings = await getHRSettings(hrId);
    res.json({ success: true, data: settings });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const updates = req.body;
    const settings = await updateHRSettings(hrId, updates);
    res.json({ success: true, data: settings });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function updateScoring(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const { weights } = req.body;
    const settings = await updateScoringWeights(hrId, weights);
    res.json({ success: true, data: settings.scoringWeights });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function updateNotifications(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const { preferences } = req.body;
    const settings = await updateNotificationPreferences(hrId, preferences);
    res.json({ success: true, data: settings.notificationPreferences });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function getTeamMembers(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const settings = await getHRSettings(hrId);
    res.json({ success: true, data: settings.teamSettings.members });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function createTeamMember(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const { email, name, role } = req.body;
    const member = {
      id: `tm-${Date.now()}`,
      email,
      name,
      role,
      joinedAt: new Date().toISOString(),
    };
    const settings = await addTeamMember(hrId, member);
    res.json({ success: true, data: member });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function deleteTeamMember(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const memberId = firstParam(req.params.memberId);
    const settings = await removeTeamMember(hrId, memberId);
    res.json({ success: true, data: settings.teamSettings.members });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}

export async function updateBiasDetection(req: Request, res: Response) {
  try {
    const hrId = getAuthUserId(req);
    if (!hrId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const settings = await getHRSettings(hrId);
    const updated = await updateHRSettings(hrId, {
      ...settings,
      biasDetectionSettings: req.body,
    });
    res.json({ success: true, data: updated.biasDetectionSettings });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
}
