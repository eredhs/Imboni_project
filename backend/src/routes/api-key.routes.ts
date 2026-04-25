import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  generateApiKey,
  verifyApiKey,
  listApiKeys,
  revokeApiKey,
  deleteApiKey,
} from "../services/api-key.service.js";

const router = Router();

/**
 * POST /api/api-keys
 * Generate a new API key
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, expiresAt } = req.body;
    const hrId = req.user?.id;

    if (!hrId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "API key name is required" });
      return;
    }

    const apiKey = await generateApiKey(
      hrId,
      name,
      expiresAt ? new Date(expiresAt) : undefined
    );

    res.status(201).json({
      message: "API key generated successfully. Save it now - you won't see it again!",
      data: apiKey,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/api-keys
 * List all API keys for the current user
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const hrId = req.user?.id;

    if (!hrId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const keys = await listApiKeys(hrId);

    res.json({
      data: keys,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/api-keys/:keyId/revoke
 * Revoke/deactivate an API key
 */
router.patch(
  "/:keyId/revoke",
  authMiddleware,
  async (req: Request<{ keyId: string }>, res: Response) => {
    try {
      const { keyId } = req.params;
      const hrId = req.user?.id;

      if (!hrId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await revokeApiKey(keyId, hrId);

      res.json({
        message: "API key revoked successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /api/api-keys/:keyId
 * Delete an API key permanently
 */
router.delete(
  "/:keyId",
  authMiddleware,
  async (req: Request<{ keyId: string }>, res: Response) => {
    try {
      const { keyId } = req.params;
      const hrId = req.user?.id;

      if (!hrId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await deleteApiKey(keyId, hrId);

      res.json({
        message: "API key deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
