# MongoDB Atlas Quick Setup - Copy & Paste Commands

## 1️⃣ Create Your `.env` File

Navigate to backend folder and create `.env` file:

```bash
cd backend
```

Create file `.env` with this template (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
DATA_MODE=mongo
MONGODB_URI=mongodb+srv://imboni_user:YOUR_PASSWORD@your-cluster-name.mongodb.net/imboni?retryWrites=true&w=majority
JWT_SECRET=dev-jwt-secret-key
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3001
ADMIN_SECRET_KEY=dev-admin-secret-key
NODE_ENV=development
```

---

## 2️⃣ Get Your MongoDB Atlas Connection String

**Quick Steps:**
1. Login: https://cloud.mongodb.com
2. Go to **Databases** → Click your cluster **"Connect"**
3. Select **"Drivers"** → **Node.js**
4. Copy connection string
5. Replace:
   - `<username>` → `imboni_user`
   - `<password>` → your password
   - Replace `myFirstDatabase` → `imboni`

**Result should look like:**
```
mongodb+srv://imboni_user:MyPassword123@imboni-development.mongodb.net/imboni?retryWrites=true&w=majority
```

---

## 3️⃣ Paste Into .env

```env
MONGODB_URI=mongodb+srv://imboni_user:MyPassword123@imboni-development.mongodb.net/imboni?retryWrites=true&w=majority
```

---

## 4️⃣ Test Connection

Run in terminal (from backend folder):

```bash
npm run dev
```

**Expected output:**
```
✓ Connected to MongoDB Atlas
✓ Database initialized
✓ Server running on port 5000
```

---

## 5️⃣ Verify in Frontend

1. Start frontend (different terminal):
   ```bash
   cd frontend
   npm run dev
   ```

2. Open: http://localhost:3001
3. Login and see data from MongoDB ✅

---

## 🆘 Common Password Issues

**If password has these characters, URL-encode them:**

| Character | URL Encode |
|-----------|-----------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `:` | `%3A` |
| `/` | `%2F` |

**Example:**
- Password: `Pass@123#456`
- In URI: `Pass%40123%23456`

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 free tier)
- [ ] Database user created (imboni_user)
- [ ] IP added to Network Access allowlist
- [ ] Connection string copied
- [ ] `.env` file created in backend folder
- [ ] `DATA_MODE=mongo` in .env
- [ ] `MONGODB_URI` contains correct credentials
- [ ] `npm install` run
- [ ] `npm run dev` running without errors
- [ ] Frontend connects and shows data

---

## 🚨 If It Fails

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Test connection:**
   ```bash
   npx ts-node scripts/test-atlas-connection.ts
   ```

3. **Common fixes:**
   - IP not in allowlist? Add it in MongoDB Atlas Security > Network Access
   - Wrong password? Check MongoDB Atlas Database Users
   - Special characters? URL-encode them (see table above)
   - Cluster paused? Resume in MongoDB Atlas Dashboard

---

## 📞 Need Help?

- Check error message carefully
- Follow the troubleshooting guide in `MONGODB_ATLAS_SETUP.md`
- Test connection with: `npx ts-node scripts/test-atlas-connection.ts`

**Done! You now have MongoDB Atlas connected! 🎉**
