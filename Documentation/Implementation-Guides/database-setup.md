# Database Setup Guide

## 📋 Overview
This guide provides step-by-step instructions for setting up the PostgreSQL database for the Company Dashboard application.

## 🛠️ Prerequisites
- PostgreSQL 13+ installed
- Database administration access
- Node.js environment for running migrations

## 📊 Database Schema

### Core Tables Structure

```
Users (Authentication & User Management)
├── Contacts (Employee/Business Contacts)
│   ├── Companies (Company Information)
│   └── Address Information (Embedded JSON)
├── Notices (Company Announcements)
│   ├── Notice Views (View Tracking)
│   └── Notice Comments (Comment System)
└── Board Members (Board Member Profiles)
```

## 🔧 Setup Instructions

### Step 1: Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE phonebook_db;

-- Create application user
CREATE USER phonebook_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE phonebook_db TO phonebook_user;

-- Connect to the new database
\c phonebook_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO phonebook_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO phonebook_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO phonebook_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
```

### Step 2: Create Core Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    profile_picture VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Companies table (with hierarchy support)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    company_type VARCHAR(50),
    industry VARCHAR(100),
    main_phone VARCHAR(20),
    website VARCHAR(255),
    primary_email VARCHAR(255),
    headquarters_address JSONB,
    parent_company_id UUID REFERENCES companies(id),
    status VARCHAR(20) DEFAULT 'active',
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    annual_revenue BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Contacts table
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
    
    -- Address Information (stored as JSON for flexibility)
    address JSONB DEFAULT '{}',
    
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
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(first_name, '') || ' ' || 
            COALESCE(last_name, '') || ' ' || 
            COALESCE(primary_email, '') || ' ' ||
            COALESCE(department, '') || ' ' ||
            COALESCE(position, '')
        )
    ) STORED
);

-- Notices table
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT, -- Rendered HTML version
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    priority_level VARCHAR(20) NOT NULL DEFAULT 'medium',
    
    -- Publishing details
    author_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    publication_date TIMESTAMP,
    expiry_date TIMESTAMP,
    is_pinned BOOLEAN DEFAULT false,
    
    -- Engagement tracking
    views_count INTEGER DEFAULT 0,
    
    -- Target audience
    target_audience JSONB DEFAULT '{"type": "all"}',
    
    -- File attachments
    attachments JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || content || ' ' || category)
    ) STORED
);

-- Notice views tracking
CREATE TABLE notice_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(notice_id, user_id)
);

-- Notice comments
CREATE TABLE notice_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES notice_comments(id),
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Board Members table
CREATE TABLE board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    bio TEXT,
    education TEXT,
    experience TEXT,
    date_joined DATE,
    term_duration INTEGER, -- in months
    committee_memberships TEXT[],
    profile_picture VARCHAR(500),
    linkedin_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- File uploads tracking
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    entity_type VARCHAR(50), -- 'contact', 'notice', 'board_member', etc.
    entity_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log for tracking changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Create Indexes for Performance
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- Company indexes
CREATE INDEX idx_companies_name ON companies(company_name);
CREATE INDEX idx_companies_parent ON companies(parent_company_id);
CREATE INDEX idx_companies_status ON companies(status);

-- Contact indexes
CREATE INDEX idx_contacts_name ON contacts(first_name, last_name);
CREATE INDEX idx_contacts_email ON contacts(primary_email);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_department ON contacts(department);
CREATE INDEX idx_contacts_search ON contacts USING GIN(search_vector);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);

-- Notice indexes
CREATE INDEX idx_notices_status_date ON notices(status, publication_date DESC);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_priority ON notices(priority_level);
CREATE INDEX idx_notices_author ON notices(author_id);
CREATE INDEX idx_notices_search ON notices USING GIN(search_vector);
CREATE INDEX idx_notices_expiry ON notices(expiry_date) WHERE expiry_date IS NOT NULL;

-- Notice engagement indexes
CREATE INDEX idx_notice_views_notice ON notice_views(notice_id);
CREATE INDEX idx_notice_views_user ON notice_views(user_id);
CREATE INDEX idx_notice_comments_notice ON notice_comments(notice_id);
CREATE INDEX idx_notice_comments_parent ON notice_comments(parent_comment_id);

-- Board member indexes
CREATE INDEX idx_board_members_name ON board_members(full_name);
CREATE INDEX idx_board_members_position ON board_members(position);
CREATE INDEX idx_board_members_active ON board_members(is_active);

-- File upload indexes
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX idx_file_uploads_user ON file_uploads(uploaded_by);

-- Audit log indexes
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(changed_at DESC);
```

