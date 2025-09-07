# Story 1.1: Project Setup & Authentication

## 📖 User Story
**As a developer**, I want to set up the project foundation with authentication system, so that I can build a secure application with proper user management.

## 🎯 Acceptance Criteria

### Must Have:
- [ ] React frontend application with TypeScript setup
- [ ] Node.js backend API with Express.js
- [ ] PostgreSQL database with initial schema
- [ ] Docker development environment
- [ ] JWT-based authentication system
- [ ] User registration and login functionality
- [ ] Basic error handling and validation

### Should Have:
- [ ] Password hashing with bcrypt
- [ ] Input validation middleware
- [ ] CORS configuration
- [ ] Environment variable management
- [ ] Basic logging system

### Nice to Have:
- [ ] Swagger API documentation
- [ ] Automated testing setup
- [ ] ESLint and Prettier configuration
- [ ] Git hooks for code quality

## 🎨 UI Mockup Description

### Login Page
```
┌─────────────────────────────────────┐
│              Company Logo            │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │         LOGIN FORM              │ │
│  │                                 │ │
│  │  Email:    [________________]   │ │
│  │  Password: [________________]   │ │
│  │                                 │ │
│  │  □ Remember me                  │ │
│  │                                 │ │
│  │  [    LOGIN    ]                │ │
│  │                                 │ │
│  │  Don't have an account?         │ │
│  │  Register here                  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Registration Page
```
┌─────────────────────────────────────┐
│             REGISTER                │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  First Name: [_____________]    │ │
│  │  Last Name:  [_____________]    │ │
│  │  Email:      [_____________]    │ │
│  │  Department: [_____________]    │ │
│  │  Password:   [_____________]    │ │
│  │  Confirm:    [_____________]    │ │
│  │                                 │ │
│  │  [   REGISTER   ]               │ │
│  │                                 │ │
│  │  Already have account? Login    │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🛠️ Technical Implementation

### Step 1: Project Structure Setup
```bash
# Create project structure
mkdir phonebook-app
cd phonebook-app

# Create subdirectories
mkdir frontend backend database docker

# Initialize Git repository
git init
echo "node_modules/\n.env\n*.log" > .gitignore
```

### Step 2: Backend Setup
```bash
cd backend
npm init -y
npm install express cors helmet morgan bcryptjs jsonwebtoken joi dotenv
npm install -D nodemon @types/node typescript ts-node
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npx create-react-app . --template typescript
npm install axios react-router-dom @types/react-router-dom
npm install tailwindcss @headlessui/react @heroicons/react
```

### Step 4: Database Setup
```sql
-- Create database schema
CREATE DATABASE phonebook_db;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 5: Authentication Middleware
```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

## 🔌 API Specifications

### Authentication Endpoints

#### POST /api/auth/register
```json
{
  "method": "POST",
  "endpoint": "/api/auth/register",
  "description": "Register new user account",
  "requestBody": {
    "email": "string (required)",
    "password": "string (required, min 8 chars)",
    "firstName": "string (required)",
    "lastName": "string (required)",
    "department": "string (optional)"
  },
  "responses": {
    "201": {
      "message": "User created successfully",
      "user": {
        "id": "uuid",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "role": "string"
      }
    },
    "400": {
      "error": "Validation error message"
    },
    "409": {
      "error": "Email already exists"
    }
  }
}
```

#### POST /api/auth/login
```json
{
  "method": "POST",
  "endpoint": "/api/auth/login",
  "description": "Authenticate user and return JWT token",
  "requestBody": {
    "email": "string (required)",
    "password": "string (required)"
  },
  "responses": {
    "200": {
      "message": "Login successful",
      "token": "string (JWT)",
      "refreshToken": "string",
      "user": {
        "id": "uuid",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "role": "string"
      }
    },
    "401": {
      "error": "Invalid credentials"
    }
  }
}
```

## ✅ Testing Checklist

### Unit Tests
- [ ] Password hashing works correctly
- [ ] JWT token generation and validation
- [ ] Input validation for registration
- [ ] Email format validation

### Integration Tests
- [ ] User registration flow
- [ ] User login flow
- [ ] Protected route access
- [ ] Token refresh mechanism

### Manual Testing
- [ ] Register new user via API
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Access protected endpoint with token
- [ ] Access protected endpoint without token

## 📁 Files to Create

### Backend Files:
- `backend/src/server.ts` - Express server setup
- `backend/src/routes/auth.ts` - Authentication routes
- `backend/src/controllers/auth.controller.ts` - Auth logic
- `backend/src/middleware/auth.ts` - JWT middleware
- `backend/src/models/User.ts` - User model
- `backend/src/config/database.ts` - Database connection

### Frontend Files:
- `frontend/src/components/Login.tsx` - Login form
- `frontend/src/components/Register.tsx` - Registration form
- `frontend/src/services/auth.service.ts` - API calls
- `frontend/src/hooks/useAuth.ts` - Authentication hook
- `frontend/src/context/AuthContext.tsx` - Auth state management

### Configuration Files:
- `docker-compose.yml` - Development environment
- `.env.example` - Environment variables template
- `backend/tsconfig.json` - TypeScript configuration

## 🔄 Next Steps
After completing this story, proceed to:
- [Story 1.2: User Login & Registration UI](./01-02-authentication.md)
- [Story 1.3: Dashboard Layout & Navigation](./01-03-dashboard-layout.md)

## 📝 Notes
- Use environment variables for all sensitive configuration
- Implement proper error handling and logging
- Follow security best practices for password storage
- Consider implementing rate limiting for auth endpoints
