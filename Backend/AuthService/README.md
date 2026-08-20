# DevTrails - AuthService

AuthService handles authentication, user registration, JWT token generation, session management, email verification via OTP, password reset, and Google OAuth 2.0 integration for the DevTrails competitive coding platform.

---

## 🚀 Overview & Functionality

- **User Registration & Email Verification**: Sends 6-digit OTP codes via Nodemailer to verify user emails.
- **JWT & Session Management**: Issues 15-minute Access Tokens and 7-day HTTP-Only Refresh Tokens. Stores session metadata (IP address, User Agent, active state) in MongoDB.
- **Google OAuth 2.0 Integration**: Redirects users to Google OAuth consent, exchanges authorization codes for profile info, creates or links user accounts, and redirects back to the React frontend with tokens.
- **Rate Limiting**: Uses Redis/in-memory rate limiting to prevent brute-force attacks on login and OTP endpoints.
- **Role-Based Access Control**: Supports `USER` and `ADMIN` roles.

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

### 1. `User` Schema (`users` collection)

```typescript
interface IUser {
  name: string;
  email: string; // unique, lowercased
  password?: string; // bcrypt hashed (optional for Google OAuth users)
  role: "USER" | "ADMIN"; // default: "USER"
  isEmailVerified: boolean; // default: false
  googleId?: string; // optional OAuth ID
  avatar?: string; // optional avatar URL
  loginAttempts: number; // default: 0
  lockUntil?: number; // lock timestamp
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. `Session` Schema (`sessions` collection)

```typescript
interface ISession {
  userId: mongoose.Types.ObjectId;
  refreshToken: string; // hashed token
  ipAddress: string;
  userAgent: string;
  isRevoked: boolean;
  usedRefreshTokens: string[]; // token replay detection
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📡 API Endpoints Specification

Base Path: `/api/v1/auth`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register new user & dispatch email verification OTP |
| `POST` | `/verify` | Public | Verify 6-digit email OTP |
| `POST` | `/login` | Public | Authenticate user email & password, return JWT & set refresh cookie |
| `POST` | `/refresh` | Public | Rotate refresh token cookie and issue fresh access token |
| `POST` | `/logout` | Public | Revoke current refresh token and clear cookies |
| `POST` | `/logout-all` | Auth | Revoke all active sessions across all devices for current user |
| `POST` | `/resend-otp` | Public | Resend email verification OTP |
| `POST` | `/forgot-password` | Public | Request password reset OTP via email |
| `POST` | `/reset-password` | Public | Verify reset OTP and update password |
| `GET` | `/sessions` | Auth | List all active sessions for current user |
| `DELETE` | `/sessions/:sessionId` | Auth | Revoke a specific active session |
| `GET` | `/google` | Public | Redirect user to Google OAuth 2.0 consent page |
| `GET` | `/google/callback` | Public | OAuth callback: exchanges code, sets cookie, redirects to Frontend |

---

## ⚙️ Configuration & Environment

Default Port: `3008`

```env
PORT=3008
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auth_db
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3008/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```
