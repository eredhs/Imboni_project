import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env");
  process.exit(1);
}

console.log("🔍 Testing MongoDB connection...");
console.log(`📍 Target: ${MONGODB_URI.split("@")[1] || MONGODB_URI.substring(0, 50) + "..."}`);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connection successful!");
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error instanceof Error ? error.message : error);
    
    if (error.message.includes("ENOTFOUND")) {
      console.error("\n💡 Fix: Check DNS/network - MongoDB Atlas hosts unreachable");
      console.error("   - Check internet connection");
      console.error("   - If behind VPN, ensure it's connected");
      console.error("   - Check firewall settings");
    } else if (error.message.includes("bad auth")) {
      console.error("\n💡 Fix: Authentication failed - check username/password in MONGODB_URI");
    } else if (error.message.includes("ETIMEDOUT")) {
      console.error("\n💡 Fix: Connection timeout - check MongoDB Atlas IP whitelist");
      console.error("   - Add your IP to MongoDB Atlas network access");
    }
    
    process.exit(1);
  }
})();
