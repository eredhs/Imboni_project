# Complete End-to-End Testing Guide
**Date**: April 23, 2026 | **Status**: MongoDB Connected ✅

## 🚀 Quick Start

The backend is running on `http://localhost:5000`. All real data comes from MongoDB.

## 📋 Test Accounts

| Role | Email | Password | Password Hash (bcrypt) |
|------|-------|----------|------------------------|
| HR | `demohr@talentlens.ai` | `password123` | $2b$12$xzTAY.KK6KZo6toeHOkuJ... |
| Job Seeker | `demouser@talentlens.ai` | `password123` | $2b$12$Gml.7A1FhS1O0PktdwSdPO... |
| Admin | `admin@imboni.local` | `AdminPass123!` | (Set in bootstrap) |

---

## 🔐 Step 1: Get HR Authentication Token

**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demohr@talentlens.ai",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "recruiter-1",
    "email": "demohr@talentlens.ai",
    "name": "Demo Recruiter",
    "role": "recruiter",
    "organization": "TalentLens Demo Company"
  }
}
```

**Save this token as**: `$HR_TOKEN`

---

## 📌 Step 2: Get Job Seeker Authentication Token

**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demouser@talentlens.ai",
    "password": "password123"
  }'
```

**Expected Response**: Similar to HR, but with `role: "job_seeker"`

**Save this token as**: `$SEEKER_TOKEN`

---

## 💼 Step 3: HR Views Active Jobs

**Endpoint**: `GET /api/jobs`

**Request**:
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response**:
```json
{
  "jobs": [
    {
      "id": "job-1",
      "title": "Senior Full Stack Engineer",
      "hrId": "recruiter-1",
      "department": "Engineering",
      "location": "Remote",
      "status": "active",
      "applicantCount": 3,
      "requiredSkills": ["Node.js", "React", "MongoDB"],
      "preferredSkills": ["TypeScript", "AWS"],
      "minExperienceYears": 5,
      "screeningStatus": "Pending",
      "createdAt": "2024-01-15T10:00:00Z",
      "applicationDeadline": "2024-02-15T23:59:59Z"
    },
    ...
  ],
  "total": 8
}
```

**Verify**: All 8 seed jobs appear in the list ✓

---

## 🔍 Step 4: Job Seeker Browses Available Jobs

**Endpoint**: `GET /api/jobs/seeker/browse`

**Request**:
```bash
curl -X GET http://localhost:5000/api/jobs/seeker/browse \
  -H "Authorization: Bearer $SEEKER_TOKEN"
```

**Expected Response**: Same job list as HR (active jobs only)

**Verify**: 
- Only active jobs shown
- No draft/closed jobs
- Real data from JobModel collection ✓

---

## 📝 Step 5: Job Seeker Applies to Job

**Endpoint**: `POST /api/applications/:jobId/apply`

**Request** (with CV file):
```bash
curl -X POST http://localhost:5000/api/applications/job-1/apply \
  -H "Authorization: Bearer $SEEKER_TOKEN" \
  -F "userId=seeker-1" \
  -F "cv=@/path/to/cv.pdf"
```

**Expected Response**:
```json
{
  "applicationId": "app-12345",
  "jobId": "job-1",
  "userId": "seeker-1",
  "status": "pending",
  "appliedAt": "2026-04-23T12:30:00Z",
  "cvParsed": {
    "skills": ["Node.js", "React", "MongoDB"],
    "experience": 6,
    "education": "Bachelor of Science"
  }
}
```

**Verify**: 
- Application created in MongoDB
- CV parsed and stored
- Status defaults to "pending" ✓

---

## 👥 Step 6: HR Views Applications for a Job

**Endpoint**: `GET /api/jobs/:jobId/applicants`

