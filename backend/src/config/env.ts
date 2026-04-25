import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const configDir = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(configDir, "../../.env") });

const resolvedMongoUri =
  process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/talentlens";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATA_MODE: z.enum(["seed", "mongo"]).default("seed"),
  MONGODB_URI: z.string().default(resolvedMongoUri),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  GEMINI_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3001"),
  ADMIN_SECRET_KEY: z.string().min(1, "ADMIN_SECRET_KEY is required"),
  SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL: z.string().email().optional(),
  SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD: z.string().min(8).optional(),
  SYSTEM_CONTROLLER_BOOTSTRAP_NAME: z.string().min(2).optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse({
  ...process.env,
  MONGODB_URI: resolvedMongoUri,
});
