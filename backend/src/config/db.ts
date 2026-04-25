import mongoose from "mongoose";
import { env } from "./env.js";

let connected = false;
let connectionAttemptInFlight = false;
let retryTimer: NodeJS.Timeout | null = null;
let announcedFallback = false;
let lastConnectionError = "";
const RETRY_INTERVAL_MS = 30_000;
let onMongoReady: null | (() => Promise<void>) = null;

function getConnectionHint(message: string) {
  if (
    message.includes("querySrv") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED")
  ) {
    return "SRV/DNS lookup failed. Verify MONGODB_URI and DNS settings.";
  }

  if (message.includes("ETIMEDOUT")) {
    return "MongoDB hosts unreachable. Check network access list, firewall, and VPN settings.";
  }

  if (message.includes("bad auth") || message.includes("Authentication failed")) {
    return "Authentication failed. Verify username, password, and authSource.";
  }

  return "Verify MONGODB_URI configuration and database availability.";
}

/**
 * Get current data mode (MongoDB-only)
 */
export function getDataMode() {
  return "mongo" as const;
}

export function registerMongoReadyHandler(handler: () => Promise<void>) {
  onMongoReady = handler;
}

function clearRetryTimer() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

function scheduleReconnect() {
  if (retryTimer) {
    return;
  }

  retryTimer = setTimeout(() => {
    retryTimer = null;
    void connectDb({ silentFallback: true });
  }, RETRY_INTERVAL_MS);
}

type ConnectDbOptions = {
  silentFallback?: boolean;
};

export async function connectDb(options: ConnectDbOptions = {}) {
  if (connected || connectionAttemptInFlight) {
    return;
  }

  connectionAttemptInFlight = true;
  console.log("[db] connecting to MongoDB Atlas...");

  try {
    const connDisplay = env.MONGODB_URI.includes("@")
      ? env.MONGODB_URI.split("@")[1]
      : env.MONGODB_URI.substring(0, 50) + "...";

    console.log(`[db] target: ${connDisplay}`);

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryWrites: true,
    });

    connected = true;
    if (onMongoReady) {
      await onMongoReady();
    }
    announcedFallback = false;
    lastConnectionError = "";
    clearRetryTimer();
    console.log("[db] ✅ MongoDB connected");
    console.log("[db] 🗄️  Production mode: MongoDB Atlas");
  } catch (error) {
    connected = false;
    connectionAttemptInFlight = false;
    const message = error instanceof Error ? error.message : String(error);
    lastConnectionError = message;
    const hint = getConnectionHint(message);

    if (!options.silentFallback && !announcedFallback) {
      announcedFallback = true;
      console.error("\n❌ [db] MongoDB connection failed:");
      console.error(`   Error: ${message}`);
      console.error(`   Hint: ${hint}`);
      console.error("\n   System requires MongoDB to function.");
      console.error("   Next retry in 30 seconds...\n");
    }

    scheduleReconnect();
    throw new Error(
      `MongoDB required but unavailable. ${hint}. Check .env MONGODB_URI.`
    );
  }
}

export async function disconnectDb() {
  clearRetryTimer();
  if (connected) {
    await mongoose.disconnect();
    connected = false;
    connectionAttemptInFlight = false;
    console.log("[db] disconnected");
  }
}

export function getLastDbError() {
  return lastConnectionError;
}
