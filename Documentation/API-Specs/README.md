# API Specifications

## 📋 Overview
This document provides comprehensive API specifications for the Company Dashboard application. All APIs follow RESTful conventions with JSON request/response format.

## 🔐 Authentication
All protected endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## 📊 Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": [],
  "pagination": {} // For paginated responses
}
```

## 🚨 Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

---

# 🔑 Authentication APIs

## POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "department": "Engineering",
  "username": "john.doe" // optional, auto-generated from email if not provided
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "username": "john.doe",
      "role": "user",
      "department": "Engineering",
      "isActive": true,
      "createdAt": "2025-09-07T10:00:00Z"
    }
  },
  "message": "User registered successfully"
}
```

## POST /api/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "john.doe@company.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "expiresIn": 3600,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "role": "user",
      "department": "Engineering"
    }
  },
  "message": "Login successful"
}
```

## POST /api/auth/refresh
Refresh JWT token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 3600
  },
  "message": "Token refreshed successfully"
}
```

---

# 👥 User Management APIs

## GET /api/users
Get list of users (Admin/Manager only).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `role` (string, optional)
- `department` (string, optional)
- `search` (string, optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "role": "user",
      "department": "Engineering",
      "isActive": true,
      "lastLogin": "2025-09-07T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## GET /api/users/profile
Get current user's profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "username": "john.doe",
    "role": "user",
    "department": "Engineering",
    "profilePicture": "/uploads/profiles/john-doe.jpg",
    "preferences": {
      "theme": "light",
      "notifications": true
    },
    "createdAt": "2025-09-01T10:00:00Z",
    "lastLogin": "2025-09-07T09:30:00Z"
  }
}
```

## PUT /api/users/profile
Update current user's profile.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "department": "Engineering",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

---

# 📞 Contact Management APIs

## GET /api/contacts
Get list of contacts.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional) - Search in name, email, department
- `company` (uuid, optional) - Filter by company ID
- `department` (string, optional)
- `sortBy` (string, default: 'firstName') - firstName, lastName, email, company
- `sortOrder` (string, default: 'asc') - asc, desc

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "firstName": "Jane",
      "lastName": "Smith",
      "title": "Software Engineer",
      "primaryEmail": "jane.smith@company.com",
      "primaryPhone": "+1-555-0123",
      "mobile": "+1-555-0124",
      "department": "Engineering",
      "position": "Senior Developer",
      "profilePicture": "/uploads/contacts/jane-smith.jpg",
      "company": {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "name": "Tech Corp",
        "industry": "Technology"
      },
      "tags": ["frontend", "react", "team-lead"],
      "createdAt": "2025-09-01T10:00:00Z",
      "updatedAt": "2025-09-05T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

## GET /api/contacts/:id
Get specific contact details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "Jane",
    "lastName": "Smith",
    "middleName": "Marie",
    "title": "Ms.",
    "primaryEmail": "jane.smith@company.com",
    "secondaryEmail": "jane.marie@personal.com",
    "primaryPhone": "+1-555-0123",
    "secondaryPhone": "+1-555-0125",
    "mobile": "+1-555-0124",
    "fax": "+1-555-0126",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "company": {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "name": "Tech Corp",
      "industry": "Technology"
    },
    "department": "Engineering",
    "position": "Senior Developer",
    "manager": {
      "id": "789e1234-e89b-12d3-a456-426614174002",
      "name": "John Manager"
    },
    "birthDate": "1990-05-15",
    "notes": "Excellent team player, specializes in frontend development",
    "tags": ["frontend", "react", "team-lead"],
    "profilePicture": "/uploads/contacts/jane-smith.jpg",
    "createdBy": {
      "id": "admin123",
      "name": "System Admin"
    },
    "createdAt": "2025-09-01T10:00:00Z",
    "updatedAt": "2025-09-05T14:30:00Z"
  }
}
```

## POST /api/contacts
Create new contact.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "middleName": "Marie",
  "title": "Ms.",
  "primaryEmail": "jane.smith@company.com",
  "secondaryEmail": "jane.marie@personal.com",
  "primaryPhone": "+1-555-0123",
  "mobile": "+1-555-0124",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "companyId": "456e7890-e89b-12d3-a456-426614174001",
  "department": "Engineering",
  "position": "Senior Developer",
  "managerId": "789e1234-e89b-12d3-a456-426614174002",
  "birthDate": "1990-05-15",
  "notes": "Excellent team player",
  "tags": ["frontend", "react"]
}
```

## PUT /api/contacts/:id
Update existing contact.

## DELETE /api/contacts/:id
Delete contact.

## POST /api/contacts/bulk-delete
Delete multiple contacts.

**Request:**
```json
{
  "contactIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "456e7890-e89b-12d3-a456-426614174001"
  ]
}
```

## GET /api/contacts/search/:query
Search contacts by text query.

---

# 🏢 Company Management APIs

## GET /api/companies
Get list of companies.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional)
- `industry` (string, optional)
- `parentId` (uuid, optional) - Get subsidiaries of specific company

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "companyName": "Tech Corp",
      "legalName": "Technology Corporation Inc.",
      "companyType": "corporation",
      "industry": "Technology",
      "mainPhone": "+1-555-0100",
      "website": "https://techcorp.com",
      "primaryEmail": "info@techcorp.com",
      "headquartersAddress": {
        "street": "100 Corporate Blvd",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "country": "USA"
      },
      "parentCompany": {
        "id": "789e1234-e89b-12d3-a456-426614174002",
        "name": "Global Holdings"
      },
      "subsidiaryCount": 3,
      "employeeCount": 150,
      "status": "active",
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## GET /api/companies/:id/hierarchy
Get company hierarchy (parent and all subsidiaries).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "companyName": "Tech Corp",
    "level": 0,
    "children": [
      {
        "id": "subsidiary1",
        "companyName": "Tech Solutions",
        "level": 1,
        "children": []
      },
      {
        "id": "subsidiary2",
        "companyName": "Tech Services",
        "level": 1,
        "children": [
          {
            "id": "subsubsidiary1",
            "companyName": "Local Services",
            "level": 2,
            "children": []
          }
        ]
      }
    ]
  }
}
```

