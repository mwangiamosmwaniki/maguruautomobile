# Seed Admin User - Setup Instructions

## Important Note

**If you encounter error: `auth/configuration-not-found` or `There is no configuration corresponding to the provided identifier`**

This means Firebase Authentication isn't fully set up on your project. Use **Option 2 (Manual Firebase Console)** instead - it's actually faster and more reliable.

---

## Quick Start

### Option 1: Use the Seeding Script (Recommended - If Firebase Auth is enabled)

**Prerequisites:**

- Firebase Authentication must be enabled in your project
- Service account key downloaded from Firebase

#### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **maguruauto** project
3. Click ** Project Settings** (gear icon, top-left)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the file as `firebase-service-account.json` in the project root directory

**Verify:** Check that `firebase-service-account.json` exists in `/home/amosjnr/Documents/maguruAuto/`

#### Step 2: Install Dependencies

```bash
cd /home/amosjnr/Documents/maguruAuto
npm install firebase-admin
```

#### Step 3: Run the Seeding Script

**Option A: With command-line arguments (easiest)**

```bash
npm run seed:admin admin@maguruauto.com SecurePassword123 "Maguru Admin"
```

**Option B: Interactive mode**

```bash
npm run seed:admin
# Then enter: email, password, name (when prompted)
```

#### Step 4: Done!

The script will create:

- Firebase Authentication user with email/password
- Firestore user document with admin role
- Display login credentials

---

### Option 2: Manual Setup via Firebase Console (Most Reliable)

**This is the recommended method if the script doesn't work.**

#### Step 1: Create Auth User

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **maguruauto** project
3. Click **Authentication** (left sidebar)
4. Click **Create user** button
5. Enter:
   - Email: `admin@maguruauto.com`
   - Password: `SecurePassword123`
6. Click **Create**

#### Step 2: Get the User ID

1. In the Users list, find your new admin user
2. Copy the **User UID** (long string like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
3. Keep this open - you'll need it in the next step

#### Step 3: Create Firestore Document

1. Click **Firestore Database** (left sidebar)
2. You should see the `users` collection (created in earlier steps)
3. Click **Add document** button
4. **Important:** For Document ID, paste your User UID (don't leave it as "Auto ID")
5. Add these fields **in this exact order**:
   - Field: `uid` (String) = the User UID
   - Field: `email` (String) = `admin@maguruauto.com`
   - Field: `name` (String) = `Maguru Admin`
   - Field: `role` (String) = `admin`
   - Field: `createdAt` (Timestamp) = today's date (click calendar → Now)
   - Field: `updatedAt` (Timestamp) = today's date (click calendar → Now)
6. Click **Save**

**If Save button is disabled:** See [FIREBASE_SAVE_BUTTON_DISABLED.md](FIREBASE_SAVE_BUTTON_DISABLED.md) for troubleshooting

---

## Verify It Works

### Test 1: Login

1. Start your app: `npm run dev`
2. Go to http://localhost:5173/admin/login
3. Enter credentials you created
4. Click **Sign In**

**Expected:** You're logged into the admin dashboard

### Test 2: Create a Car

1. In admin dashboard, click **Add New Car**
2. Fill the form and click **Submit**

**Expected:** Car appears in the list without errors

### Test 3: Check Browser Console

Open DevTools (F12) → Console and run:

```javascript
console.log(localStorage.getItem("authToken"));
```

**Expected:** Shows a long JWT token string

---

## Troubleshooting

### Error: "firebase-service-account.json not found"

**Solution:** You need to download the service account key from Firebase Console:

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `firebase-service-account.json` in project root

### Error: "Email already exists"

**Solution:** The email is already registered. Either:

- Use a different email address, OR
- Delete the existing user from Firebase Console → Authentication → Users

### Error: "Permission denied" in admin dashboard

**Solution:** Update Firestore security rules. See [FIX_CRUD_OPERATIONS.md](FIX_CRUD_OPERATIONS.md)

### Error: "User not found in database"

**Solution:** The user was created in Authentication but the Firestore document is missing. Create it manually:

1. Get the User UID from Firebase Console → Authentication
2. Create a document in Firestore → users collection with that UID
3. Add fields: email, name, role: "admin", createdAt, updatedAt

---

## What Gets Created

### In Firebase Authentication

```
Email: admin@example.com
Password: YourPassword
Display Name: Admin
Email Verified: Yes
```

### In Firestore (users collection)

```
Document ID: {uid}
Fields:
  uid: "user123abc..."
  email: "admin@example.com"
  name: "Admin"
  role: "admin"
  createdAt: 2026-02-13T...
  updatedAt: 2026-02-13T...
```

---

## Next Steps

After seeding the admin user:

1.  Update [Firestore Security Rules](FIX_CRUD_OPERATIONS.md)
2.  Login to admin dashboard
3.  Test CRUD operations (create, edit, delete cars)
4.  Manage other users via Users page

---

## Notes

- The seeding script is one-time use. You can run it multiple times to create multiple admin users.
- Service account key should be kept private (added to `.gitignore`)
- For production, consider using custom claims for role-based access control
