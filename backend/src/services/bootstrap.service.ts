import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";

/**
 * MongoDB-only bootstrap - ensures system controller exists via environment variables.
 * All other data is created through the application API after setup.
 * This keeps the system clean and prevents demo data from polluting production.
 */
export async function bootstrapMongoData() {
  console.log("[bootstrap] Starting MongoDB bootstrap (production mode)");

  // Ensure system controller account if credentials are provided
  if (env.SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL && env.SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD) {
    try {
      const normalizedEmail = env.SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL.toLowerCase().trim();
      const existing = await UserModel.findOne({ email: normalizedEmail });

      if (existing) {
        console.log(`[bootstrap] ✓ System controller account already exists: ${normalizedEmail}`);
      } else {
        const bcrypt = await import("bcryptjs");
        const passwordHash = await bcrypt.hash(env.SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD, 12);

        await UserModel.create({
          id: `admin-bootstrap-${Date.now()}`,
          email: normalizedEmail,
          name: env.SYSTEM_CONTROLLER_BOOTSTRAP_NAME ?? "System Controller",
          role: "system_controller",
          organization: "IMBONI Administration",
          passwordHash,
          refreshTokens: [],
        });

        console.log(
          `[bootstrap] ✓ Created system controller account: ${normalizedEmail}`
        );
      }
    } catch (error) {
      console.error(
        "[bootstrap] ✗ Failed to bootstrap system controller:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  } else {
    console.log(
      "[bootstrap] ⓘ No system controller credentials in env - setup required via POST /api/admin/setup"
    );
  }

  console.log("[bootstrap] ✓ Bootstrap complete - ready for production");
}
