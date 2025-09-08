# API Contracts: Contacts Management

## Overview
CRUD operations for contact management with role-based access control.

## Endpoints

### GET /api/contacts
Retrieve list of contacts with optional filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `search`: Search term for name/email
- `company_id`: Filter by company

**Response:**
```json
{
  "contacts": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0123",
      "company": {
        "id": 1,
        "name": "Example Corp"
      },
      "created_at": "2025-09-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Permissions:** All authenticated users

### POST /api/contacts
Create a new contact.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "mobile": "+1-555-0124",
  "company_id": 1,
  "notes": "Met at conference"
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-09-08T10:00:00Z"
  }
}
```

**Permissions:** Admin, Editor

### PUT /api/contacts/{id}
Update an existing contact.

**Request Body:** Same as POST, all fields optional

**Response:** Same as POST

**Permissions:** Admin, Editor (own contacts), Creator

### DELETE /api/contacts/{id}
Delete a contact.

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Permissions:** Admin, Editor (own contacts), Creator

## Validation Rules
- `first_name` and `last_name`: Required, 1-50 characters
- `email`: Optional, valid email format
- `phone`: Optional, valid phone format
- `company_id`: Optional, must exist if provided

## Error Responses
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": "Invalid email format"
  }
}
```
