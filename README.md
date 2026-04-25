# Imboni - Job Application & AI Screening Platform

A complete job application system with real-time AI screening using Gemini, MongoDB database, and React frontend.

## ✨ Features

- 🏢 **HR Job Posting** - Create and manage job listings
- 👥 **Job Seeker Portal** - Browse jobs and apply with CV
- 🤖 **AI Screening** - Automatic candidate evaluation using Google Gemini
- ⭐ **Intelligent Shortlisting** - AI-ranked candidate rankings
- 🔔 **Real-time Notifications** - Application status updates
- 📅 **Interview Scheduling** - Schedule interviews and add to calendar
- 📊 **Dashboard Analytics** - Track applications and hiring metrics
- 🔐 **Role-based Access** - Separate access for HR and Job Seekers

## 🎯 Complete E2E Flow

```
HR posts job 
    ↓
Seeker sees it & applies with CV
    ↓
HR sees application
    ↓
HR runs AI screening (Gemini API)
    ↓
Shortlist generated (ranked by score)
    ↓
HR sends notifications
    ↓
Seeker sees result in tracker
    ↓
Seeker opens interview details
    ↓
Add to calendar ✓
```

**Every step uses real MongoDB data. Zero mocks. Zero hardcoded arrays.**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- MongoDB Atlas account ([cloud.mongodb.com](https://cloud.mongodb.com))
- Google Gemini API key ([makersuite.google.com](https://makersuite.google.com))

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/imboni.git
cd imboni

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### 2. Configure Environment

**Backend Setup** (`.env` file):

```bash
cd backend

# Copy the example file
cp .env.example .env

# Edit .env with your values
# See .env.example for all required variables
nano .env
```

**Required environment variables** in `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Frontend
FRONTEND_URL=http://localhost:3001

# Admin Credentials
SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL=admin@imboni.local
SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD=AdminPass123!
SYSTEM_CONTROLLER_BOOTSTRAP_NAME=System Controller
```

### 3. Setup MongoDB Atlas

1. **Create MongoDB Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new project and cluster
   - Select shared tier for free hosting

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` and `<dbname>` with your values

3. **Whitelist Your IP**:
   - Go to Security → Network Access
   - Click "Add IP Address"
   - Add your current IP address (or 0.0.0.0/0 for development)
   - Wait 1-2 minutes for it to propagate

4. **Update `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/talentlens?retryWrites=true&w=majority
   ```

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com)
2. Click "Get API key"
3. Create new API key
4. Copy and paste in `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

### 5. Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
[db] connected
[db] ensured 5 seed users
[db] ensured 8 seed jobs
[db] ensured 14 seed applicants
[db] ensured 10 screening results
[server] running on port 5000
```

### 6. Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

Expected output:
```
> ready - started server on 0.0.0.0:3001
```

### 7. Open in Browser

Visit: **http://localhost:3001**

---

## 🧪 Test the System

### Test Accounts (Pre-loaded in MongoDB)

| Role | Email | Password |
|------|-------|----------|
| **HR** | `demohr@talentlens.ai` | `password123` |
| **Job Seeker** | `demouser@talentlens.ai` | `password123` |
| **Admin** | `admin@imboni.local` | `AdminPass123!` |

### Quick Test Flow

1. **As HR**: Log in → View Jobs → View Applicants → Run AI Screening → See Results
2. **As Seeker**: Log in → Browse Jobs → View Applications → See AI Score → Check Interview

---

## 📁 Project Structure

```
imboni/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app setup
│   │   ├── server.ts           # Server entry point
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # API controllers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── data/               # Seed data
│   │   └── utils/              # Utilities
│   ├── scripts/                # Setup & maintenance scripts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/                # App components
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities
│   │   ├── store/              # State management
│   │   └── hooks/              # Custom hooks
│   ├── public/                 # Static files
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md                   # This file
```

---

## 🔑 API Endpoints

All endpoints require authentication (Bearer token).

### Authentication
- `POST /api/auth/login` - Get access token

### Jobs
- `GET /api/jobs` - List jobs (HR only)
- `GET /api/jobs/seeker/browse` - Browse jobs (Seekers)
- `POST /api/jobs` - Create job (HR only)

### Applications
- `POST /api/applications/:jobId/apply` - Apply to job
- `GET /api/applications/user/:userId` - Get user's applications
- `GET /api/applications/:appId` - Get application details
- `PATCH /api/applications/:appId/status` - Update application status (HR only)

### AI Screening
- `POST /api/jobs/:jobId/screening/trigger` - Run AI screening
- `GET /api/jobs/:jobId/screening/results` - Get screening results
- `GET /api/jobs/:jobId/screening/status` - Check screening status

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:userId/:notifId/read` - Mark notification as read

---

## 🛠️ Development

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📦 Environment Setup Details

### MongoDB
- Real cloud database on MongoDB Atlas
- Seed data auto-loaded on startup
- Collections: users, jobs, applicants, applications, screeningresults, notifications

### Gemini API
- Used for AI candidate screening
- Evaluates CV against job requirements
- Generates scores and recommendations
- Handles skill matching and experience alignment

### Authentication
- JWT tokens for API authentication
- Refresh token mechanism
- Role-based access control (RBAC)

---

## 🔒 Security Notes

- **Never commit `.env`** file with credentials to GitHub
- Use `.env.example` as a template for users
- Rotate API keys regularly
- MongoDB connection strings should use strong passwords
- Use HTTPS in production

---

## 🚨 Troubleshooting

### MongoDB Connection Error

```
[db] failed to connect to MongoDB
```

**Solution**:
1. Check your MONGODB_URI in `.env`
2. Verify your IP is whitelisted in MongoDB Atlas (Security → Network Access)
3. Ensure password doesn't contain special characters (or URL-encode them)
4. Test connection: `mongodb+srv://user:pass@cluster...`

### Gemini API Error

```
Error: Failed to initialize Gemini API
```

**Solution**:
1. Verify GEMINI_API_KEY in `.env`
2. Check API key is valid in [Google AI Studio](https://makersuite.google.com)
3. Ensure API is enabled in Google Cloud Console

### Frontend Can't Connect to Backend

```
Error: Failed to fetch from http://localhost:5000
```

**Solution**:
1. Ensure backend is running: `npm run dev` in backend folder
2. Check FRONTEND_URL in `.env` matches http://localhost:3001
3. Verify CORS is enabled in `src/app.ts`

### Port Already in Use

```
Error: Address already in use :::5000
```

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📊 Database Schema

### Collections Structure

**users**: HR and job seekers
```json
{
  "id": "unique-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "recruiter|job_seeker|system_controller",
  "organization": "Company Name",
  "passwordHash": "bcrypt-hash"
}
```

**jobs**: Job postings
```json
{
  "id": "job-1",
  "hrId": "recruiter-1",
  "title": "Senior Engineer",
  "description": "...",
  "requiredSkills": ["Node.js", "React"],
  "status": "active|draft|closed",
  "createdAt": "2026-04-23T10:00:00Z"
}
```

**applicants**: Job applications
```json
{
  "id": "applicant-1",
  "jobId": "job-1",
  "userId": "seeker-1",
  "fullName": "Jane Smith",
  "skills": ["Node.js", "React"],
  "yearsExperience": 5,
  "status": "Pending|Shortlisted|Rejected"
}
```

**screeningresults**: AI evaluation results
```json
{
  "id": "screening-1",
  "jobId": "job-1",
  "applicantId": "applicant-1",
  "score": 85,
  "recommendation": "Shortlisted",
  "reasoning": "Strong technical background...",
  "skillGaps": ["AWS"]
}
```

---

## 🚀 Deployment

### Deploy Backend (Vercel/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables in platform dashboard
4. Deploy

### Deploy Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set NEXT_PUBLIC_API_URL to backend URL
4. Deploy

---

## 📝 Testing

### Run E2E Tests

See [COMPLETE_E2E_SETUP.md](COMPLETE_E2E_SETUP.md) for detailed testing guide.

### API Testing

Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for curl commands to test all endpoints.

---

## 📚 Documentation

- [COMPLETE_E2E_SETUP.md](COMPLETE_E2E_SETUP.md) - Complete step-by-step testing guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick API reference
- [E2E_TESTING.md](E2E_TESTING.md) - API documentation
- [SYSTEM_CONTROLLER_LOGIN.md](SYSTEM_CONTROLLER_LOGIN.md) - Admin setup guide
- [AI_SCREENING_SETUP.md](AI_SCREENING_SETUP.md) - AI screening configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support

For issues, questions, or feedback:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review documentation files
3. Open an issue on GitHub

---

## 🎉 Success!

Your Imboni job application platform is ready to use! Follow the Quick Start guide and you'll have a fully functional system with:

✅ Real MongoDB database
✅ AI-powered screening
✅ Live notifications
✅ Interview scheduling
✅ Calendar integration

Good luck! 🚀

---

**Last Updated**: April 23, 2026
**Version**: 1.0.0
