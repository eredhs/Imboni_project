import { Router } from "express";
import {
  getCurrentUser,
  login,
  refresh,
  register,
  verifyAdminKey,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/admin/verify-key", verifyAdminKey);
authRouter.get("/me", authMiddleware, getCurrentUser);
