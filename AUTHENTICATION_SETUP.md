# Admin Authentication System Documentation

## Overview

A complete admin authentication system has been implemented for Maguru Auto with secure login, token-based authentication using Laravel Sanctum, and protected dashboard routes.

## Backend Setup

### 1. AdminController (`app/Http/Controllers/Api/AdminController.php`)

Handles all authentication operations:

- **POST /api/auth/login** - Admin login with email/password
- **POST /api/auth/logout** - Logout (requires authentication)
- **GET /api/auth/me** - Get current authenticated user
- **POST /api/auth/register** - Register new admin (protected)

**Key Features:**

- Uses Sanctum for token generation
- Returns JWT-like plaintext tokens
- Secure password verification with Hash::check()

### 2. Updated User Model (`app/Models/User.php`)

Added `HasApiTokens` trait from Laravel Sanctum for token management.

### 3. Updated API Routes (`routes/api.php`)

Organized routes into:

- **Public routes**: Car listing and details (GET only)
- **Protected routes**: All admin operations including car management and authentication
- **Auth routes**: Login and register (public), logout and me (protected)

### 4. Database Seeder (`database/seeders/DatabaseSeeder.php`)

Creates demo admin users:

- **Email**: admin@maguraauto.com
- **Password**: password123

Additional demo user:

- **Email**: manager@maguraauto.com
- **Password**: manager123

## Frontend Setup

### 1. Authentication Context (`src/lib/AuthContext.jsx`)

React Context API for global auth state management:

- Stores `user`, `token`, `isAuthenticated`, `isLoading`
- Persists auth data to localStorage
- Provides `logout()` function
- Wraps entire app with `AuthProvider`

### 2. Protected Route Component (`src/lib/ProtectedRoute.jsx`)

HOC that:

- Checks if user is authenticated
- Shows loading state while checking
- Redirects unauthenticated users to login page
- Passes location state for redirect after login

### 3. Admin Login Page (`src/pages/AdminLogin.jsx`)

Beautiful, responsive login interface featuring:

- Email and password input fields
- Form validation and error handling
- Loading states during submission
- Demo credentials display
- Glassmorphism design with gradients
- Error toast notifications
- Smooth animations with Framer Motion

### 4. Updated App.jsx

- Wraps app with `AuthProvider`
- Protects dashboard route with `ProtectedRoute`
- Adds `/admin/login` route for login page
- Routes:
  - `/admin/login` - Login page (public)
  - `/admin/dashboard` - Protected dashboard
  - `/admin` - Redirects to dashboard

### 5. Updated Dashboard (`src/pages/admin/dashboard.jsx`)

- Uses `useAuth()` hook to access authentication
- Shows current user info in header
- Added logout button in header
- Auto-redirects to login if not authenticated

## Security Features

✅ **Token-based Authentication**: Uses Laravel Sanctum for secure API tokens
✅ **Password Hashing**: Bcrypt password hashing on backend
✅ **Protected Routes**: Frontend routes require authentication
✅ **LocalStorage Persistence**: Maintains session across page refreshes
✅ **HTTP-only Considerations**: Tokens stored in localStorage (can be upgraded to httpOnly cookies)
✅ **Protected API Endpoints**: Backend routes require `auth:sanctum` middleware

## Usage Flow

### For Admins

1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@maguraauto.com`
   - Password: `password123`
3. Click "Sign In"
4. Redirected to `/admin/dashboard` on success
5. Dashboard shows user info and logout button
6. Click logout to clear session and return to login

### For Regular Users

- All car browsing routes remain public
- No authentication required for viewing cars

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
- Body: { email: string, password: string }
- Response: { message, user: { id, name, email }, token }

POST /api/auth/logout (requires auth:sanctum)
- Response: { message: "Logged out successfully" }

GET /api/auth/me (requires auth:sanctum)
- Response: { user: { id, name, email } }

POST /api/auth/register
- Body: { name, email, password, password_confirmation }
- Response: { message, user: { id, name, email }, token }
```

### Protected Car Endpoints

```
GET /api/cars (public)
POST /api/cars (requires auth:sanctum)
GET /api/cars/{id} (public)
PUT /api/cars/{id} (requires auth:sanctum)
DELETE /api/cars/{id} (requires auth:sanctum)
POST /api/cars/upload (requires auth:sanctum)
```

## Testing

### Test Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@maguraauto.com",
    "password":"password123"
  }'
```

### Test Protected Endpoint

```bash
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:8000/api/cars
```

## Next Steps (Optional Enhancements)

1. **Email Verification**: Add email verification to registration
2. **Remember Me**: Implement "Remember Me" functionality
3. **Password Reset**: Add password reset via email
4. **Two-Factor Authentication**: Add 2FA for extra security
5. **HttpOnly Cookies**: Move tokens to httpOnly cookies for better security
6. **Role-Based Access**: Implement admin/manager/user roles
7. **Activity Logging**: Log all admin actions
8. **Refresh Tokens**: Implement token refresh mechanism

## File Changes Summary

**Backend Files:**

- ✅ `app/Http/Controllers/Api/AdminController.php` (NEW)
- ✅ `app/Models/User.php` (UPDATED - Added HasApiTokens)
- ✅ `routes/api.php` (UPDATED - Auth routes added)
- ✅ `database/seeders/DatabaseSeeder.php` (UPDATED - Admin users seeding)

**Frontend Files:**

- ✅ `src/lib/AuthContext.jsx` (NEW)
- ✅ `src/lib/ProtectedRoute.jsx` (NEW)
- ✅ `src/pages/AdminLogin.jsx` (NEW)
- ✅ `src/App.jsx` (UPDATED - Auth integration)
- ✅ `src/pages/admin/dashboard.jsx` (UPDATED - Auth UI)

## Troubleshooting

**Issue: Login returns 500 error**

- ✅ Fixed: Add `HasApiTokens` trait to User model

**Issue: Redirects to login infinitely**

- Check localStorage for `authToken` and `user`
- Clear cache and reload page

**Issue: API returns 401 Unauthorized**

- Ensure token is included in `Authorization: Bearer {TOKEN}` header
- Check token hasn't expired
- Verify user still exists in database
