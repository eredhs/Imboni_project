import { createApp } from "./app.js";
import { connectDb, registerMongoReadyHandler, getDataMode } from "./config/db.js";
import { env } from "./config/env.js";
import { bootstrapMongoData } from "./services/bootstrap.service.js";

async function startServer() {
  console.log("\n=== 🚀 TalentLens Backend Starting ===");
  console.log(`[server] DATA_MODE configured: ${env.DATA_MODE}`);
  console.log(`[server] NODE_ENV: ${env.NODE_ENV}`);
  
  registerMongoReadyHandler(async () => {
    console.log("[server] bootstrapping data...");
    await bootstrapMongoData();
    console.log("[server] data bootstrap completed");
  });

  console.log("[server] attempting database connection...");
  await connectDb();
  
  const dbMode = getDataMode();
  console.log(`[server] database mode: ${dbMode}`);
  
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`\n[server] ✅ Server running on port ${env.PORT}`);
    console.log(`[server] mode: ${dbMode}`);
    console.log(`[server] ready to accept requests\n`);
  });
}

startServer().catch((error) => {
  console.error("\n[server] ❌ Failed to start", error);
  process.exit(1);
});
