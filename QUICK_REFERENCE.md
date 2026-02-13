# Quick Reference: Admin Setup

## TL;DR - Just Do This

### If Node Script Works (faster)

```bash
npm run seed:admin admin@maguruauto.com SecurePassword123 "Maguru Admin"
```

### If You Get `auth/configuration-not-found` Error

Use **Manual Firebase Console** method below instead (takes 2 minutes)

---

## Manual Firebase Console Method (Recommended)

### 1. Create Auth User (1 min)

```
Firebase Console → Authentication → Users → Create user
Email: admin@maguruauto.com
Password: SecurePassword123
```

### 2. Copy User ID

In the users list, copy the long **User UID** string

### 3. Create Firestore Document (1 min)

```
Firestore → Create Collection "users"
Document ID: (paste User UID from step 2)
Fields:
  uid: "...(the user id)"
  email: "admin@maguruauto.com"
  name: "Maguru Admin"
  role: "admin"
  createdAt: server timestamp
  updatedAt: server timestamp
```

### 4. Update Security Rules (1 min)

```
Firestore → Rules → Paste rules from COMPLETE_SETUP_GUIDE.md
Click Publish
```

### 5. Hard Refresh (10 sec)

```
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### 6. Test Login (1 min)

```
http://localhost:5173/admin/login
Use: admin@maguruauto.com / SecurePassword123
```

---

## Credentials Created

| Item     | Value                |
| -------- | -------------------- |
| Email    | admin@maguruauto.com |
| Password | SecurePassword123    |
| Role     | admin                |
| Status   | Active               |

---

## Common Issues

| Error                                 | Fix                                |
| ------------------------------------- | ---------------------------------- |
| `auth/configuration-not-found`        | Use manual Firebase Console method |
| `auth/email-already-exists`           | Use different email                |
| `Missing or insufficient permissions` | Publish Firestore rules            |
| `User not found in database`          | Create Firestore user document     |

---

## Commands

```bash
# Seed admin (if script works)
npm run seed:admin email password name

# Start frontend
npm run frontend

# Build frontend
npm run frontend:build
```

---

**Total time: ~5 minutes**
