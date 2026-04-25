import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { getDataMode } from "./config/db.js";
import { authRouter } from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.js";
import { candidateRouter } from "./routes/candidate.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { jobRouter } from "./routes/job.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { screeningResultRouter } from "./routes/screening-result.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { applicationRouter } from "./routes/application.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import adminRouter from "./routes/admin.routes.js";
import moderationRouter from "./routes/moderation.routes.js";
import apiKeyRouter from "./routes/api-key.routes.js";

export function createApp() {
  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadsDir = path.resolve(__dirname, "../uploads");

  app.use(
    cors({
      origin: env.NODE_ENV === "development" ? true : env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use("/uploads", express.static(uploadsDir));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      mode: getDataMode(),
      configuredMode: env.DATA_MODE,
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/applications", authMiddleware, applicationRouter);
  app.use("/api/notifications", authMiddleware, notificationRouter);
  app.use("/api/stats", authMiddleware, statsRouter);
  app.use("/api/admin", authMiddleware, adminRouter);
  app.use("/api/moderation", authMiddleware, moderationRouter);
  app.use("/api/dashboard", authMiddleware, dashboardRouter);
  app.use("/api/candidates", authMiddleware, candidateRouter);
  app.use("/api/screening-results", authMiddleware, screeningResultRouter);
  app.use("/api/jobs", authMiddleware, jobRouter);
  app.use("/api/reports", authMiddleware, reportsRouter);
  app.use("/api/settings", authMiddleware, settingsRouter);
  app.use("/api/api-keys", authMiddleware, apiKeyRouter);

  app.use(errorHandler);

  return app;
}
