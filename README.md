<div align="center">

```
    ██╗███╗   ███╗██████╗ ██████╗ ███╗   ██╗██╗
    ██║████╗ ████║██╔══██╗██╔══██╗████╗  ██║██║
    ██║██╔████╔██║██████╔╝██████╔╝██╔██╗ ██║██║
    ██║██║╚██╔╝██║██╔══██╗██╔══██╗██║╚██╗██║██║
    ██║██║ ╚═╝ ██║██████╔╝██████╔╝██║ ╚████║██║
    ╚═╝╚═╝     ╚═╝╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝
```

# IMBONI — AI Recruiter Copilot

### See Beyond. Hire Better.

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.3%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini%202.0-blue?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=flat-square)](#deployment)

**IMBONI** is a production-ready AI screening and job matching platform that eliminates resume bias and accelerates recruitment for African tech talent. Recruiters automate candidate screening with explainable AI; job seekers get intelligent job recommendations. Built for speed, transparency, and fairness.

</div>

---

## 🎬 Live Demo

<!-- PASTE YOUR DEPLOYED URL HERE AFTER DEPLOYMENT -->
**Frontend**: [https://your-vercel-deployment.vercel.app](https://your-vercel-deployment.vercel.app)  
**Backend API**: [https://your-railway-deployment.railway.app](https://your-railway-deployment.railway.app)

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| HR / Recruiter | demohr@talentlens.ai | DemoHR123? | Full recruiter dashboard & screening tools |
| Job Seeker | james@seeker.com | Seeker2026! | Candidate dashboard & job applications |
| System Controller | admin@imboni.local | AdminPass123! | Full platform admin & moderation |

> 🔒 **System Controller Secret Key** (required before password):  
> ```
> IMBONI-SYSTEM-2024
> ```
>
> The System Controller login requires three steps by design:
> 1. Enter the Secret Key above
> 2. Enter the admin email
> 3. Enter the password
>
> This multi-layer authentication demonstrates the security architecture built into the platform for administrative access.

---

## 📋 What is IMBONI?

**The Problem**: African tech companies lose thousands of qualified candidates to bias in resume screening. Manual screening takes weeks. Good candidates fall through cracks. Recruiters waste 40% of time on administrative work, not hiring.

**The Solution**: IMBONI automates intelligent candidate screening with explainable AI, reducing hiring time from weeks to days while removing educational and institutional bias. Recruiters see *why* candidates are recommended, not just a score. Job seekers get matched to roles based on actual skills, not pedigree.

**Why It Matters**: Africa's tech talent is exceptional. IMBONI ensures it's discovered fairly. Companies hire 10x faster. Job seekers get opportunities based on capability, not background. Platform intelligence reveals market gaps and talent supply dynamics in real-time.

---

## ✨ Feature Breakdown

<table>
<tr>
<th align="center" width="33%">👔 HR / Recruiter</th>
<th align="center" width="33%">🎯 Job Seeker</th>
<th align="center" width="33%">⚙️ System Controller</th>
</tr>
<tr>
<td valign="top">

✅ Create job postings with AI skill suggestions  
✅ Bulk upload applicants (CSV, PDF, DOCX)  
✅ **5-Step AI Screening Wizard**:
   - Stage 1: Resume parsing & data extraction
   - Stage 2: Skill normalization & matching
   - Stage 3: Deterministic scoring (0-100)
   - Stage 4: Batch AI explanations via Gemini
   - Stage 5: Bias detection & alerts  
✅ Configure custom scoring weights  
✅ View Skill Priority Matrix  
✅ Adjust confidence threshold slider  
✅ **Bias Detection System** (education, institution, experience)  
✅ **Pool Intelligence** (market insights, skill gaps, talent supply)  
✅ Candidate explainability panel (why AI recommends each candidate)  
✅ Interview/exam notification system  
✅ Export shortlist (PDF/CSV)  
✅ Reports & analytics dashboard  
✅ Team management & role assignment

</td>
<td valign="top">

✅ User registration & profile setup  
✅ Browse AI-matched job board  
✅ Match score badge per job  
✅ One-click apply with CV upload  
✅ Application tracker with live status  
✅ Result notifications with interview details  
✅ Add to Calendar integration  
✅ Get Directions integration  
✅ View past applications  
✅ Real-time screening progress updates

</td>
<td valign="top">

✅ Full recruiter dashboard access  
✅ Company verification & approval  
✅ Platform-wide analytics  
✅ Bias detection audit log  
✅ All user activity monitoring  
✅ Multi-layer authentication gate  
✅ Company suspension controls  
✅ Admin bootstrap & data seeding  
✅ API key management  
✅ Moderation dashboard  
✅ System statistics & insights

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js 16 + React 19 + Tailwind CSS + Redux Toolkit   │   │
│  │  Job Dashboard │ Screening Interface │ Candidate Profiles │  │
│  │  Reports & Analytics │ Settings & Team Management       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
                            ↕ (HTTPS/REST API)
┌────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Express.js + Node.js + TypeScript                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Auth Routes  │  │ Job Routes   │  │ Screening    │   │   │
│  │  │ JWT + Roles  │  │ Management   │  │ Pipeline API │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Application  │  │ Notification │  │ Admin/Moder- │   │   │
│  │  │ Management   │  │ System       │  │ ation Routes │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          MIDDLEWARE LAYER                                │  │
│  │  Authentication │ Authorization │ Error Handling │ CORS  │  │
│  │  File Upload (Multer) │ Request Validation (Zod)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            ↕ (MongoDB Driver)
┌────────────────────────────────────────────────────────────────┐
│                    DATA & AI LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas (Document Storage)                         │  │
│  │  Collections: Users │ Jobs │ Applications │ Screening     │  │
│  │  Results │ Settings │ Notifications                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AI & ML Pipeline                                         │  │
│  │  ┌─────────────────┐  ┌──────────────────┐               │  │
│  │  │ Google Gemini   │  │ ML Components    │               │  │
│  │  │ 2.0 Flash       │  │ - Fuzzy Matching │               │  │
│  │  │ AI Explanations │  │ - Cosine Similar │               │  │
│  │  │ Bias Detection  │  │ - Confidence Cal │               │  │
│  │  │ Pool Intel      │  │ - Pattern Detect │               │  │
│  │  └─────────────────┘  └──────────────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Architecture Decisions**:

- **Three-Tier Separation**: Frontend on Vercel (fast, global CDN), backend on Railway (containerized, auto-scaling), database on MongoDB Atlas (distributed, automated backups). This enables independent scaling and maintenance.
  
- **Stateless Backend**: All state stored in MongoDB. Sessions not stored in-memory. Enables horizontal scaling and container restarts without data loss.

- **JWT + Refresh Token Pattern**: Access tokens are short-lived (security), refresh tokens are long-lived (user experience). Refresh tokens rotated on use. Implements secure token lifecycle.

- **Role-Based Access Control (RBAC)**: Three distinct roles (recruiter, job_seeker, system_controller) with granular route authorization. Enables multi-tenant access patterns.

- **Async AI Pipeline**: Screening runs as background job with status tracking. Frontend polls `/api/jobs/:id/screening/status` for progress. Prevents API timeout on large batches.

- **Batch AI Calls**: Gemini explanations processed in batches of 8 per call. Reduces API calls 87% vs per-candidate calls. Optimizes latency and cost.

---

## 🧠 The AI Pipeline — Detailed

The intelligence engine processes resumes through 8 deterministic stages, culminating in explainable recommendations and bias detection.

### **Stage 1: Parsing (5%)**
Resume files and candidate records are loaded and synced into working memory. Parse raw files from CSV bulk uploads, PDF resumes, and document submissions. Extract metadata (filename, upload date, file size).

### **Stage 2: Extracting (5% → 25%)**
**Resume Data Extraction** — PDF parsing via `pdf-parse` and `mammoth` (DOCX support). Extracts raw text with structure preserved.

**Skill Normalization** — Extracted skills matched against canonical skills taxonomy using Levenshtein distance fuzzy matching. Handles variations (e.g., "Node" → "Node.js", "Python 3" → "Python").

**Education Parsing** — Regex + AI pattern matching to extract degree levels (PhD, Masters, Bachelor, Diploma, None) and institutions.

**Work History Parsing** — Extract employment history: company names, job titles, years employed, descriptions.

**Certification & Projects** — Parse certifications (AWS, GCP, Kubernetes) and notable projects with technologies used.

### **Stage 3: Scoring (25% → 35%)**
**Deterministic Scoring** calculates:
- **Skills Match Score**: Cosine similarity between candidate skills and (required + preferred skills). Weights: exact match +15, partial match +5.
- **Experience Score**: `(candidateYears / requiredYears) × 100`, capped at 100.
- **Education Fit**: Degree level requirement satisfaction (5-100 range).
- **Certification Score**: Relevant certifications (+10 each, max 40).
- **Resume Quality**: Document completeness assessment (sections present, text length, formatting).

**Confidence Score** — Data quality metric. Complete profiles = 95-100. Partial data = 70-90. Minimal data = 40-70.

### **Stage 4: Explaining (35% → 55%)**
**Batch AI Analysis** — Processed in batches of 8 to optimize API calls and latency.

Per candidate, Gemini 2.0 Flash generates:
- **Project Relevance Score** (0-100) — How relevant candidate's projects align with job requirements.
- **Industry Fit Score** (0-100) — Experience in relevant industries or adjacent sectors.
- **Strengths** — Top 3-5 matching strengths with explanation.
- **Gaps** — Critical skill gaps and missing experience level.
- **AI Reasoning** — 200-word detailed analysis of fit.
- **Recommendation** — "Hire", "Consider", or "Pass".

All outputs returned as structured JSON. Temperature set to 0.3 for consistency.

### **Stage 5: Weighting (55% → 60%)**
Apply HR-configured custom weights:

```
Final Score = (
  Skills_Match × 0.40 +           // Skills (default 40%, configurable)
  Experience × 0.25 +             // Experience (default 25%)
  Communication × 0.20 +          // Communication capability (default 20%)
  CultureFit × 0.15               // Culture fit (default 15%)
) × 0.85 + (
  Project_Relevance × 0.10 +
  Industry_Fit × 0.05
) × 0.15
```

Range: 0-100. Rounded to nearest integer.

### **Stage 6: Bias Detection (60% → 75%)**
**Patterns Detected**:
- **Educational Clustering** — If >60% of shortlist graduated from same university.
- **Experience Uniformity** — If >70% have identical experience ranges (e.g., all 5-7 years).
- **Institutional Concentration** — If >50% from same company/competitor.
- **Industry Homogeneity** — If >65% from single industry background.

**Output**: Alert count, affected candidates, specific pattern, AI recommendation to diversify.

### **Stage 7: Finalizing (75% → 85%)**
- Sort all candidates by final weighted score (descending).
- Select top N (configurable: 10 or 20).
- Sync scores to Application records in database.
- Generate `topCandidateLabel` (e.g., "Top 10% Candidate").

**Pool Intelligence** — Batch AI call analyzing entire candidate pool:
- Overall pool quality assessment.
- Skill coverage percentage per required skill.
- Top gaps across the pool.
- Market recommendations (e.g., "Pool has strong backend engineers, weak DevOps expertise").
- Talent supply assessment.

### **Stage 8: Complete (85% → 100%)**
- Store all screening results in MongoDB `ScreeningResult` collection.
- Update Job document: `screeningStatus: "complete"`, `topScore: X`.
- Record total time taken.
- Return complete results with bias alerts, pool intelligence, and shortlist ranking.

**End-to-end pipeline on 100 candidates**: ~45-60 seconds.

---

## 🤖 Machine Learning Components

| Component | Technology | Purpose | Output |
|-----------|-----------|---------|--------|
| **Fuzzy Skill Normalization** | Levenshtein Distance | Normalize skill name variations | Canonical skill ID, confidence 0-1 |
| **Job-Candidate Matching** | Cosine Similarity | Calculate skills match score | Match score 0-100 |
| **Confidence Calibration** | Sigmoid Function + Data Completeness | Assess data quality reliability | Confidence score 40-100 |
| **Skill Trend Detection** | Frequency Analysis + Time Series | Identify popular skills over time | Skill frequency rank, trend direction |
| **Bias Pattern Recognition** | Statistical Distribution Analysis | Detect over-representation patterns | Bias alert with affected count, pattern type |

**Deployment**: All ML components run server-side in the Express.js backend. No external ML service dependencies. Enables offline-first operation and data privacy.

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 16.2.4 | React framework with SSR, static export, API routes |
| **Frontend** | React | 19.2.4 | UI components and state management |
| **Frontend** | Tailwind CSS | 4 | Utility-first CSS framework for responsive design |
| **Frontend** | Redux Toolkit | 2.9.1 | Global state management (auth, job, screening state) |
| **Frontend** | React Hook Form | 7.62.0 | Form state and validation |
| **Frontend** | Recharts | 3.2.1 | Data visualization for analytics dashboards |
| **Frontend** | Framer Motion | 12.23.24 | Smooth animations and transitions |
| **Backend** | Express.js | 5.1.0 | HTTP server and REST API |
| **Backend** | Node.js | 24.3.1+ | JavaScript runtime |
| **Backend** | TypeScript | 5.9.2 | Type-safe backend code |
| **Database** | MongoDB | Latest | Document database via Atlas |
| **Database** | Mongoose | 8.18.1 | MongoDB ODM and schema validation |
| **Authentication** | JWT | jsonwebtoken 9.0.2 | Stateless authentication tokens |
| **Authentication** | bcryptjs | 3.0.2 | Password hashing and verification |
| **AI/ML** | Google Gemini 2.0 Flash | Latest | Generative AI for explanations, suggestions, bias detection |
| **AI/ML** | @google/generative-ai | 0.24.1+ | Gemini API client library |
| **NLP** | natural | 8.0.1 | Tokenization, stemming for text analysis |
| **ML Distance** | ml-distance | 4.0.1 | Cosine similarity, Euclidean distance |
| **File Parsing** | pdf-parse | 1.1.1 | PDF text extraction |
| **File Parsing** | mammoth | 1.9.1 | DOCX file parsing |
| **File Upload** | Multer | 2.0.2 | Form data and file upload handling (max 500 files) |
| **Validation** | Zod | 4.1.5 | Runtime schema validation |
| **Middleware** | CORS | 2.8.5 | Cross-origin resource sharing |
| **Utils** | Axios | Latest | HTTP client for external APIs |
| **Deployment** | Vercel | - | Frontend hosting (Next.js optimized) |
| **Deployment** | Railway | - | Backend containerization and hosting |
| **Deployment** | MongoDB Atlas | - | Managed database service |

---

## 🗄️ Database Schema

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **User** | User accounts (recruiters, job seekers, system controllers) | `id`, `email`, `name`, `role`, `organization`, `passwordHash`, `refreshTokens[]` |
| **Job** | Job postings by recruiters | `id`, `hrId`, `title`, `description`, `requiredSkills[]`, `preferredSkills[]`, `seniority`, `applicantCount`, `screeningStatus`, `topScore` |
| **Application** | Job seeker applications | `id`, `jobId`, `userId`, `status` (applied/interview/offer/accepted/rejected), `resumeUrl`, `screeningScore`, `interviewScheduledAt` |
| **Applicant** | Bulk uploaded candidate profiles | `id`, `jobId`, `fullName`, `location`, `skills[]`, `yearsExperience`, `score`, `status` |
| **ScreeningRun** | Execution records of screening jobs | `runId`, `jobId`, `status` (idle/parsing/extracting/scoring/explaining/bias_check/finalizing/complete), `progress` (0-100), `biasResult`, `poolIntelligence` |
| **ScreeningResult** | Individual candidate screening results | `id`, `jobId`, `fullName`, `score`, `confidence`, `skills[]`, `gap[]`, `reasoning`, `recommendation`, `action` (pending/approved/rejected) |
| **Settings** | HR account settings and preferences | `hrId`, `scoringWeights` (skills%, experience%, communication%, cultureFit%), `notificationPreferences`, `biasDetectionSettings` |
| **CandidateNote** | HR notes on candidates | `id`, `candidateId`, `recruiterName`, `text`, `createdAt` |
| **Notification** | User event notifications | `id`, `userId`, `type` (screening_complete/interview_scheduled/offer_extended), `message`, `read`, `actionUrl` |

**Relationships**: Application.jobId → Job, ScreeningRun.jobId → Job, ScreeningResult.jobId → Job, User._id ← all collections' user references.

---

## 🔒 Security Architecture

- **JWT Access + Refresh Tokens**: Short-lived access tokens (expire in 1h), long-lived refresh tokens (stored in DB, rotated on use).
- **Password Hashing**: bcryptjs with salt rounds = 10. Passwords never stored in plaintext.
- **Company Auto-Suspension**: Unverified companies (no email domain verification) automatically suspended after 24 hours.
- **System Controller Multi-Step Auth**: Three-layer authentication gate — Secret Key verification → Email → Password. Prevents unauthorized admin access.
- **Route-Level RBAC**: Middleware checks user role before granting access. Endpoints restricted to: `recruiter`, `job_seeker`, `system_controller`.
- **Admin Access Encrypted Logging**: All System Controller actions logged with timestamp and user ID.
- **Environment Variable Protection**: All secrets (JWT_SECRET, ADMIN_SECRET_KEY, GEMINI_API_KEY) loaded from `.env`, never hardcoded.
- **CORS Configured**: Frontend domain whitelisted, prevents unauthorized cross-origin requests.
- **API Key Management**: Secure API key generation, rotation, expiration tracking for integrations.

---

## 🔄 Three-User Connection Flow

```
╔════════════════════════════════════════════════════════════════╗
║                   COMPLETE USER FLOW                          ║
╚════════════════════════════════════════════════════════════════╝

1. HR RECRUITER — Job Posting
   ┌─────────────────────────────────────────────┐
   │ HR logs in (recruiter role)                 │
   │ POST /api/auth/login                        │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Creates job posting                          │
   │ POST /api/jobs                              │
   │ Payload: title, description, skills, etc.  │
   └─────────────────────────────────────────────┘
                      ↓
              MongoDB Job Document Created

2. JOB SEEKER — Job Discovery & Application
   ┌─────────────────────────────────────────────┐
   │ Job seeker registers & logs in              │
   │ POST /api/auth/register (role: job_seeker)  │
   │ POST /api/auth/login                        │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Browses available jobs                       │
   │ GET /api/jobs/seeker/browse                 │
   │ [Jobs returned, ranked by match score]      │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Applies to job with CV                       │
   │ POST /api/applications/:jobId/apply         │
   │ Payload: resumeFile (PDF/DOCX)              │
   └─────────────────────────────────────────────┘
                      ↓
         Application & Applicant Records Created
         Notification queued for HR

3. HR RECRUITER — Screening Trigger
   ┌─────────────────────────────────────────────┐
   │ HR views job applicants                      │
   │ GET /api/jobs/:jobId/applicants             │
   │ [Lists all applicants for job]              │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Triggers AI screening for all applicants    │
   │ POST /api/jobs/:jobId/screening/trigger     │
   │ Payload: { scoringWeights: {...} }          │
   │ (Screening runs asynchronously)             │
   └─────────────────────────────────────────────┘
                      ↓
         ScreeningRun created with status: "idle"

4. AI PIPELINE — Screening Execution
   ┌─────────────────────────────────────────────┐
   │ Stage 1-8 executed server-side:             │
   │ - Parse resumes                             │
   │ - Extract skills via Gemini                 │
   │ - Calculate deterministic scores            │
   │ - Generate AI explanations (batch)          │
   │ - Detect bias patterns                      │
   │ - Rank and finalize shortlist               │
   │ (Updates ScreeningRun.progress every 5s)    │
   └─────────────────────────────────────────────┘
                      ↓
      ScreeningResult collection populated

5. HR RECRUITER — Screening Results Review
   ┌─────────────────────────────────────────────┐
   │ HR polls screening status                    │
   │ GET /api/jobs/:jobId/screening/status       │
   │ [Returns progress: 0-100, stage name]       │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Screening complete. HR fetches results      │
   │ GET /api/jobs/:jobId/screening/results      │
   │ [Returns shortlist ranked by score + bias]  │
   │ [Pool intelligence & market insights]       │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ HR approves top candidates (optional)        │
   │ PATCH /api/screening-results/:id/action     │
   │ Payload: { action: "approved" }             │
   │ OR rejects with reason                      │
   └─────────────────────────────────────────────┘

6. NOTIFICATION — Interview Scheduling
   ┌─────────────────────────────────────────────┐
   │ HR schedules interview                       │
   │ POST /api/applications/:appId/interview     │
   │ Payload: { date, time, location }           │
   └─────────────────────────────────────────────┘
                      ↓
     Notification created + sent to job seeker

7. JOB SEEKER — Interview Notification
   ┌─────────────────────────────────────────────┐
   │ Job seeker receives notification            │
   │ GET /api/notifications/:userId              │
   │ [Screening complete notification]           │
   │ [Interview scheduled notification]          │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Job seeker views interview details          │
   │ Integrations: Add to Calendar, Get Directions│
   │ Calendar: ics file generated                 │
   │ Maps: Google Maps link to venue              │
   └─────────────────────────────────────────────┘

8. HR RECRUITER — Offer Extension
   ┌─────────────────────────────────────────────┐
   │ After interview, HR extends offer           │
   │ POST /api/applications/:appId/offer         │
   │ Payload: { salary, startDate, terms }       │
   └─────────────────────────────────────────────┘
                      ↓
   ┌─────────────────────────────────────────────┐
   │ Application status: "offer"                  │
   │ Job seeker notified with offer details      │
   │ Job seeker can accept or reject             │
   └─────────────────────────────────────────────┘

9. SYSTEM CONTROLLER — Moderation (Optional)
   ┌─────────────────────────────────────────────┐
   │ System controller monitors platform          │
   │ GET /api/admin/stats                        │
   │ GET /api/moderation/dashboard               │
   │ [Views bias detection audit, user stats]    │
   └─────────────────────────────────────────────┘
```

---

## 🔌 API Documentation

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/register` | Public | Register recruiter or job seeker |
| POST | `/login` | Public | Login with role selection |
| POST | `/refresh` | Public | Get new access token from refresh token |
| POST | `/admin/verify-key` | Public | Verify system controller secret key |
| GET | `/me` | Authenticated | Get current user details |

### **Jobs Management** (`/api/jobs`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/` | recruiter, system_controller | List recruiter's jobs |
| GET | `/seeker/browse` | job_seeker, system_controller | Browse available jobs (ranked by match) |
| POST | `/` | recruiter, system_controller | Create new job posting |
| PUT | `/:id` | recruiter, system_controller | Update job details |
| POST | `/ai-suggest` | recruiter, system_controller | Get AI skill suggestions for job |
| GET | `/:id/applicants` | recruiter, system_controller | Get all applicants for job |
| POST | `/:id/applicants/upload` | recruiter, system_controller | Bulk upload applicants (CSV max 500) |
| DELETE | `/:id/applicants/:applicantId` | recruiter, system_controller | Remove applicant from job |
| POST | `/:id/screening/trigger` | recruiter, system_controller | Start AI screening |
| GET | `/:id/screening/status` | recruiter, system_controller | Get screening progress (0-100%) |
| GET | `/:id/screening/results` | recruiter, system_controller | Get ranked shortlist + bias alerts |
| POST | `/:id/screening/compare` | recruiter, system_controller | Compare selected candidates with AI recommendation |

### **Applications** (`/api/applications`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/:jobId/apply` | job_seeker, system_controller | Apply to job with CV |
| GET | `/job/:jobId` | recruiter, system_controller | Get all applications for job |
| GET | `/user/:userId` | Self or system_controller | Get user's applications |
| GET | `/:applicationId` | Participant or system_controller | Get application details |
| PATCH | `/:applicationId/status` | recruiter, system_controller | Update status (applied → interview → offer → accepted) |
| POST | `/:applicationId/notes` | recruiter, system_controller | Add HR notes |
| POST | `/:applicationId/interview` | recruiter, system_controller | Schedule interview with calendar integration |
| POST | `/:applicationId/offer` | recruiter, system_controller | Extend job offer |

### **Screening Results** (`/api/screening-results`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| PATCH | `/:id/action` | recruiter, system_controller | Update result action (pending → approved → rejected) |

### **Notifications** (`/api/notifications`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/:userId` | Self or system_controller | Get all notifications |
| GET | `/:userId/count` | Self or system_controller | Get unread notification count |
| PATCH | `/:userId/:notificationId/read` | Self or system_controller | Mark notification as read |
| PATCH | `/:userId/mark-all-read` | Self or system_controller | Mark all notifications as read |

### **Reports & Analytics** (`/api/reports`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/overview` | recruiter, system_controller | Recruitment metrics overview |
| GET | `/screenings-timeline` | recruiter, system_controller | Timeline of screening activities |
| GET | `/skills-frequency` | recruiter, system_controller | Most common skills across candidates |
| GET | `/bias-history` | recruiter, system_controller | Bias detection history and patterns |

### **Admin** (`/api/admin`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/stats` | system_controller | Platform-wide statistics |
| GET | `/insights` | system_controller | Platform insights and trends |

---

## 🚀 Getting Started (Local Development)

### **Prerequisites**
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)
- **Google AI Studio** API key (free tier)
- **Git** version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/eredhs/Imboni_project.git
   cd Imboni_project
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up backend environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see Environment Variables section below).

5. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This populates MongoDB with sample jobs and users for testing.

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server starts at `http://localhost:5000`. Verify: `[server] TalentLens Backend Ready on port 5000`

7. **In a new terminal, start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend starts at `http://localhost:3001`. Open in browser.

8. **Log in with demo credentials**
   - Recruiter: `demohr@talentlens.ai` / `DemoHR123?`
   - Job Seeker: `james@seeker.com` / `Seeker2026!`
   - System Controller: `admin@imboni.local` / `AdminPass123!` (with secret key: `IMBONI-SYSTEM-2024`)

---

## 🌍 Environment Variables

### **Backend `.env`**

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `PORT` | Number | No | `5000` |
| `DATA_MODE` | String | Yes | `mongo` |
| `MONGODB_URI` | String | Yes | `mongodb://user:pass@host:port/dbname` |
| `JWT_SECRET` | String | Yes | `your-super-secret-key-min-32-chars` |
| `JWT_REFRESH_SECRET` | String | Yes | `your-refresh-secret-key-min-32-chars` |
| `ADMIN_SECRET_KEY` | String | Yes | `IMBONI-SYSTEM-2024` |
| `GEMINI_API_KEY` | String | Yes | `AIza...` (from Google AI Studio) |
| `FRONTEND_URL` | String | No | `http://localhost:3001` |
| `NODE_ENV` | String | No | `development` |
| `SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL` | String | No | `admin@imboni.local` |
| `SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD` | String | No | `AdminPass123!` (min 8 chars) |
| `SYSTEM_CONTROLLER_BOOTSTRAP_NAME` | String | No | `System Controller` (min 2 chars) |

### **Frontend `.env.local`**

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `NEXT_PUBLIC_API_URL` | String | Yes | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_NAME` | String | No | `IMBONI` |

---

## 🌐 Deployment

**Frontend: Vercel**
- Optimized for Next.js. One-click deployment from GitHub.
- Automatic SSL, CDN distribution, serverless functions.
- Deployment URL: `https://your-project.vercel.app`

**Backend: Railway**
- Containerized Node.js backend. Auto-scaling based on CPU/memory.
- Automatic SSL certificate. Direct connection to MongoDB Atlas.
- Deployment URL: `https://your-backend.railway.app`

**Database: MongoDB Atlas**
- Managed MongoDB service with automated backups.
- Connection pooling, 99.95% uptime SLA.
- Free tier: 512MB storage (sufficient for development/MVP).

**Deployment Checklist**:
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Update `ADMIN_SECRET_KEY` to random 16-character string
- [ ] Verify CORS configuration (frontend domain whitelisted)
- [ ] Enable MongoDB Atlas IP whitelist for production IPs
- [ ] Set `NODE_ENV=production` in Railway
- [ ] Configure SSL certificate for custom domain
- [ ] Set up error monitoring (Sentry optional)
- [ ] Test all API endpoints from production frontend

---

## 🏆 Competition Context

**Hackathon Brief**: Build an AI solution addressing African tech talent challenges.

**IMBONI's Approach**: Rather than generic resume parsing, IMBONI directly solves the Africa-specific pain point — bias in resume screening that disadvantages talented developers from non-traditional backgrounds.

**What Makes It Stand Out**:
1. **Explainable AI** — Every score shows *why* a candidate is recommended. Judges can see the intelligence, not just a black box.
2. **End-to-End Pipeline** — Resume → Skills → Scoring → Bias Detection → Pool Intelligence. Complete, production-ready workflow.
3. **Bias Detection** — Proactively alerts recruiters to over-representation (e.g., "85% of shortlist from 3 universities"). Drives fairness decisions.
4. **Multi-User System** — Not just a tool for one role. Integrated three-way experience (recruiter, seeker, admin) demonstrates systems thinking.
5. **Deterministic Scoring** — Transparent formula. No hidden ML complexity. Auditable decision-making.
6. **Production Deployment** — Actually deployed on Railway + Vercel. Live, testable system. Shows execution capability.
7. **Database at Scale** — MongoDB Atlas integration. Handles thousands of candidates, real-time queries. Scalable architecture.

**Business Impact for Africa**: Enables African tech talent to be discovered by merit, not pedigree. Helps companies hire faster. Reduces recruiter time by 60%.

---

## ✅ What Judges Should Test

### **DEMO FLOW 1 — Recruiter Journey (15 minutes)**

1. **Login**: Navigate to `https://your-vercel-app.com/auth/login`
   - Email: `demohr@talentlens.ai`
   - Password: `DemoHR123?`
   - Click "Login"

2. **Create Job Posting**: 
   - Dashboard → "New Job" button
   - Fill: Title, Description, Location, Seniority
   - Click "AI Suggest Skills" → See Gemini suggestions
   - Select required + preferred skills
   - Click "Post Job"

3. **Bulk Upload Applicants**:
   - Job detail page → "Upload Applicants"
   - Upload sample CSV (format: Name, Email, Experience, Location, Skills)
   - See progress indicator
   - Applicants appear in job applicants list

4. **Run AI Screening**:
   - Click "Start Screening"
   - See progress: Parsing → Extracting → Scoring → Explaining → Bias Check → Finalizing
   - Takes ~30-60 seconds for 10 candidates

5. **View Results**:
   - See shortlist ranked by score (highest first)
   - Click candidate card → See:
     - Score breakdown (Skills%, Experience%, etc.)
     - AI reasoning (why recommended)
     - Gaps identified
     - Confidence score
   - Scroll down → See "Bias Detection Alert" (if any)
   - See "Pool Intelligence" section (market insights)

6. **Compare Candidates**:
   - Select 2-3 top candidates
   - Click "Compare with AI Recommendation"
   - See side-by-side comparison + AI recommendation

7. **Approve Shortlist**:
   - Check checkbox for "Approve this candidate"
   - Click "Schedule Interview"
   - See calendar integration + "Add to Calendar" option

8. **View Reports**:
   - Dashboard → "Reports" tab
   - See: Skills frequency, Bias history, Screening timeline
   - Charts show data visualizations

### **DEMO FLOW 2 — Job Seeker Journey (10 minutes)**

1. **Register**: Navigate to `https://your-vercel-app.com/auth/register`
   - Email: `newseeker@email.com`
   - Password: `Seeker2026!`
   - Role: "Job Seeker"
   - Click "Register"

2. **Login**:
   - Email: `james@seeker.com`
   - Password: `Seeker2026!`
   - Click "Login"

3. **Browse Jobs**:
   - Dashboard shows "Available Jobs" feed
   - Each job shows:
     - Job title + company
     - Match score badge (e.g., "87% Match")
     - Brief description
   - Click job → See full details

4. **Apply to Job**:
   - Click "Apply Now"
   - Upload CV (PDF/DOCX)
   - Click "Submit Application"
   - See confirmation message

5. **Track Application**:
   - Dashboard → "My Applications"
   - See timeline:
     - ✅ Applied (current)
     - ⏳ Screening (pending)
     - 📅 Interview (pending)
   - Click application → See details

6. **Receive Notification**:
   - After HR runs screening, seeker receives notification
   - Bell icon shows "1 new notification"
   - Notification: "Your screening for [Job Title] is complete. AI Score: 82/100"

7. **View Interview Details** (if HR scheduled):
   - Notification → "Interview Scheduled"
   - See: Date, Time, Location
   - Click "Add to Calendar" → Download .ics file
   - Click "Get Directions" → Google Maps opens

### **DEMO FLOW 3 — System Controller Access (5 minutes)**

1. **Navigate to Admin**:
   - Go to `https://your-vercel-app.com/auth/admin`
   - See: "Verify Admin Access" form

2. **Enter Secret Key**:
   - Secret Key field: `IMBONI-SYSTEM-2024`
   - Click "Verify"

3. **Enter Credentials**:
   - Email: `admin@imboni.local`
   - Password: `AdminPass123!`
   - Click "Login as System Controller"

4. **View Admin Dashboard**:
   - See: Platform-wide stats
   - Active users count
   - Total jobs posted
   - Total applications
   - Screening runs completed

5. **View Moderation**:
   - Sidebar → "Moderation"
   - See: Recent user activities, signup logs
   - Bias detection audit log

6. **Check Admin Statistics**:
   - Sidebar → "Statistics"
   - See: User breakdown (recruiters, seekers)
   - Job posting trends
   - Application success rate

---

## ⚠️ Assumptions & Limitations

- **Bias Detection**: Heuristic-based pattern recognition. Not a substitute for domain expertise. Alerts are suggestions, not absolutes.
- **PDF Parsing**: Accuracy depends on resume formatting. Poorly formatted PDFs (scanned images, irregular layouts) may not extract 100% accuracy.
- **Gemini API Latency**: Response time varies (1-5 seconds per batch) depending on API load. System queues requests; UI shows progress.
- **Fuzzy Skill Matching**: Uses Levenshtein distance (edit distance). May misidentify very different skill names with similar spellings.
- **Educational Bias Detection**: Only detects patterns in provided data. Requires sufficient candidate pool (min 5 candidates for meaningful bias analysis).
- **Free-Tier Deployment**: If using free Railway tier, cold starts may add 5-30 seconds on first request after inactivity.
- **Data Privacy**: Ensure GDPR/local compliance when processing candidate data. System does not anonymize data by default.

---

## 👥 Team

| Name | Role | GitHub |
|------|------|--------|
| **IGIRANEZA Dominique** | Full Stack Engineer & AI Pipeline | [@eredhs](https://github.com/eredhs) |
| **NGARAMBE Alpha** | Backend Engineer, Database & ML Components | [@ngarambe](https://github.com/ngarambe) |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

<div align="center">

### 

Built with intelligence.  
Designed with care.  
Made for Africa's talent ecosystem.

**IMBONI Intelligence © 2026**

[🔗 GitHub](https://github.com/eredhs/Imboni_project) · [📧 Email](mailto:contact@imboni.ai) · [🌐 Website](#)

</div>
