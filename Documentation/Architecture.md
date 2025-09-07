# System Architecture Document

## Project Overview

This project involves building a comprehensive company dashboard web application with multiple integrated modules. The system will be hosted on a cloud server and provide real-time collaboration features for enterprise use.

### Core Features:
- **Frontend:** Modern web application accessible via any browser
- **Backend:** RESTful API server with real-time capabilities
- **Database:** Scalable PostgreSQL database with proper relationships
- **Real-time Updates:** Socket.io integration for live notifications
- **Security:** Enterprise-grade security with role-based access control
- **Scalability:** Cloud-native architecture with containerization

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  Mobile     │  │  Admin      │  │  API        │        │
│  │  (React)    │  │  Browser    │  │  Panel      │  │  Docs       │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Load        │  │ API         │  │ WebSocket   │  │ Auth        │        │
│  │ Balancer    │  │ Gateway     │  │ Server      │  │ Service     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                    │                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Phone Book  │  │ Company     │  │ Notice      │  │ Board       │        │
│  │ Service     │  │ Service     │  │ Service     │  │ Service     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │ Redis       │  │ File        │  │ Search      │        │
│  │ Database    │  │ Cache       │  │ Storage     │  │ Index       │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Architecture

### 1. Frontend Layer (Presentation)

**Technology Stack:**
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Router v6 for navigation
- React Query for state management and caching
- React Hook Form for form handling
- Socket.io-client for real-time updates
- Axios for HTTP requests

**Key Components:**
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, inputs, etc.)
│   ├── layout/          # Layout components (header, sidebar, etc.)
│   └── forms/           # Form components
├── modules/             # Module-specific components
│   ├── phonebook/       # Contact management components
│   ├── companies/       # Company management components
│   ├── notices/         # Notice board components
│   └── board-members/   # Board member components
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

**State Management:**
- React Query for server state management
- React Context for global UI state
- Local state with useState/useReducer for component state
- Real-time updates via WebSocket integration

### 2. Backend Layer (Application)

**Technology Stack:**
- Node.js 18+ with Express.js
- TypeScript for type safety
- JWT for authentication
- Socket.io for real-time communication
- Multer for file uploads
- Winston for logging
- Joi for request validation

**API Architecture:**
```
src/
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── contacts.controller.js
│   ├── companies.controller.js
│   ├── notices.controller.js
│   └── board-members.controller.js
├── services/            # Business logic layer
├── models/              # Database models (Sequelize/Prisma)
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rate-limit.middleware.js
├── routes/              # API route definitions
├── utils/               # Utility functions
└── config/              # Configuration files
```

**API Endpoints Structure:**
```
/api/v1/
├── /auth                # Authentication endpoints
├── /users               # User management
├── /contacts            # Contact CRUD operations
├── /companies           # Company management
├── /notices             # Notice board operations
├── /board-members       # Board member management
└── /uploads             # File upload handling
```

### 3. Database Layer (Data)

**PostgreSQL Schema Design:**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    profile_picture VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Companies table (with self-referencing for hierarchy)
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
    primary_phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    mobile VARCHAR(20),
    primary_email VARCHAR(255),
    secondary_email VARCHAR(255),
    address JSONB,
    company_id UUID REFERENCES companies(id),
    department VARCHAR(100),
    position VARCHAR(100),
    birth_date DATE,
    notes TEXT,
    tags TEXT[],
    profile_picture VARCHAR(500),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notices table
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    priority_level VARCHAR(20) DEFAULT 'medium',
    author_id UUID REFERENCES users(id),
    publication_date TIMESTAMP,
    expiry_date TIMESTAMP,
    target_audience JSONB DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
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
    term_duration INTEGER,
    committee_memberships TEXT[],
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Database Relationships:**
- One-to-Many: Users → Contacts (created_by)
- One-to-Many: Users → Companies (created_by)
- One-to-Many: Companies → Contacts (company affiliation)
- Self-Referencing: Companies → Companies (parent-subsidiary)
- One-to-Many: Users → Notices (author)

### 4. Real-time Communication

**WebSocket Implementation:**
```javascript
// Socket.io namespaces
/dashboard         # General dashboard updates
/notices           # Notice board real-time updates
/contacts          # Contact updates and notifications
/system            # System-wide notifications
```

**Real-time Features:**
- New notice notifications
- Contact updates in real-time
- User activity status
- System maintenance announcements
- Chat/messaging (future enhancement)

## Security Architecture

### Authentication & Authorization Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │    Auth     │    │   Backend   │    │  Database   │
│             │    │  Middleware │    │   Service   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        │                   │                   │                   │
        │ 1. Login Request  │                   │                   │
        │──────────────────→│                   │                   │
        │                   │ 2. Validate Creds│                   │
        │                   │──────────────────→│                   │
        │                   │                   │ 3. Query User     │
        │                   │                   │──────────────────→│
        │                   │                   │ 4. User Data      │
        │                   │                   │←──────────────────│
        │                   │ 5. Generate JWT   │                   │
        │                   │←──────────────────│                   │
        │ 6. JWT + Refresh  │                   │                   │
        │←──────────────────│                   │                   │
        │                   │                   │                   │
        │ 7. API Request    │                   │                   │
        │──────────────────→│                   │                   │
        │                   │ 8. Verify JWT     │                   │
        │                   │──────────────────→│                   │
        │                   │ 9. Authorized     │                   │
        │                   │←──────────────────│                   │
```

### Security Measures:
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with content security policy
- Rate limiting to prevent abuse
- HTTPS encryption for all communications
- Password hashing with bcrypt

## Deployment Architecture

### Containerization Strategy

**Docker Services:**
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/phonebook
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: phonebook
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

### Cloud Infrastructure (AWS Example)

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ CloudFront  │    │ Application │    │   RDS       │     │
│  │    (CDN)    │    │ Load        │    │ PostgreSQL  │     │
│  └─────────────┘    │ Balancer    │    └─────────────┘     │
│          │          └─────────────┘            │           │
│          │                 │                   │           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    S3       │    │    ECS      │    │ ElastiCache │     │
│  │  (Files)    │    │ (Containers)│    │   (Redis)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Caching Strategy:
- **Frontend:** Browser caching, Service Worker for offline support
- **Backend:** Redis for session storage and frequently accessed data
- **Database:** Query optimization, indexing strategy, connection pooling
- **CDN:** Static asset distribution via CloudFront/CDN

### Database Optimization:
```sql
-- Indexes for performance
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_name ON contacts(first_name, last_name);
CREATE INDEX idx_contacts_email ON contacts(primary_email);
CREATE INDEX idx_companies_parent ON companies(parent_company_id);
CREATE INDEX idx_notices_status_date ON notices(status, publication_date);
CREATE INDEX idx_users_email ON users(email);
```

## Monitoring and Observability

### Application Monitoring:
- **Logs:** Structured logging with Winston
- **Metrics:** Performance metrics collection
- **Health Checks:** Endpoint monitoring
- **Error Tracking:** Comprehensive error reporting
- **Analytics:** User behavior and system usage analytics

### Key Metrics to Track:
- Response times for each API endpoint
- Database query performance
- User authentication success/failure rates
- Real-time connection status
- System resource utilization
- Error rates and types

This architecture provides a solid foundation for your company dashboard application while maintaining scalability, security, and maintainability.
