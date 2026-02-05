# Access Control & Redirect Implementation

## Overview

Complete access control system with intelligent redirects, session management, and authentication flow optimization.

## Frontend Access Control

### 1. Protected Route Component (`src/lib/ProtectedRoute.jsx`)

#### ProtectedRoute - Restricts unauthenticated access

```jsx
<ProtectedRoute>
  <MaguruAutoDashboard />
</ProtectedRoute>
```

- **Behavior**: Blocks access to dashboard if not authenticated
- **Redirect**: Sends unauthenticated users to `/admin/login`
- **State**: Preserves original location for post-login redirect
- **Loading**: Shows loading state while checking authentication

#### PublicRoute - Restricts authenticated access

```jsx
<PublicRoute>
  <AdminLogin />
</PublicRoute>
```

- **Behavior**: Blocks access to login page if already authenticated
- **Redirect**: Sends authenticated users to `/admin/dashboard`
- **Use Case**: Prevents authenticated users from accessing login page

### 2. Route Configuration (`src/App.jsx`)

**Login Route** (Public - requires non-authenticated state)

```
GET /admin/login
└─ Protected by: PublicRoute
└─ Redirects to: /admin/dashboard (if already logged in)
```

**Dashboard Routes** (Protected - requires authentication)

```
GET /admin/dashboard
└─ Protected by: ProtectedRoute
└─ Redirects to: /admin/login (if not authenticated)

GET /admin
└─ Protected by: ProtectedRoute
└─ Same protection as /admin/dashboard
```

### 3. Session Management (`src/lib/AuthContext.jsx`)

**State Persistence**

- Tokens stored in `localStorage['authToken']`
- User info stored in `localStorage['user']`
- Automatically restored on app reload
- Loading state prevents race conditions

**Logout Behavior**

```javascript
logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
  setToken(null)
  setUser(null)
  // Redirect to /admin/login happens in dashboard
}
```

### 4. Authenticated API Calls

**Helper Function** (`dashboard.jsx`)

```javascript
const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`, // Add auth token
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle expired/invalid tokens
  if (response.status === 401) {
    logout();
    navigate("/admin/login");
    showToast("Session expired. Please login again.", "error");
    throw new Error("Unauthorized");
  }

  return response;
};
```

**Protected Endpoints Using Helper**

- `POST /api/cars` - Create car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car
- `POST /api/cars/upload` - Upload images
- `GET /api/cars` (with token) - Fetch cars with auth

## Backend Access Control

### 1. Authentication Middleware (`Kernel.php`)

```php
'sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
'api' => [
    // ... existing middleware
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
],
```

### 2. Protected Routes (`routes/api.php`)

**Public Routes** (No authentication required)

```
GET /api/cars               # List all cars
GET /api/cars/{id}          # Get single car
```

**Protected Routes** (Requires `auth:sanctum`)

```
POST   /api/cars            # Create car
PUT    /api/cars/{id}       # Update car
DELETE /api/cars/{id}       # Delete car
POST   /api/cars/upload     # Upload images
```

**Auth Routes**

```
POST   /api/auth/login      # Public - Login
POST   /api/auth/register   # Public - Register (optional)
POST   /api/auth/logout     # Protected - Logout
GET    /api/auth/me         # Protected - Get current user
```

### 3. Sanctum Token Authentication

**Token Generation** (on login)

```php
$token = $user->createToken('admin-token', ['admin'])->plainTextToken;
```

**Token Validation** (on protected requests)

- Checks `Authorization: Bearer {TOKEN}` header
- Validates token against database
- Returns 401 if token invalid/expired
- Returns 401 if no token provided

### 4. CORS Configuration (`config/cors.php`)

**Allowed Origins**

- `http://localhost:5173` - Frontend dev server
- `http://localhost:3000` - Alternative dev port

**Allowed Methods**

- `GET, POST, PUT, DELETE, OPTIONS`

**Exposed Headers**

- All headers exposed for client access

**Credentials**

- `supports_credentials: false` (can be changed for cookie-based auth)

## Security Features

### 🔐 Token Management

- ✅ Tokens stored in `Authorization` header (not cookies by default)
- ✅ Tokens validated server-side for every protected request
- ✅ 401 response triggers automatic logout and redirect

