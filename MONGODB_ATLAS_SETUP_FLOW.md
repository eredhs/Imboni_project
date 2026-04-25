# MongoDB Atlas Setup - Visual Flow

## Complete Setup Flow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: CREATE MONGODB ATLAS ACCOUNT                       │
├─────────────────────────────────────────────────────────────┤
│  1. Go to: https://www.mongodb.com/cloud/atlas              │
│  2. Click "Sign Up"                                         │
│  3. Enter email, password, company name                     │
│  4. Verify email                                            │
│  5. Login                                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: CREATE CLUSTER                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Click "Build a Database"                                │
│  2. Select "M0 (Free)" tier                                 │
│  3. Choose AWS region (closest to you)                      │
│  4. Name: "imboni-development"                              │
│  5. Click "Create"                                          │
│  6. Wait 2-5 minutes ⏳                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: CREATE DATABASE USER                               │
├─────────────────────────────────────────────────────────────┤
│  1. Go to "Security Quickstart"                             │
│  2. Create database user:                                   │
│     - Username: imboni_user                                 │
│     - Password: Strong password (save it!)                  │
│  3. Click "Create Database User"                            │
│  4. SAVE CREDENTIALS SECURELY                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: ALLOW NETWORK ACCESS                               │
├─────────────────────────────────────────────────────────────┤
│  1. Click "Add My Current IP Address"                       │
│  2. For development: "Allow Access from Anywhere"           │
│     (0.0.0.0/0)                                             │
│  3. Click "Finish and Close"                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: GET CONNECTION STRING                              │
├─────────────────────────────────────────────────────────────┤
│  1. Go to "Databases"                                       │
│  2. Click "Connect" on cluster                              │
│  3. Choose "Drivers"                                        │
│  4. Select Node.js                                          │
│  5. Copy connection string:                                 │
│                                                             │
│  mongodb+srv://imboni_user:PASSWORD@cluster.mongodb.net    │
│  /?retryWrites=true&w=majority                              │
│                                                             │
│  Replace PASSWORD with your password                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: CREATE .env FILE IN BACKEND                        │
├─────────────────────────────────────────────────────────────┤
│  File location: backend/.env                                │
│                                                             │
│  PORT=5000                                                  │
│  NODE_ENV=development                                       │
│  DATA_MODE=mongo                                            │
│  MONGODB_URI=mongodb+srv://imboni_user:PASSWORD@            │
│  imboni-development.mongodb.net/imboni?                     │
│  retryWrites=true&w=majority                                │
│  JWT_SECRET=your-secret-key                                 │
│  JWT_REFRESH_SECRET=your-refresh-secret                     │
│  GEMINI_API_KEY=your-gemini-key                             │
│  FRONTEND_URL=http://localhost:3001                         │
│  ADMIN_SECRET_KEY=your-admin-secret                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: INSTALL DEPENDENCIES                               │
├─────────────────────────────────────────────────────────────┤
│  Terminal commands:                                         │
│                                                             │
│  $ cd backend                                               │
│  $ npm install                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: START DEVELOPMENT SERVER                           │
├─────────────────────────────────────────────────────────────┤
│  Terminal command:                                          │
│                                                             │
│  $ npm run dev                                              │
│                                                             │
│  Expected output:                                           │
│  ✓ Connected to MongoDB Atlas                               │
│  ✓ Server running on port 5000                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 9: VERIFY CONNECTION                                  │
├─────────────────────────────────────────────────────────────┤
│  1. Terminal (new window):                                  │
│     $ cd frontend                                           │
│     $ npm run dev                                           │
│                                                             │
│  2. Open: http://localhost:3001                             │
│                                                             │
│  3. Login and verify dashboard shows data                   │
│                                                             │
│  ✅ SUCCESS: MongoDB Atlas is connected!                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Connection String Anatomy

```
mongodb+srv://imboni_user:MyPassword123@imboni-development.mongodb.net/imboni?retryWrites=true&w=majority
       │                │               │                        │       │  │          │           │
       │                │               │                        │       │  │          │           └─ Write concern
       │                │               │                        │       │  │          └────────────── Retry writes
       │                │               │                        │       │  └─────────────────────── Database name
       │                │               │                        │       └──────────────────────── Port info
       │                │               │                        └─────────────────────────────── Cluster host
       │                │               └──────────────────────────────────────────────────────── Username
       │                └────────────────────────────────────────────────────────────────────── Password
       └──────────────────────────────────────────────────────────────────────────────────── Protocol (SRV)
```

---

## Password URL Encoding Reference

If your password contains special characters:

| Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|
| `@` | `%40` | `*` | `%2A` |
| `#` | `%23` | `/` | `%2F` |
| `$` | `%24` | `?` | `%3F` |
| `%` | `%25` | `=` | `%3D` |
| `:` | `%3A` | `&` | `%26` |

**Example:**
- Raw password: `Pass@word#123$ABC`
- URL encoded: `Pass%40word%23123%24ABC`

---

## Troubleshooting Decision Tree

```
ERROR ON npm run dev?
│
├─ "ENOTFOUND" or "querySrv ENOTFOUND"?
│  └─→ Check internet connection
│      Check cluster name in URI
│      Verify DNS settings
│
├─ "ETIMEDOUT"?
│  └─→ Add your IP to Network Access
│      Check firewall settings
│      Make sure cluster is running (not paused)
│
├─ "Authentication failed" or "bad auth"?
│  └─→ Check username: imboni_user
│      Check password is correct
│      Verify special chars are URL-encoded
│      Check user exists in MongoDB Atlas
│
├─ "MONGODB_URI is not set"?
│  └─→ Check .env file exists in backend folder
│      Check MONGODB_URI variable is defined
│      Check file is named exactly ".env" (no .env.txt)
│
└─ Other error?
   └─→ Run: npx ts-node scripts/test-atlas-connection.ts
       Read error message carefully
       Check MONGODB_ATLAS_SETUP.md for details
```

---

## File Locations Checklist

```
Imboni_project-main/
├── backend/
│   ├── .env                           ← CREATE THIS FILE
│   ├── .env.example                   ← Reference template
│   ├── package.json
│   ├── QUICK_MONGODB_SETUP.md         ← Quick reference
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                  ← Already configured ✓
│   │   │   └── env.ts                 ← Already configured ✓
│   │   └── server.ts
│   └── scripts/
│       └── test-atlas-connection.ts   ← Use to test connection
│
└── MONGODB_ATLAS_SETUP.md             ← Complete guide
```

---

## Test Commands

```bash
# Test connection to MongoDB Atlas
npx ts-node scripts/test-atlas-connection.ts

# Start development server with MongoDB
npm run dev

# Check if .env file exists
ls -la .env

# View .env file (careful: shows passwords)
cat .env
```

---

## Success Indicators

✅ **All of these should be true:**

- [ ] `.env` file exists in backend folder
- [ ] `DATA_MODE=mongo` in .env
- [ ] `MONGODB_URI` has your credentials
- [ ] `npm run dev` shows "Connected to MongoDB Atlas"
- [ ] Frontend at http://localhost:3001 loads without seed data message
- [ ] Dashboard shows real data from MongoDB
- [ ] No "MONGODB_URI is not set" errors
- [ ] No authentication errors in console

**If all checked: 🎉 YOU'RE DONE!**

---

## Next: Production Setup

When ready for production:

1. Create second cluster: `imboni-production`
2. Create production database user
3. Update deployment environment variables
4. Configure IP allowlist for server
5. Enable backups
6. Set up monitoring