**Request**:
```bash
curl -X GET http://localhost:5000/api/jobs/job-1/applicants \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response**:
```json
{
  "applicants": [
    {
      "id": "applicant-1",
      "jobId": "job-1",
      "userId": "seeker-1",
      "fullName": "James Uwase",
      "currentRole": "Software Engineer",
      "yearsExperience": 6,
      "email": "demouser@talentlens.ai",
      "skills": ["Node.js", "React", "MongoDB"],
      "score": 0,
      "status": "Pending",
      "confidence": "uncertain",
      "talentProfile": { ... }
    },
    ...
  ],
  "total": 14
}
```

**Verify**: 
- All applicants for this job appear
- Real applicant data from ApplicantModel
- CV content included ✓

---

## 🤖 Step 7: HR Triggers AI Screening

**Endpoint**: `POST /api/jobs/:jobId/screening/trigger`

**Request**:
```bash
curl -X POST http://localhost:5000/api/jobs/job-1/screening/trigger \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response**:
```json
{
  "jobId": "job-1",
  "screeningId": "screening-12345",
  "status": "in-progress",
  "applicantsProcessing": 14,
  "message": "Screening initiated. Results will be available shortly."
}
```

**Backend Process** (What happens):
1. Fetches all applicants for this job from ApplicantModel
2. For each applicant, sends to Gemini API:
   - Job requirements
   - CV content (parsed text)
   - Applicant profile
3. Gemini returns AI evaluation
4. Results stored in ScreeningResultModel
5. Each result includes:
   - Relevance score
   - Skill matching
   - Experience alignment
   - AI reasoning
   - Recommendation

**Verify**: 
- Real Gemini API called (check backend logs)
- Results stored in MongoDB
- No hardcoded scores ✓

---

## 📊 Step 8: HR Views Screening Results

**Endpoint**: `GET /api/jobs/:jobId/screening/results`

**Request**:
```bash
curl -X GET http://localhost:5000/api/jobs/job-1/screening/results \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response**:
```json
{
  "jobId": "job-1",
  "screeningStatus": "Completed",
  "results": [
    {
      "id": "screening-result-1",
      "jobId": "job-1",
      "applicantId": "applicant-1",
      "userId": "seeker-1",
      "score": 85,
      "status": "Shortlisted",
      "recommendation": "Strong match. Recommend for interview.",
      "reasoning": "Candidate has required Node.js and React experience...",
      "skillGaps": ["AWS"],
      "scoreBreakdown": [
        { "label": "Technical Skills", "value": 90 },
        { "label": "Experience Level", "value": 85 },
        { "label": "Soft Skills", "value": 75 }
      ],
      "topCandidateLabel": "⭐ Top Candidate",
      "verifiedExpertise": true
    },
    {
      "id": "screening-result-2",
      "applicantId": "applicant-2",
      "score": 42,
      "status": "Rejected",
      "recommendation": "Does not meet minimum requirements.",
      "reasoning": "Lacks required backend experience..."
    }
  ],
  "shortlistedCount": 4,
  "rejectedCount": 8,
  "pendingCount": 2
}
```

**Verify**: 
- Ranked by score (highest first)
- Real AI evaluations from Gemini
- Shortlist generated automatically
- Data from ScreeningResultModel ✓

---

## 🔔 Step 9: HR Sends Notifications to Shortlisted Candidates

**Endpoint**: `PATCH /api/applications/:applicationId/status`

**Request**:
```bash
curl -X PATCH http://localhost:5000/api/applications/app-1/status \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "note": "Congratulations! You have been shortlisted for an interview."
  }'
```

**Expected Response**:
```json
{
  "applicationId": "app-1",
  "userId": "seeker-1",
  "jobId": "job-1",
  "status": "shortlisted",
  "updatedAt": "2026-04-23T12:45:00Z",
  "notification": {
    "id": "notif-12345",
    "userId": "seeker-1",
    "type": "application_status_update",
    "message": "Your application for 'Senior Full Stack Engineer' has been shortlisted!",
    "read": false,
    "createdAt": "2026-04-23T12:45:00Z"
  }
}
```

**Backend Process**:
1. Updates ApplicationModel status to "shortlisted"
2. Creates NotificationModel record for the seeker
3. Returns notification object
4. (Optional) Sends email if email service configured

**Verify**: 
- Application status changed in MongoDB
- Notification created in NotificationModel
- Notification NOT hardcoded, created from real data ✓

---

## 📱 Step 10: Job Seeker Sees Result in Tracker

**Endpoint**: `GET /api/applications/user/:userId`

**Request**:
```bash
curl -X GET http://localhost:5000/api/applications/user/seeker-1 \
  -H "Authorization: Bearer $SEEKER_TOKEN"
