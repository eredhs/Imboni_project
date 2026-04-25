# 🚀 Quick Reference - Complete E2E Test

**Backend**: ✅ Running on port 5000 | **MongoDB**: ✅ Connected | **Seed Data**: ✅ Loaded

---

## 📋 Test Accounts

```
HR:     demohr@talentlens.ai / password123
Seeker: demouser@talentlens.ai / password123
Admin:  admin@imboni.local / AdminPass123!
```

---

## 🎯 Complete E2E Flow (Steps 1-13)

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: HR Posts Job                                       │
│  - HR logs in                                               │
│  - Creates job posting (title, skills, location, etc)       │
│  - Job saved to MongoDB JobModel                            │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Seeker Browses Jobs                                │
│  - Seeker logs in                                           │
│  - Views available jobs (GET /jobs/seeker/browse)           │
│  - Real data from MongoDB JobModel                          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Seeker Applies with CV                             │
│  - Selects job and submits CV file                          │
│  - CV parsed (PDF/Word) and stored                          │
│  - Application created in MongoDB ApplicationModel          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: HR Sees Applications                               │
│  - HR views applicants: GET /jobs/:id/applicants            │
│  - All applications from MongoDB ApplicantModel             │
│  - Shows scores, skills, experience                         │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: HR Runs AI Screening                               │
│  - HR triggers: POST /jobs/:id/screening/trigger            │
│  - For each applicant: CV + requirements → Gemini API       │
│  - AI evaluates fit, skills, experience                     │
│  - Results stored in MongoDB ScreeningResultModel           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Shortlist Generated                                │
│  - Results ranked automatically by score                    │
│  - Top candidates: "Shortlisted" (score > 70)              │
│  - Others: "Rejected" or "Review"                           │
│  - GET /jobs/:id/screening/results shows full shortlist     │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 7: HR Sends Notifications                             │
│  - HR updates application status                            │
│  - PATCH /applications/:id/status with new status           │
│  - NotificationModel record created for seeker              │
│  - Notification: "You've been shortlisted for interview"    │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 8: Seeker Sees Result in Tracker                      │
│  - Seeker logs in                                           │
│  - Views GET /applications/user/:userId                     │
│  - Sees application status: "shortlisted"                   │
│  - Sees AI screening score: 85/100                          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 9: Seeker Views Notifications                         │
│  - GET /notifications/:userId                              │
│  - Sees: "Your application has been shortlisted!"           │
│  - All from real MongoDB NotificationModel data             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 10: Seeker Opens Interview Details                    │
│  - GET /applications/:id                                    │
│  - Sees interview scheduled:                                │
│    - Date: 2026-04-30T14:00:00Z                             │
│    - Link: https://meet.google.com/...                      │
│    - Interviewer: Demo Recruiter                            │
│  - All from MongoDB ApplicationModel                        │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 11: Add to Calendar Works                             │
│  - Frontend extracts interview.date from API response       │
│  - Creates calendar event with real details                 │
│  - No hardcoded dates - uses actual interview.date          │
│  - Works with Google Calendar, Outlook, Apple Calendar      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Quick Test Commands

### 1. Get HR Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demohr@talentlens.ai","password":"password123"}'
```

### 2. Get Seeker Token  
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demouser@talentlens.ai","password":"password123"}'
```

### 3. View Jobs (as HR)
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer {HR_TOKEN}"
```

### 4. Browse Jobs (as Seeker)
```bash
curl -X GET http://localhost:5000/api/jobs/seeker/browse \
  -H "Authorization: Bearer {SEEKER_TOKEN}"
```

### 5. View Applicants (as HR)
```bash
curl -X GET http://localhost:5000/api/jobs/job-1/applicants \
  -H "Authorization: Bearer {HR_TOKEN}"
```

### 6. Run AI Screening (as HR)
```bash
curl -X POST http://localhost:5000/api/jobs/job-1/screening/trigger \
  -H "Authorization: Bearer {HR_TOKEN}"
```

### 7. View Screening Results (as HR)
```bash
curl -X GET http://localhost:5000/api/jobs/job-1/screening/results \
  -H "Authorization: Bearer {HR_TOKEN}"
```

### 8. View Applications (as Seeker)
```bash
curl -X GET http://localhost:5000/api/applications/user/seeker-1 \
  -H "Authorization: Bearer {SEEKER_TOKEN}"
```

### 9. View Notifications (as Seeker)
```bash
curl -X GET http://localhost:5000/api/notifications/seeker-1 \
  -H "Authorization: Bearer {SEEKER_TOKEN}"
```

### 10. View Application Details
```bash
curl -X GET http://localhost:5000/api/applications/app-1 \
  -H "Authorization: Bearer {SEEKER_TOKEN}"
```

---

## 📊 Current Data in MongoDB

| Collection | Count | Purpose |
|------------|-------|---------|
| users | 5 | HR, seekers, admin |
| jobs | 8 | Active job postings |
| applicants | 14 | All applicants |
| screeningresults | 10 | AI evaluation results |
| applications | ? | Application records |
| notifications | ? | User notifications |

---

## ✅ Data Verification

Every response contains **REAL** data:
- ✅ No hardcoded arrays
- ✅ No mock fixtures
- ✅ No test data helpers
- ✅ Real Gemini API calls
- ✅ Real MongoDB queries
- ✅ Zero fake timers

---

## 🔗 Important URLs

- **Backend**: http://localhost:5000
- **API Docs**: See E2E_TESTING.md
- **MongoDB Atlas**: cloud.mongodb.com
- **Your IP**: 197.157.186.164 (whitelisted in Atlas)

---

## 📝 Testing Approach

1. **Get tokens** for HR and Seeker
2. **Verify jobs** are loaded from MongoDB
3. **Check applicants** exist in database
4. **Trigger AI screening** - watch for Gemini API calls
5. **View results** - verify scores are AI-generated
6. **Test notifications** - create and retrieve
7. **Check interview details** - verify dates are real
8. **Test calendar** - ensure integration works

---

## 🎯 Success Indicators

✅ HR logs in successfully
✅ Seeker logs in successfully  
✅ Jobs appear (8 total from MongoDB)
✅ Applicants visible (14 total from MongoDB)
✅ AI screening produces scores (not hardcoded)
✅ Shortlist ranking by score
✅ Notifications created and retrieved
✅ Interview details with real dates
✅ Calendar integration works
✅ All data from MongoDB (verified)

---

## 💾 Database Confirmation

Backend startup logs confirm:
```
[db] connected              ✅ MongoDB connected
[db] ensured 5 seed users   ✅ Users loaded
[db] ensured 8 seed jobs    ✅ Jobs loaded  
[db] ensured 14 seed applicants ✅ Applicants loaded
[db] ensured 10 screening results ✅ Results loaded
[server] running on port 5000 ✅ Server ready
```

---

**Ready to test!** Follow the flow above using the API commands or frontend UI.
