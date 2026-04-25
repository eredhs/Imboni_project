import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Test MongoDB Atlas Connection
 * Run this to verify your connection is working
 * Usage: npx ts-node scripts/test-mongo-connection.ts
 */

async function testConnection() {
  console.log("🔍 Testing MongoDB Atlas Connection...\n");

  try {
    // Check if connection string is valid
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in .env file");
    }

    // Mask the password in the display URI
    const displayUri = env.MONGODB_URI.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://[username]:[password]@"
    );

    console.log("📍 Connection String:", displayUri);
    console.log("🔄 Connecting...\n");

    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ Successfully connected to MongoDB Atlas!\n");

    // Get connection info
    const connection = mongoose.connection;
    console.log("📊 Connection Details:");
    console.log(`   Host: ${connection.host}`);
    console.log(`   Port: ${connection.port}`);
    console.log(`   Database: ${connection.db?.databaseName}`);
    console.log(`   Ready State: ${connection.readyState === 1 ? "Connected" : "Disconnected"}\n`);

    // Test a simple operation
    console.log("🧪 Testing database operations...");
    const testDb = connection.db;
    const adminDb = testDb?.admin();
    const serverStatus = await adminDb?.serverStatus();

    if (serverStatus) {
      console.log("✅ Database operations successful!\n");
      console.log("📈 Server Status:");
      console.log(`   Uptime: ${serverStatus.uptime} seconds`);
      console.log(`   Current Connections: ${serverStatus.connections?.current || "N/A"}\n`);
    }

    console.log("🎉 All tests passed! Your MongoDB Atlas connection is working perfectly.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection Failed!\n");

    if (error instanceof Error) {
      console.error("Error:", error.message);

      // Provide specific troubleshooting
      if (error.message.includes("ENOTFOUND")) {
        console.error("\n💡 Troubleshooting: DNS lookup failed");
        console.error("   - Check your internet connection");
        console.error("   - Verify cluster name in connection string");
      } else if (error.message.includes("ETIMEDOUT")) {
        console.error("\n💡 Troubleshooting: Connection timeout");
        console.error("   - Add your IP to MongoDB Atlas Network Access");
        console.error("   - Check your firewall settings");
        console.error("   - Verify cluster is not paused");
      } else if (error.message.includes("Authentication failed") || error.message.includes("bad auth")) {
        console.error("\n💡 Troubleshooting: Authentication error");
        console.error("   - Check username and password");
        console.error("   - Verify special characters are URL-encoded");
        console.error("   - Check database user exists in MongoDB Atlas");
      }
    }

    process.exit(1);
  }
}

testConnection();