```

**Expected Response**:
```json
{
  "applications": [
    {
      "id": "app-1",
      "jobId": "job-1",
      "jobTitle": "Senior Full Stack Engineer",
      "company": "TalentLens Demo Company",
      "status": "shortlisted",
      "appliedAt": "2026-04-23T10:00:00Z",
      "screeningScore": 85,
      "interview": {
        "date": "2026-04-30T14:00:00Z",
        "location": "Remote",
        "type": "video",
        "link": "https://meet.google.com/..."
      },
      "notes": [
        {
          "id": "note-1",
          "author": "Demo Recruiter",
          "text": "Great background. Looking forward to interview.",
          "createdAt": "2026-04-23T12:45:00Z"
        }
      ]
    },
    {
      "id": "app-2",
      "jobId": "job-3",
      "jobTitle": "Data Scientist",
      "status": "rejected",
      "appliedAt": "2026-04-20T09:00:00Z",
      "reason": "Does not meet minimum requirements"
    }
  ],
  "total": 2,
  "shortlisted": 1,
  "rejected": 1
}
```

**Verify**: 
- All applications for this user from ApplicationModel
- Real status from database
- Screening scores included (if screened)
- Interview details if scheduled ✓

---

## 🔔 Step 11: Job Seeker Gets Notifications

**Endpoint**: `GET /api/notifications/:userId`

**Request**:
```bash
curl -X GET http://localhost:5000/api/notifications/seeker-1 \
  -H "Authorization: Bearer $SEEKER_TOKEN"
```

**Expected Response**:
```json
{
  "notifications": [
    {
      "id": "notif-12345",
      "userId": "seeker-1",
      "type": "application_status_update",
      "title": "Application Shortlisted",
      "message": "Your application for 'Senior Full Stack Engineer' has been shortlisted!",
      "relatedId": "app-1",
      "read": false,
      "createdAt": "2026-04-23T12:45:00Z"
    },
    {
      "id": "notif-12346",
      "type": "interview_scheduled",
      "title": "Interview Scheduled",
      "message": "Interview scheduled for April 30, 2026 at 2:00 PM",
      "relatedId": "app-1",
      "read": false,
      "createdAt": "2026-04-23T13:00:00Z"
    }
  ],
  "unreadCount": 2
}
```

**Verify**: 
- Notifications from NotificationModel
- Real status changes trigger notifications
- No hardcoded messages ✓

---

## 📅 Step 12: Seeker Opens Interview Details

**Endpoint**: `GET /api/applications/:applicationId`

**Request**:
```bash
curl -X GET http://localhost:5000/api/applications/app-1 \
  -H "Authorization: Bearer $SEEKER_TOKEN"
```

**Expected Response**:
```json
{
  "id": "app-1",
  "jobId": "job-1",
  "userId": "seeker-1",
  "status": "shortlisted",
  "appliedAt": "2026-04-23T10:00:00Z",
  "job": {
    "id": "job-1",
    "title": "Senior Full Stack Engineer",
    "department": "Engineering",
    "location": "Remote"
  },
  "interview": {
    "id": "interview-1",
    "date": "2026-04-30T14:00:00Z",
    "duration": 60,
    "type": "video",
    "location": "Remote",
    "link": "https://meet.google.com/abc-def-ghi",
    "interviewer": {
      "name": "Demo Recruiter",
      "email": "demohr@talentlens.ai"
    },
    "instructions": "Join 5 minutes early. Camera on required."
  },
  "screeningResult": {
    "score": 85,
    "recommendation": "Strong match",
    "reasoning": "..."
  },
  "notes": [...]
}
```

**Verify**: 
- Interview details from ApplicationModel.interview
- Real scheduled date/time
- Interview link valid
- Interviewer info populated ✓

---

## 📆 Step 13: Add to Calendar

**Frontend Implementation** (What the UI does):

```javascript
// Extract interview details from application
const { interview } = applicationData;

