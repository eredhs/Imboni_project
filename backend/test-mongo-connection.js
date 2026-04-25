// Quick MongoDB Atlas connection test
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const configDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(configDir, '.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentlens';

console.log('🔍 Testing MongoDB connection...\n');
console.log('Connection URI (password hidden):', mongoUri.replace(/:[^:/@]+@/, ':****@'));
console.log('');

async function testConnection() {
  try {
    console.log('⏳ Attempting to connect...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📦 Collections found: ${collections.length}`);
    collections.forEach(c => console.log(`   - ${c.name}`));
    
    process.exit(0);
  } catch (error) {
    console.log('❌ FAILED to connect');
    console.log('Error:', error.message);
    console.log('');
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 FIX: DNS lookup failed');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the MongoDB URI is correct');
      console.log('   3. Try using a direct IP instead of SRV record');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('💡 FIX: Connection timeout');
      console.log('   1. Add your IP to Atlas Network Access');
      console.log('   2. Check your firewall/VPN settings');
      console.log('   3. Verify Atlas cluster is running (not paused)');
    } else if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.log('💡 FIX: Authentication failed');
      console.log('   1. Verify username and password are correct');
      console.log('   2. Check if the database user exists in Atlas');
      console.log('   3. Reset the password if needed');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 FIX: Connection refused');
      console.log('   1. Verify Atlas cluster is running');
      console.log('   2. Check Network Access whitelist');
      console.log('   3. Try allowing access from 0.0.0.0/0 (any IP)');
    }
    
    process.exit(1);
  }
}

testConnection();
