# IMBONI Testing Guide

## Start the app

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Required environment configuration

Set these values in `backend/.env` before testing:

```env
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
ADMIN_SECRET_KEY=your-admin-secret
SYSTEM_CONTROLLER_BOOTSTRAP_EMAIL=admin@example.com
SYSTEM_CONTROLLER_BOOTSTRAP_PASSWORD=strong-password-here
SYSTEM_CONTROLLER_BOOTSTRAP_NAME=System Controller
```

## Core test flows

### Recruiter
1. Log in as a recruiter.
2. Create or open a job.
3. Upload applicants or create real applications.
4. Run screening.
5. Open `/shortlist?jobId=<jobId>` and verify the real shortlist loads.

### Job seeker
1. Register or log in as a job seeker.
2. Browse live jobs from `/seeker/browse`.
3. Apply to a real job.
4. Open `/seeker/applications` and confirm the application is present.
5. After screening completes, open `/seeker/notifications` and confirm shortlist notifications appear.

### System controller
1. Use the configured admin email and password from `backend/.env`.
2. Verify the admin secret key through `/auth/admin/login`.
3. Confirm admin-only routes reject non-admin accounts.

## Deployment gate

Do not deploy until these pass:

- `backend/npm run build`
- `frontend/npm run build`
- recruiter login and screening flow
- job seeker browse, apply, application tracking, notifications flow
- shortlist route loads real screening results without relying on temporary UI state
