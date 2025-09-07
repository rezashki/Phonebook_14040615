# Story 2.1: Contact Management - Basic CRUD

## 📖 User Story
**As an employee**, I want to add, view, edit, and delete contact information, so that I can maintain an up-to-date directory of colleagues and business contacts.

## 🎯 Acceptance Criteria

### Must Have:
- [ ] Add new contact with all required fields
- [ ] View contact details in a clean interface
- [ ] Edit existing contact information
- [ ] Delete contacts with confirmation dialog
- [ ] List all contacts in a table/grid view
- [ ] Basic form validation for required fields

### Should Have:
- [ ] Pagination for contact list
- [ ] Sort contacts by name, department, company
- [ ] Profile picture upload functionality
- [ ] Duplicate contact detection
- [ ] Bulk operations (select multiple, delete)

### Nice to Have:
- [ ] Contact import from CSV
- [ ] Contact export functionality
- [ ] Recent contacts view
- [ ] Favorite contacts marking

## 🎨 UI Mockup Description

### Contact List View
```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 CONTACTS                                      [+ Add Contact]    │
├─────────────────────────────────────────────────────────────────────┤
│  Search: [_______________] 🔍  Filter: [All ▼] Sort: [Name ▼]       │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─┬─────────────────┬─────────────────┬─────────────────┬──────────┐ │
│  │📷│     Name        │     Email       │    Company      │ Actions  │ │
│  ├─┼─────────────────┼─────────────────┼─────────────────┼──────────┤ │
│  │ │ John Smith      │ j.smith@co.com  │ Tech Corp       │ ✏️ 🗑️   │ │
│  │ │ Jane Doe        │ jane@example.com│ Design Ltd      │ ✏️ 🗑️   │ │
│  │ │ Mike Johnson    │ mike@startup.io │ Startup Inc     │ ✏️ 🗑️   │ │
│  └─┴─────────────────┴─────────────────┴─────────────────┴──────────┘ │
│                                                                       │
│  Showing 1-10 of 156 contacts    [◀ Previous] [1][2][3]... [Next ▶]  │
└─────────────────────────────────────────────────────────────────────┘
```

### Add/Edit Contact Form
```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 ADD NEW CONTACT                                     [✖ Close]    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌────────────────────────────────────────┐│
│  │   Profile Picture    │  │ PERSONAL INFORMATION                   ││
│  │   ┌──────────────┐   │  │                                        ││
│  │   │      📷      │   │  │ First Name: [_______________] *        ││
│  │   │   Upload     │   │  │ Last Name:  [_______________] *        ││
│  │   │    Photo     │   │  │ Middle Name:[_______________]          ││
│  │   └──────────────┘   │  │ Title:      [_______________]          ││
│  └──────────────────────┘  │ Birth Date: [_______________]          ││
│                            └────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ CONTACT INFORMATION                                             │ │
│  │                                                                 │ │
│  │ Primary Phone:   [_______________]  Mobile: [_______________]   │ │
│  │ Secondary Phone: [_______________]  Fax:    [_______________]   │ │
│  │ Primary Email:   [_______________] * (required)                │ │
│  │ Secondary Email: [_______________]                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ COMPANY & WORK INFORMATION                                      │ │
│  │                                                                 │ │
│  │ Company:    [Select Company ▼]  Department: [_______________]   │ │
│  │ Position:   [_______________]    Manager:    [Select Person ▼] │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ADDRESS INFORMATION                                             │ │
│  │                                                                 │ │
│  │ Street:  [_____________________________]                       │ │
│  │ City:    [_______________] State: [_______________]             │ │
│  │ Zip:     [_______________] Country: [_______________]           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ADDITIONAL INFORMATION                                          │ │
│  │                                                                 │ │
│  │ Tags: [marketing] [client] [+] [_______________]                │ │
│  │                                                                 │ │
│  │ Notes: ┌─────────────────────────────────────────────────────┐ │ │
│  │        │                                                     │ │ │
│  │        │                                                     │ │ │
│  │        └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│              [Cancel]  [Save Draft]  [Save Contact]                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technical Implementation

### Step 1: Database Schema
```sql
-- Contacts table (detailed version)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    title VARCHAR(100),
    
    -- Contact Information
    primary_phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    mobile VARCHAR(20),
    fax VARCHAR(20),
    primary_email VARCHAR(255),
    secondary_email VARCHAR(255),
    
    -- Address Information
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Work Information
    company_id UUID REFERENCES companies(id),
    department VARCHAR(100),
    position VARCHAR(100),
    manager_id UUID REFERENCES contacts(id),
    
    -- Additional Information
    birth_date DATE,
    notes TEXT,
    tags TEXT[],
    profile_picture VARCHAR(500),
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(first_name, '') || ' ' || 
            COALESCE(last_name, '') || ' ' || 
            COALESCE(primary_email, '') || ' ' ||
            COALESCE(department, '')
        )
    ) STORED
);

