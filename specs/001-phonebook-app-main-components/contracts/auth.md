# API Contracts: Authentication

## Overview
Authentication endpoints for user login, logout, and session management.

## Endpoints

### POST /api/auth/login
Authenticate user credentials and create session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Invalid credentials
- 500: Server error

### POST /api/auth/logout
Destroy user session.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 500: Server error

### GET /api/auth/status
Check current authentication status.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false
}
```

**Status Codes:**
- 200: Success
- 500: Server error

## Security
- Passwords are hashed using bcrypt
- Sessions are server-side with secure cookies
- CSRF protection enabled
- Rate limiting on login attempts
