# API Contracts: Notice Board

## Overview
Manage dashboard notices for all users to see.

## Endpoints

### GET /api/notices
Get active notices for dashboard display.

**Response:**
```json
{
  "notices": [
    {
      "id": 1,
      "title": "System Maintenance",
      "content": "Scheduled maintenance on Sunday 2-4 AM",
      "priority": "high",
      "created_by": {
        "id": 1,
        "username": "admin"
      },
      "created_at": "2025-09-08T09:00:00Z",
      "expires_at": "2025-09-15T00:00:00Z"
    }
  ]
}
```

**Permissions:** All authenticated users

### POST /api/notices
Create a new notice.

**Request Body:**
```json
{
  "title": "Important Announcement",
  "content": "Company meeting tomorrow at 10 AM",
  "priority": "medium",
  "expires_at": "2025-09-10T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "notice": {
    "id": 2,
    "title": "Important Announcement",
    "created_at": "2025-09-08T10:30:00Z"
  }
}
```

**Permissions:** Admin only

### PUT /api/notices/{id}
Update a notice.

**Request Body:** Same as POST, all fields optional

**Permissions:** Admin, Creator

### DELETE /api/notices/{id}
Delete a notice.

**Permissions:** Admin, Creator

## Priority Levels
- `low`: General information
- `medium`: Important announcements
- `high`: Critical notifications

## Auto-expiry
- Notices with `expires_at` are automatically hidden after expiry
- Expired notices remain in database for audit
- `is_active` flag controls visibility