### 🚫 Access Prevention

- ✅ Authenticated users blocked from login page
- ✅ Unauthenticated users blocked from dashboard
- ✅ Invalid tokens automatically revoke session
- ✅ Expired sessions logged out with notification

### 🛡️ Error Handling

- ✅ Generic "Invalid email or password" (prevents user enumeration)
- ✅ Session expiry notifies user
- ✅ Network errors show friendly messages
- ✅ Validation errors show specific field issues

## Redirect Flow Diagram

```
┌─────────────────────┐
│   User Not Logged   │
└──────────┬──────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
    ┌──────▼──────┐                   ┌─────────▼────────┐
    │  Visit /    │                   │ Visit /admin/... │
    └──────┬──────┘                   └────────┬─────────┘
           │                                    │
    ┌──────▼──────────────────┐         ┌──────▼──────┐
    │ Shows public site       │         │ Redirects  │
    │ (no redirect)           │         │ to login   │
    └─────────────────────────┘         └──────┬──────┘
                                               │
                                        ┌──────▼──────────────┐
                                        │ Login Page          │
                                        │ (PublicRoute)       │
                                        └──────┬──────────────┘
                                               │
                                        ┌──────▼──────────────┐
                                        │ User logs in        │
                                        │ Token stored        │
                                        └──────┬──────────────┘
                                               │
                ┌──────────────────────────────┘
                │
     ┌──────────▼──────────┐
     │  User Logged In     │
     └──────────┬──────────┘
                │
        ┌───────┴────────┐
        │                │
   ┌────▼─────┐    ┌────▼─────────────┐
   │Visit /   │    │Visit /admin/...  │
   │Shows site│    │Dashboard (OK)    │
   └──────────┘    └──────────────────┘
        │                    │
        │         ┌──────────┘
        │         │ Logout click
        │    ┌────▼──────────────┐
        │    │Token cleared      │
        │    │Redirects to login │
        │    └────┬──────────────┘
        │         │
        └─────────┴──────────┐
                             │
                   ┌─────────▼──────────┐
                   │   Back to Login    │
                   └────────────────────┘
```

## Testing Access Control

### Test 1: Prevent unauthenticated access

```bash
# Try accessing protected endpoint without token
curl http://localhost:8000/api/cars \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Car"}'

# Response: 401 Unauthorized
```

### Test 2: Prevent authenticated access to login

1. Login at `http://localhost:5173/admin/login`
2. Try accessing `/admin/login` again
3. Should redirect to `/admin/dashboard`

### Test 3: Session expiry

1. Login to dashboard
2. Manually delete `localStorage['authToken']`
3. Try any protected action
4. Should redirect to login with "Session expired" message

### Test 4: Token validation

```bash
# Use invalid token
curl http://localhost:8000/api/cars \
  -H "Authorization: Bearer invalid_token"

# Response: 401 Unauthorized
```

## Configuration Files

**Backend**

- `routes/api.php` - Route protection with `auth:sanctum`
- `config/cors.php` - CORS policy
- `config/sanctum.php` - Sanctum configuration
- `app/Http/Middleware/AdminOnly.php` - Custom admin middleware

**Frontend**

- `src/lib/AuthContext.jsx` - Authentication state
- `src/lib/ProtectedRoute.jsx` - Route protection
- `src/pages/AdminLogin.jsx` - Login UI
- `src/App.jsx` - Route configuration

## Best Practices

✅ **Always include token in protected requests**
✅ **Handle 401 responses consistently**
✅ **Use generic error messages for security**
✅ **Clear tokens on logout**
✅ **Check auth state before rendering protected UI**
✅ **Redirect early (before component render)**
✅ **Show loading state during auth checks**
✅ **Log users out on token expiry**

## Potential Enhancements

1. **HttpOnly Cookies** - Move tokens to httpOnly cookies
2. **Refresh Tokens** - Implement token refresh mechanism
3. **Rate Limiting** - Limit login attempts
4. **Remember Me** - Persist longer sessions
5. **2FA** - Two-factor authentication
6. **Role-Based Access** - Different admin levels
7. **Audit Logging** - Track all admin actions
8. **Session Timeout** - Auto-logout after inactivity