// Create calendar event
const calendarEvent = {
  title: `Interview - ${jobTitle}`,
  startTime: interview.date,  // ISO 8601: "2026-04-30T14:00:00Z"
  endTime: new Date(new Date(interview.date).getTime() + interview.duration * 60000),
  description: `Interview with ${interview.interviewer.name}`,
  location: interview.link || interview.location,
  attendees: [interview.interviewer.email]
};

// Add to Google Calendar / Outlook / Apple Calendar
// Uses native browser APIs or calendar service integration
```

**Data Source Verification**:
- Interview date: `ApplicationModel.interview.date`
- Duration: `ApplicationModel.interview.duration`
- Link: `ApplicationModel.interview.link`
- Interviewer: `ApplicationModel.interview.interviewer`

**Verify**: 
- All data comes from MongoDB
- No hardcoded dates
- Real calendar integration ✓

---

## ✅ Complete E2E Validation Checklist

- [ ] **Step 1-2**: Auth tokens obtained for both HR and Seeker
- [ ] **Step 3**: HR sees all 8 seed jobs (real data)
- [ ] **Step 4**: Seeker browses only active jobs
- [ ] **Step 5**: Application created with CV parsed (MongoDB)
- [ ] **Step 6**: HR sees all 14 applicants (real data)
- [ ] **Step 7**: AI screening triggered with real Gemini API
- [ ] **Step 8**: Screening results ranked with scores (MongoDB)
- [ ] **Step 9**: Notifications created on status update (MongoDB)
- [ ] **Step 10**: Seeker sees all applications with real status
- [ ] **Step 11**: Seeker views notifications (MongoDB)
- [ ] **Step 12**: Interview details fully populated (MongoDB)
- [ ] **Step 13**: Calendar event uses real dates (not mocked)

---

## 🛠️ Testing Tips

1. **Use Postman** for easier testing: Import the cURL commands above
2. **Check MongoDB** directly to verify data:
   ```bash
   # In MongoDB Atlas, query:
   db.applications.find({})
   db.screeningresults.find({})
   db.notifications.find({})
   ```
3. **Monitor backend logs** to verify:
   - API calls received
   - Gemini API calls made
   - MongoDB operations
   - Error messages

4. **Frontend Testing** (When ready):
   - Start frontend: `cd frontend && npm run dev`
   - Navigate to `http://localhost:3001`
   - Log in with test accounts
   - Follow the UI flow

---

## 🔗 API Reference

| Method | Endpoint | Auth Required | Role(s) | Purpose |
|--------|----------|---------------|---------|---------|
| POST | `/api/auth/login` | ❌ | All | Get token |
| GET | `/api/jobs` | ✅ | recruiter, system_controller | List jobs |
| GET | `/api/jobs/seeker/browse` | ✅ | job_seeker | Browse active jobs |
| POST | `/api/applications/:jobId/apply` | ✅ | job_seeker | Submit application |
| GET | `/api/jobs/:jobId/applicants` | ✅ | recruiter | View applicants |
| POST | `/api/jobs/:jobId/screening/trigger` | ✅ | recruiter | Start AI screening |
| GET | `/api/jobs/:jobId/screening/results` | ✅ | recruiter | View AI results |
| PATCH | `/api/applications/:appId/status` | ✅ | recruiter | Update application status |
| POST | `/api/applications/:appId/interview` | ✅ | recruiter | Schedule interview |
| GET | `/api/applications/user/:userId` | ✅ | job_seeker, recruiter | View applications |
| GET | `/api/notifications/:userId` | ✅ | job_seeker, recruiter | View notifications |
| GET | `/api/applications/:appId` | ✅ | job_seeker, recruiter | View app details |

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All data persists in MongoDB (not in-memory)
- No mock data or fake timers used
- Gemini API required for AI screening (check `GEMINI_API_KEY` in `.env`)
- Consider rate limits on Gemini API for large-scale testing

---

**Last Updated**: April 23, 2026
**Backend Status**: ✅ Running on port 5000
**MongoDB Status**: ✅ Connected
**Data Mode**: `mongo` (Real Database)
