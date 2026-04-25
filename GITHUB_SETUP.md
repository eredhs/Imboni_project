# 🚀 GitHub Setup Guide - For New Developers

This guide walks you through cloning the Imboni project from GitHub and getting it running locally with **zero errors**.

---

## ✅ Prerequisites

Before you start, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas account** - [Free account](https://cloud.mongodb.com/)
- **Google Gemini API key** - [Free key here](https://makersuite.google.com/)

Verify installation:
```bash
node --version    # Should be 18+
npm --version     # Should be 8+
git --version     # Should show version
```

---

## 📥 Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/imboni.git
cd imboni

# View the structure
ls -la
```

You should see:
```
├── backend/          # Node.js/Express API server
├── frontend/         # React/Next.js UI
├── README.md         # Project documentation
└── ... other files
```

---

## 🔧 Step 2: Setup Backend

### 2a. Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages from `package.json`.

### 2b. Create Environment File

```bash
# Copy the example
cp .env.example .env

# Open .env in your editor
nano .env
# or
code .env
# or
open .env  # on macOS
```

### 2c. Fill in Your Configuration

Edit `.env` with the following information:

```env
PORT=5000
NODE_ENV=development
DATA_MODE=mongo

# REQUIRED: Your MongoDB connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/talentlens?retryWrites=true&w=majority

# REQUIRED: Your Gemini API key
GEMINI_API_KEY=your_actual_key_here

# Generate random strings for JWT (or keep for development)
JWT_SECRET=your-random-jwt-secret-key
JWT_REFRESH_SECRET=your-random-refresh-secret-key

FRONTEND_URL=http://localhost:3001
ADMIN_SECRET_KEY=IMBONI-SYSTEM-2024
SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL=admin@imboni.local
SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD=AdminPass123!
SYSTEM_CONTROLLER_BOOTSTRAP_NAME=System Controller
```

**Don't have these values?** Follow the setup steps below ⬇️

---

## 🗄️ Step 3: Setup MongoDB Atlas (Free Database)

### 3a. Create MongoDB Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Create a free account"**
3. Fill in your details and sign up

### 3b. Create Cluster
1. Click **"Create a Project"**
2. Name it "imboni-dev"
3. Click **"Create Project"**
4. Click **"Create a Database"**
5. Choose **"Shared"** tier (free)
6. Select a region close to you
7. Click **"Create Cluster"**

(Wait 1-2 minutes for cluster to be created...)

### 3c. Get Connection String
1. When cluster is ready, click **"Connect"**
2. Click **"Drivers"**
3. Select **"Node.js"** and version **"5.9 or later"**
4. Copy the connection string
5. Replace `<password>` and `<dbname>`:

```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/talentlens?retryWrites=true&w=majority
```

6. Paste into `.env` as `MONGODB_URI`

### 3d. Whitelist Your IP
1. Go to **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"**
4. Or add **0.0.0.0/0** for development (less secure)
5. Click **"Confirm"**

(Wait 1-2 minutes for whitelist to apply...)

---

## 🔑 Step 4: Get Gemini API Key

### 4a. Create Google Account (if needed)
- Already have one? Skip to 4b

### 4b. Generate API Key
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Click **"Get API Key"**
3. Click **"Create API Key in new project"**
4. Copy the API key
5. Paste into `.env` as `GEMINI_API_KEY`

---

## ▶️ Step 5: Start Backend

```bash
# Make sure you're in the backend directory
cd backend

# Start development server
npm run dev
```

**Expected output:**
```
> talentlens-backend@0.1.0 dev
> tsx watch src/server.ts

[db] connected
[db] ensured 5 seed users
[db] ensured 8 seed jobs
[db] ensured 14 seed applicants
[db] ensured 10 screening results
[server] running on port 5000
```

✅ **Backend is running!** Keep this terminal open.

### If You See Errors

**"Could not connect to MongoDB"**
- ✅ Check your IP is whitelisted in MongoDB Atlas
- ✅ Check MONGODB_URI is correct in `.env`
- ✅ Wait 1-2 minutes after whitelisting IP

**"Invalid Gemini API key"**
- ✅ Check GEMINI_API_KEY is correct
- ✅ Verify API is enabled in Google Cloud

**"Port 5000 already in use"**
- ✅ Change PORT in `.env` to 5001, 5002, etc.

---

## 🎨 Step 6: Setup Frontend

### 6a. Install Dependencies (New Terminal)

```bash
# Open a NEW terminal/command prompt
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

### 6b. Create Frontend `.env`

```bash
# Check if .env.local exists
ls .env.local

# If not, create it:
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
```

---

## ▶️ Step 7: Start Frontend

```bash
# Still in frontend directory
npm run dev
```

**Expected output:**
```
> dev
> next dev
> ready - started server on 0.0.0.0:3001, url: http://localhost:3001
```

✅ **Frontend is running!**

---

## 🌐 Step 8: Open in Browser

1. Visit: **http://localhost:3001**
2. You should see the Imboni login page

### Login with Test Accounts

**As HR:**
- Email: `demohr@talentlens.ai`
- Password: `password123`

**As Job Seeker:**
- Email: `demouser@talentlens.ai`
- Password: `password123`

---

## ✅ Verify Everything Works

### Check Backend Terminal
```
[db] connected              ✓
[server] running on port 5000 ✓
```

### Check Frontend Terminal
```
ready - started server on 0.0.0.0:3001 ✓
```

### Test in Browser
1. ✅ Login successful
2. ✅ Can see dashboard
3. ✅ Can browse jobs (as seeker) or view jobs (as HR)

---

## 🧪 Quick Test Flow

### As HR (Recruiter)

1. **Login**: `demohr@talentlens.ai` / `password123`
2. **View Jobs**: See 8 active job postings
3. **View Applicants**: Click a job to see applicants
4. **Run AI Screening**: Click "Start Screening"
5. **See Results**: View AI-ranked candidates

### As Job Seeker

1. **Login**: `demouser@talentlens.ai` / `password123`
2. **Browse Jobs**: See available job listings
3. **View Applications**: See your submitted applications
4. **Check Status**: See if you've been shortlisted
5. **View Interview**: See interview details if scheduled

---

## 📁 Project Structure

```
imboni/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express setup
│   │   ├── server.ts           # Entry point
│   │   ├── config/             # Configuration
│   │   ├── controllers/        # API logic
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── middleware/         # Middleware
│   ├── package.json
│   ├── .env.example            # Template for .env
│   └── .env                    # Your local config (not in GitHub)
│
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js app
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities
│   │   └── hooks/              # Custom hooks
│   ├── package.json
│   └── .env.local              # Your local config (not in GitHub)
│
├── README.md                   # Main documentation
└── GITHUB_SETUP.md            # This file
```

---

## 🚀 Common Commands

### Backend

```bash
cd backend

# Start development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production version
npm start

# Type check
npm run type-check
```

### Frontend

```bash
cd frontend

# Start development
npm run dev

# Build for production
npm run build

# Start production
npm run start
```

---

## 🛠️ Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### Issue: "MONGODB_URI connection failed"
**Solution**:
- Check MongoDB Atlas cluster is running
- Verify your IP is whitelisted (Security → Network Access)
- Check password doesn't contain special characters (or URL-encode them)
- Wait 1-2 minutes after making changes

### Issue: "GEMINI_API_KEY is missing"
**Solution**:
- Verify key is in `.env`
- Check it's the correct key from [makersuite.google.com](https://makersuite.google.com)
- Regenerate key if needed

### Issue: "Port 5000 already in use"
**Solution**: Change PORT in `.env` to 5001, 5002, etc.

### Issue: "Cannot find module..."
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Frontend shows "API error"
**Solution**:
- Check backend is running (`npm run dev` in backend folder)
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`
- Check CORS is enabled in backend

---

## 🔐 Important Notes

### 🚨 Never Commit `.env` to GitHub

The `.env` file contains:
- Database credentials
- API keys
- Secrets

**Good practice:**
- ✅ Commit `.env.example` (template only, no real values)
- ❌ Never commit `.env` (your local secrets)
- ✅ The `.gitignore` already excludes `.env`

### For Production

1. **Change all secrets** (JWT, Admin password, etc.)
2. **Use strong MongoDB password**
3. **Enable HTTPS**
4. **Use environment variables** for all config
5. **Rotate API keys** regularly
6. **Enable rate limiting** for APIs

---

## 📚 Next Steps

1. ✅ Verify everything works locally
2. 📖 Read [README.md](README.md) for full documentation
3. 🧪 Follow [COMPLETE_E2E_SETUP.md](COMPLETE_E2E_SETUP.md) for detailed testing
4. 🚀 Deploy when ready

---

## 📞 Need Help?

1. Check [README.md](README.md) troubleshooting section
2. Check GitHub issues
3. Review environment variable examples in `.env.example`

---

## ✨ You're All Set!

Your local development environment is now complete. You have:

✅ Full backend API running
✅ Full frontend UI running
✅ Real MongoDB database
✅ AI screening with Gemini
✅ Test data pre-loaded
✅ Zero errors (hopefully!)

**Happy coding!** 🚀

---

**Last Updated**: April 23, 2026
**For Issues**: Check GitHub Issues or README.md