-- Indexes for performance
CREATE INDEX idx_contacts_name ON contacts(first_name, last_name);
CREATE INDEX idx_contacts_email ON contacts(primary_email);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_search ON contacts USING GIN(search_vector);
```

### Step 2: Backend API Routes
```typescript
// backend/src/routes/contacts.ts
import express from 'express';
import { ContactController } from '../controllers/contact.controller';
import { authenticateToken } from '../middleware/auth';
import { validateContact } from '../middleware/validation';

const router = express.Router();
const contactController = new ContactController();

// Apply authentication to all routes
router.use(authenticateToken);

// CRUD operations
router.get('/', contactController.getContacts);          // GET /api/contacts
router.get('/:id', contactController.getContact);       // GET /api/contacts/:id
router.post('/', validateContact, contactController.createContact);   // POST /api/contacts
router.put('/:id', validateContact, contactController.updateContact); // PUT /api/contacts/:id
router.delete('/:id', contactController.deleteContact); // DELETE /api/contacts/:id

// Additional operations
router.post('/bulk-delete', contactController.bulkDelete); // POST /api/contacts/bulk-delete
router.get('/search/:query', contactController.searchContacts); // GET /api/contacts/search/:query

export default router;
```

### Step 3: Contact Controller
```typescript
// backend/src/controllers/contact.controller.ts
import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';

export class ContactController {
  private contactService = new ContactService();

  getContacts = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'first_name';
      const sortOrder = req.query.sortOrder as string || 'asc';
      
      const result = await this.contactService.getContacts({
        page,
        limit,
        sortBy,
        sortOrder
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  };

  createContact = async (req: Request, res: Response) => {
    try {
      const contact = await this.contactService.createContact(req.body, req.user.id);
      res.status(201).json(contact);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({ error: 'Contact with this email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create contact' });
      }
    }
  };

  // ... other methods
}
```

### Step 4: Frontend Components
```tsx
// frontend/src/components/contacts/ContactList.tsx
import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contact.service';
import { ContactCard } from './ContactCard';
import { ContactForm } from './ContactForm';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  profilePicture?: string;
}

export const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts();
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.deleteContact(contactId);
        setContacts(contacts.filter(c => c.id !== contactId));
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={() => handleEdit(contact)}
            onDelete={() => handleDelete(contact.id)}
          />
        ))}
      </div>

      {showForm && (
        <ContactForm
          contact={selectedContact}
          onSave={() => {
            loadContacts();
            setShowForm(false);
            setSelectedContact(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
};
```

## 🔌 API Specifications

### GET /api/contacts
```json
{
  "method": "GET",
  "endpoint": "/api/contacts",
  "parameters": {
    "page": "number (default: 1)",
    "limit": "number (default: 10)",
    "sortBy": "string (default: 'first_name')",
    "sortOrder": "string (default: 'asc')"
  },
  "response": {
    "data": [
      {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "primaryEmail": "string",
        "primaryPhone": "string",
        "company": "string",
        "department": "string",
        "profilePicture": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

### POST /api/contacts
```json
{
  "method": "POST",
  "endpoint": "/api/contacts",
  "requestBody": {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "middleName": "string",
    "title": "string",
    "primaryPhone": "string",
    "primaryEmail": "string (required)",
    "companyId": "uuid",
    "department": "string",
    "position": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string"
    },
    "tags": ["string"],
    "notes": "string"
  },
  "response": {
    "201": "Contact created successfully",
    "400": "Validation error",
    "409": "Contact already exists"
  }
}
```

## ✅ Testing Checklist

### Functionality Tests
- [ ] Create contact with required fields only
- [ ] Create contact with all fields populated
- [ ] Edit existing contact information
- [ ] Delete single contact with confirmation
- [ ] View contact details
- [ ] Pagination works correctly
- [ ] Sorting by different fields

### Validation Tests
- [ ] Required field validation
- [ ] Email format validation
- [ ] Phone number format validation
- [ ] Duplicate email detection
- [ ] Character limits respected

### UI/UX Tests
- [ ] Form is responsive on mobile
- [ ] Loading states show appropriately
- [ ] Error messages are clear
- [ ] Confirmation dialogs work
- [ ] Profile picture upload works

## 📁 Files to Create

### Backend Files:
- `backend/src/models/Contact.ts`
- `backend/src/controllers/contact.controller.ts`
- `backend/src/services/contact.service.ts`
- `backend/src/routes/contacts.ts`
- `backend/src/middleware/validation.ts`

### Frontend Files:
- `frontend/src/components/contacts/ContactList.tsx`
- `frontend/src/components/contacts/ContactCard.tsx`
- `frontend/src/components/contacts/ContactForm.tsx`
- `frontend/src/services/contact.service.ts`
- `frontend/src/types/Contact.ts`

## 🔄 Next Steps
After completing this story, proceed to:
- [Story 2.2: Contact Search & Filtering](./02-02-contact-search.md)
- [Story 2.3: Company Management](./02-03-company-management.md)
