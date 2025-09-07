# Data Model: Phone Book

## Entities

### Contact
- **name**: string (required, unique in combination with phone number)
- **phone_number**: string (required, validated format, unique in combination with name)

#### Validation Rules
- Name must be a non-empty string
- Phone number must match E.164 format (e.g., +1234567890)
- Combination of name and phone number must be unique

### Phone Book
- **contacts**: list of Contact
- **metadata**: owner (optional), creation date (optional)
- Global phone book shared among all users

## State Transitions
- Add Contact → Contact is added if unique and valid
- Edit Contact → Contact is updated if new data is valid and unique
- Delete Contact → Contact is removed if exists
- Search Contact → Returns matching contacts by name or phone number

---
# API Contracts: Phone Book

## Endpoints

### POST /contacts
- Add a new contact
- Request: { name, phone_number }
- Response: 201 Created, contact object or error

### GET /contacts
- List all contacts
- Response: 200 OK, array of contact objects

### PUT /contacts/{id}
- Edit a contact
- Request: { name, phone_number }
- Response: 200 OK, updated contact or error

### DELETE /contacts/{id}
- Delete a contact
- Response: 204 No Content or error

### GET /contacts/search?query={name|phone_number}
- Search contacts by name or phone number
- Response: 200 OK, array of matching contacts

---
# Quickstart

1. Install dependencies (Python 3.11+, FastAPI, PostgreSQL, pytest)
2. Set up database schema for Contact
3. Implement API endpoints for CRUD and search
4. Write contract and integration tests
5. Run tests to validate implementation

---