### Step 4: Create Views for Common Queries
```sql
-- Contact directory view with company information
CREATE VIEW contact_directory AS
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.title,
    c.primary_email,
    c.primary_phone,
    c.mobile,
    c.department,
    c.position,
    c.profile_picture,
    comp.company_name,
    comp.industry,
    c.created_at,
    c.updated_at
FROM contacts c
LEFT JOIN companies comp ON c.company_id = comp.id
WHERE c.primary_email IS NOT NULL
ORDER BY c.last_name, c.first_name;

-- Active notices view
CREATE VIEW active_notices AS
SELECT 
    n.*,
    u.first_name || ' ' || u.last_name as author_name,
    u.department as author_department,
    COALESCE(vc.view_count, 0) as view_count,
    COALESCE(cc.comment_count, 0) as comment_count
FROM notices n
JOIN users u ON n.author_id = u.id
LEFT JOIN (
    SELECT notice_id, COUNT(*) as view_count 
    FROM notice_views 
    GROUP BY notice_id
) vc ON n.id = vc.notice_id
LEFT JOIN (
    SELECT notice_id, COUNT(*) as comment_count 
    FROM notice_comments 
    GROUP BY notice_id
) cc ON n.id = cc.notice_id
WHERE n.status = 'published'
AND (n.expiry_date IS NULL OR n.expiry_date > NOW())
ORDER BY n.is_pinned DESC, n.publication_date DESC;

-- Company hierarchy view
CREATE VIEW company_hierarchy AS
WITH RECURSIVE company_tree AS (
    -- Base case: root companies (no parent)
    SELECT 
        id,
        company_name,
        parent_company_id,
        0 as level,
        company_name as path
    FROM companies 
    WHERE parent_company_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child companies
    SELECT 
        c.id,
        c.company_name,
        c.parent_company_id,
        ct.level + 1,
        ct.path || ' > ' || c.company_name
    FROM companies c
    JOIN company_tree ct ON c.parent_company_id = ct.id
)
SELECT * FROM company_tree
ORDER BY path;
```

### Step 5: Create Functions and Triggers
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notice_comments_updated_at BEFORE UPDATE ON notice_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_members_updated_at BEFORE UPDATE ON board_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update notice view counts
CREATE OR REPLACE FUNCTION update_notice_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE notices 
    SET views_count = (
        SELECT COUNT(*) FROM notice_views WHERE notice_id = NEW.notice_id
    )
    WHERE id = NEW.notice_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notice_views_count_trigger 
AFTER INSERT ON notice_views
FOR EACH ROW EXECUTE FUNCTION update_notice_views_count();
```

### Step 6: Insert Initial Data
```sql
-- Insert default admin user (password: admin123)
INSERT INTO users (
    username, email, password_hash, first_name, last_name, role, department
) VALUES (
    'admin', 
    'admin@company.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
    'System', 
    'Administrator', 
    'admin',
    'IT'
);

-- Insert sample departments/categories
INSERT INTO companies (company_name, company_type, status, created_by) VALUES 
('Head Office', 'headquarters', 'active', (SELECT id FROM users WHERE username = 'admin')),
('IT Department', 'department', 'active', (SELECT id FROM users WHERE username = 'admin')),
('HR Department', 'department', 'active', (SELECT id FROM users WHERE username = 'admin'));

-- Insert notice categories (as enum-like data)
-- This can be handled in the application layer, but useful for reference
INSERT INTO notices (
    title, content, category, priority_level, author_id, 
    status, publication_date
) VALUES (
    'Welcome to the Company Dashboard',
    'This is your new company dashboard system. Here you can manage contacts, view announcements, and access company information.',
    'general',
    'medium',
    (SELECT id FROM users WHERE username = 'admin'),
    'published',
    NOW()
);
```

## 🔒 Security Configuration
```sql
-- Create row level security policies (optional, for multi-tenant scenarios)
-- Enable RLS on sensitive tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see contacts from their department (if needed)
-- CREATE POLICY contact_department_policy ON contacts
--     FOR ALL TO authenticated_users
--     USING (department = current_user_department());

-- Revoke public access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO phonebook_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO phonebook_user;
```

## 🧪 Testing the Setup
```sql
-- Test queries to verify setup
SELECT 'Users table' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Companies table', COUNT(*) FROM companies
UNION ALL
SELECT 'Contacts table', COUNT(*) FROM contacts
UNION ALL
SELECT 'Notices table', COUNT(*) FROM notices;

-- Test search functionality
SELECT * FROM contacts WHERE search_vector @@ to_tsquery('english', 'admin');

-- Test company hierarchy
SELECT * FROM company_hierarchy LIMIT 10;

-- Test active notices view
SELECT title, author_name, view_count FROM active_notices LIMIT 5;
```

## 🔄 Migration Scripts
Create migration files in `database/migrations/` directory:

1. `001_create_users_table.sql`
2. `002_create_companies_table.sql`
3. `003_create_contacts_table.sql`
4. `004_create_notices_tables.sql`
5. `005_create_board_members_table.sql`
6. `006_create_indexes.sql`
7. `007_create_views_and_functions.sql`

## 📝 Environment Configuration
Create `.env` file with database configuration:
```env
DATABASE_URL=postgresql://phonebook_user:your_secure_password@localhost:5432/phonebook_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phonebook_db
DB_USER=phonebook_user
DB_PASSWORD=your_secure_password
```

## 🔧 Maintenance Tasks
Regular maintenance queries to keep the database healthy:

```sql
-- Update search vectors (if needed)
UPDATE contacts SET updated_at = NOW() WHERE search_vector IS NULL;

-- Clean up expired notices
UPDATE notices SET status = 'expired' WHERE expiry_date < NOW() AND status = 'published';

-- Archive old audit logs (older than 1 year)
DELETE FROM audit_logs WHERE changed_at < NOW() - INTERVAL '1 year';

-- Analyze tables for performance
ANALYZE users, companies, contacts, notices;
```

This database setup provides a solid foundation for the Company Dashboard application with proper relationships, indexing, and security considerations.
