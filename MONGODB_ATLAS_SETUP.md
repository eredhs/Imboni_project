# MongoDB Atlas Setup Guide - Step by Step

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (top right)
3. Fill in your information:
   - Email address
   - Password (strong password)
   - Company name (optional)
   - Accept terms and click **"Create your Atlas account"**
4. Verify your email address (check your inbox)
5. Login to MongoDB Atlas

---

## Step 2: Create Your First Cluster

1. After login, you'll see the **"Create a Deployment"** page
2. Click **"Build a Database"**
3. Choose **"M0 (Free)"** tier (perfect for development)
4. Click **"Create"**
5. Select your region (choose closest to your location) - **AWS recommended**
6. Cluster name: `imboni-development` (or any name)
7. Click **"Create Deployment"**
8. Wait 2-5 minutes for cluster to be created ⏳

---

## Step 3: Set Up Database Access (Username & Password)

1. After cluster creation, you'll see **"Security Quickstart"**
2. Create a database user:
   - **Username**: `imboni_user` (recommended)
   - **Password**: Create a strong password (save it!)
     - Use special characters: `@!#$%^&*()`
     - Minimum 8 characters
   - Click **"Create Database User"**

**⚠️ IMPORTANT: Save your credentials securely!**

---

## Step 4: Allow Network Access

1. Still in Security Quickstart, click **"My Local Environment"**
2. Click **"Add My Current IP Address"**
   - This adds your current IP to the allowlist
3. For production, you'll need to add server IP
4. For development, click **"Allow Access from Anywhere"** 
   - Replace `0.0.0.0/0` with your IP when deploying
5. Click **"Finish and Close"**

---

## Step 5: Get Your Connection String

1. Click on **"Databases"** (left sidebar)
2. Find your cluster `imboni-development`
3. Click **"Connect"** button
4. Choose **"Drivers"** (not MongoDB Compass)
5. Select:
   - **Driver**: Node.js
   - **Version**: 5.x or later
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```

**Replace:**
- `<username>` → `imboni_user` (or your username)
- `<password>` → Your actual password (from Step 3)

**Example:**
```
mongodb+srv://imboni_user:MyP@ssw0rd123@imboni-development.mongodb.net/?retryWrites=true&w=majority
```

---

## Step 6: Update Environment Variables

Navigate to your project folder and open `.env` file:

```bash
cd backend
```

Edit `.env` file and add/update:

```env
# MongoDB Configuration
DATA_MODE=mongo
MONGODB_URI=mongodb+srv://imboni_user:MyP@ssw0rd123@imboni-development.mongodb.net/imboni?retryWrites=true&w=majority

# Keep your other variables
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
GEMINI_API_KEY=your_gemini_key_here
FRONTEND_URL=http://localhost:3001
ADMIN_SECRET_KEY=your_admin_secret_here
NODE_ENV=development
```

**⚠️ Important Points:**
- Replace `MyP@ssw0rd123` with your actual password
- Add `/imboni` at end of URI (your database name)
- The `?retryWrites=true&w=majority` should be at the end
- If your password has special characters like `@`, `#`, `$`, encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

---

## Step 7: Verify Connection

1. Open terminal in backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Look for these messages in console:
   ```
   ✓ Connected to MongoDB
   Server running on port 5000
   ```

5. If you see connection error, check:
   - **Username/Password**: Verify credentials in `.env`
   - **IP Allowlist**: Check MongoDB Atlas Security > Network Access
   - **Special Characters**: Make sure password special characters are URL-encoded
   - **Database Name**: Ensure `/imboni` is in the URI

---

## Step 8: Test Database with Sample Data

Run this command in terminal:

```bash
npm run dev
```

The app will:
1. Connect to MongoDB Atlas ✓
2. Create database and collections ✓
3. Seed initial data ✓
4. Show success message ✓

---

## Common Connection Errors & Solutions

### ❌ Error: "Authentication failed"
**Solution:**
- Check username and password are correct
- Make sure special characters in password are URL-encoded
- Verify database user exists in MongoDB Atlas

### ❌ Error: "ENOTFOUND" or "querySrv ENOTFOUND"
**Solution:**
- Check internet connection
- Verify cluster name in connection string
- Try using direct connection instead of SRV

### ❌ Error: "ETIMEDOUT" or "Timed out"
**Solution:**
- Add your IP to Network Access allowlist
- Check firewall settings
- Verify cluster is running (not paused)

### ❌ Error: "Database does not exist"
**Solution:**
- Don't worry! MongoDB creates it automatically
- The database `imboni` will be created on first data write

---

## Verify Everything Works

1. **Check MongoDB Atlas Dashboard:**
   - Go to https://cloud.mongodb.com
   - Click Databases → imboni-development
   - Should show "Active" status

2. **Check Frontend Connection:**
   - Open http://localhost:3001
   - Dashboard should load data from MongoDB
   - No "seed data" indicator means it's using real database

3. **Test API Endpoint:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return success with database status

---

## Next Steps (Optional)

### Create Production Cluster:
1. Create another M0 cluster named `imboni-production`
2. Create separate database user for production
3. Use production connection string in deployment

### Backup Strategy:
1. Enable continuous backups in MongoDB Atlas (paid plans)
2. Set up regular backups for free tier
3. Download snapshots periodically

### Monitor Performance:
1. Go to Monitoring in MongoDB Atlas
2. Check connection count
3. Monitor query performance

---

## Your Connection Details Template

**Save these safely:**
```
Atlas Account Email: _______________________
Atlas Password: _______________________

Cluster Name: imboni-development
Database User: imboni_user
Database Password: _______________________

Connection String: _______________________
```

---

## Need Help?

Check the error messages at: https://docs.mongodb.com/atlas/reference/error-messages/

Or contact MongoDB support: https://support.mongodb.com/

---

**You're all set! 🎉 Your app is now connected to MongoDB Atlas!**