---

# 📢 Notice Board APIs

## GET /api/notices
Get list of notices.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `priority` (string, optional) - low, medium, high, urgent
- `status` (string, default: 'published') - draft, published, expired
- `search` (string, optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notice123",
      "title": "Office Closure - Emergency Maintenance",
      "content": "Due to emergency electrical maintenance...",
      "contentPreview": "Due to emergency electrical maintenance, our main office will be closed...",
      "category": "hr",
      "priorityLevel": "urgent",
      "author": {
        "id": "user123",
        "name": "John Admin",
        "department": "HR"
      },
      "status": "published",
      "publicationDate": "2025-09-07T08:00:00Z",
      "expiryDate": "2025-09-08T18:00:00Z",
      "isPinned": true,
      "viewsCount": 125,
      "commentCount": 8,
      "attachments": [
        {
          "filename": "emergency-procedures.pdf",
          "size": 2048000,
          "url": "/api/uploads/notices/emergency-procedures.pdf"
        }
      ],
      "targetAudience": {
        "type": "all"
      },
      "createdAt": "2025-09-07T07:30:00Z",
      "updatedAt": "2025-09-07T07:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## GET /api/notices/:id
Get specific notice with full content.

## POST /api/notices
Create new notice (Manager/Admin only).

**Request:**
```json
{
  "title": "New Company Policy",
  "content": "Full notice content in markdown or HTML",
  "category": "hr",
  "priorityLevel": "medium",
  "publicationDate": "2025-09-07T10:00:00Z",
  "expiryDate": "2025-12-31T23:59:59Z",
  "targetAudience": {
    "type": "departments",
    "departments": ["hr", "engineering"]
  },
  "status": "published",
  "isPinned": false
}
```

## POST /api/notices/:id/view
Track notice view (authenticated users).

## GET /api/notices/:id/comments
Get comments for a notice.

## POST /api/notices/:id/comments
Add comment to notice.

**Request:**
```json
{
  "content": "This is very helpful information, thanks!",
  "parentCommentId": "comment123" // optional, for replies
}
```

---

# 👔 Board Members APIs

## GET /api/board-members
Get list of board members.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "board123",
      "fullName": "Robert Johnson",
      "title": "Chairman",
      "position": "Board Chairman",
      "phone": "+1-555-0200",
      "email": "rjohnson@company.com",
      "bio": "Robert has over 20 years of experience in corporate governance...",
      "education": "MBA from Harvard Business School",
      "experience": "Former CEO of several Fortune 500 companies",
      "dateJoined": "2020-01-15",
      "termDuration": 36,
      "committeeMemberships": ["audit", "compensation", "governance"],
      "profilePicture": "/uploads/board/robert-johnson.jpg",
      "linkedinUrl": "https://linkedin.com/in/robertjohnson",
      "isActive": true,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

## GET /api/board-members/:id
Get specific board member details.

---

# 📁 File Upload APIs

## POST /api/uploads/profile
Upload profile picture.

**Request:** `multipart/form-data`
- `file`: Image file (max 5MB, jpg/png only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "profile-123456.jpg",
    "url": "/uploads/profiles/profile-123456.jpg",
    "size": 1024000
  }
}
```

## POST /api/uploads/attachments
Upload file attachments.

**Request:** `multipart/form-data`
- `files`: Multiple files (max 10MB each)
- `entityType`: String ("notice", "contact", etc.)
- `entityId`: UUID of related entity

---

# 📊 Analytics APIs

## GET /api/analytics/dashboard
Get dashboard statistics (Admin/Manager only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 125,
    "totalContacts": 1567,
    "totalCompanies": 45,
    "activeNotices": 12,
    "recentActivity": {
      "newContacts": 5,
      "newNotices": 2,
      "newUsers": 1
    },
    "topCategories": [
      {"category": "hr", "count": 15},
      {"category": "it", "count": 12},
      {"category": "general", "count": 8}
    ]
  }
}
```

---

# 🔍 Search APIs

## GET /api/search/global
Global search across all entities.

**Query Parameters:**
- `q` (string, required) - Search query
- `type` (string, optional) - Filter by entity type (contacts, companies, notices)
- `limit` (number, default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "contact123",
        "type": "contact",
        "title": "Jane Smith - Software Engineer",
        "description": "jane.smith@company.com • Engineering Department",
        "url": "/contacts/contact123"
      }
    ],
    "companies": [
      {
        "id": "company123",
        "type": "company", 
        "title": "Tech Corp",
        "description": "Technology Corporation • San Francisco, CA",
        "url": "/companies/company123"
      }
    ],
    "notices": [
      {
        "id": "notice123",
        "type": "notice",
        "title": "Office Closure Notice",
        "description": "Emergency maintenance scheduled...",
        "url": "/notices/notice123"
      }
    ]
  }
}
```

---

# 📋 Standard HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server error

---

# 🔐 Rate Limiting

API endpoints are rate limited:
- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user
- **Search endpoints**: 30 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```
