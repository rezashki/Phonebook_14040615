# Data Model: Phonebook App

## Overview
The application uses SQLite as the primary database with the following main entities: Users, Contacts, Companies, and Notices. All data relationships are designed for efficient querying and maintenance.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

**Indexes:**
- UNIQUE index on username
- UNIQUE index on email
- Index on role for filtering

### Contacts Table
```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50),
    company_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Indexes:**
- Index on company_id
- Index on created_by
- Full-text search index on first_name, last_name, email

### Companies Table
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(50),
    website VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Indexes:**
- UNIQUE index on name
- Index on created_by
- Full-text search index on name, industry

### Notices Table
```sql
CREATE TABLE notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    expires_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Indexes:**
- Index on is_active
- Index on priority
- Index on created_at

## Relationships

### Entity Relationships
- **Users** can create **Contacts** and **Companies**
- **Contacts** can be associated with **Companies** (many-to-one)
- **Users** can create **Notices** for all users to see
- **Users** have roles that determine permissions

### Data Flow
1. User authentication determines role-based access
2. Admin users can manage all entities
3. Editor users can manage contacts and companies
4. Regular users have read-only access to most data
5. All changes are tracked with created_by and timestamps

## Data Validation Rules

### Users
- Username: 3-50 characters, alphanumeric + underscore
- Email: Valid email format, unique
- Password: Minimum 8 characters, hashed storage
- Role: Must be one of 'admin', 'editor', 'user'

### Contacts
- At least one of email or phone required
- Names: 1-50 characters
- Optional company association

### Companies
- Name: Required, unique, 1-100 characters
- Website: Valid URL format if provided
- Email: Valid format if provided

### Notices
- Title: Required, 1-200 characters
- Content: Required, unlimited length
- Priority: Default 'medium'
- Optional expiration date

## Performance Considerations

### Indexing Strategy
- Primary keys automatically indexed
- Foreign keys indexed for joins
- Search fields have full-text indexes
- Frequently queried fields indexed

### Query Optimization
- Use prepared statements for all queries
- Implement pagination for large result sets
- Cache frequently accessed data (users, companies)

### Data Integrity
- Foreign key constraints enforce relationships
- Transactions for multi-table operations
- Automatic timestamps for audit trails

## Migration Strategy
- Version-controlled schema migrations
- Backward compatibility for data
- Rollback capabilities for failed migrations
- Data seeding for initial setup
