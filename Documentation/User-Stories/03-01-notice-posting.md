# Story 3.1: Notice Board - Basic Posting

## 📖 User Story
**As a manager**, I want to post company announcements and notices on a shared board, so that all employees can stay informed about important updates and news.

## 🎯 Acceptance Criteria

### Must Have:
- [ ] Create new notice with title, content, and category
- [ ] Rich text editor for content formatting
- [ ] Set notice priority level (Low, Medium, High, Urgent)
- [ ] Publish notices immediately or schedule for later
- [ ] View all published notices in chronological order
- [ ] Edit and delete own notices

### Should Have:
- [ ] Draft notices (save without publishing)
- [ ] Notice categories (General, HR, IT, Safety, etc.)
- [ ] Attach files/documents to notices
- [ ] Set expiration date for notices
- [ ] View counter for notices
- [ ] Comments on notices

### Nice to Have:
- [ ] Notice approval workflow
- [ ] Email notifications for urgent notices
- [ ] Notice templates for common announcements
- [ ] Pin important notices to top

## 🎨 UI Mockup Description

### Notice Board Main View
```
┌─────────────────────────────────────────────────────────────────────┐
│  📢 NOTICE BOARD                                  [+ New Notice]     │
├─────────────────────────────────────────────────────────────────────┤
│  Filter: [All Categories ▼] [All Priority ▼] Sort: [Newest First ▼] │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🔴 URGENT │ Office Closure - Emergency Maintenance       │ 👁 45 │ │
│  │ HR       │ Posted by: John Admin • 2 hours ago           │  💬 3 │ │
│  │          │ The office will be closed tomorrow due to...   │       │ │
│  │          │ [Read More]                              [📎 2]│       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🟡 HIGH   │ New Employee Onboarding Process           │ 👁 127│ │
│  │ HR       │ Posted by: Sarah HR • 1 day ago             │  💬 8 │ │
│  │          │ We're excited to announce improvements to... │       │ │
│  │          │ [Read More]                                  │       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🟢 MEDIUM │ Company Picnic Planning Committee         │ 👁 89 │ │
│  │ General  │ Posted by: Mike Events • 3 days ago         │  💬 12│ │
│  │          │ Join us in planning this year's company...   │       │ │
│  │          │ [Read More]                                  │       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Load More Notices...                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Create/Edit Notice Form
```
┌─────────────────────────────────────────────────────────────────────┐
│  📢 CREATE NEW NOTICE                               [✖ Close]       │
├─────────────────────────────────────────────────────────────────────┤
│  Title: [___________________________________________________] *      │
│                                                                       │
│  Category: [General ▼]     Priority: [Medium ▼]     📌 Pin to Top   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Content: (Rich Text Editor)                                     │ │
│  │                                                                 │ │
│  │  [B] [I] [U] [🔗] [📷] [📋] [•] [1.]  [📝] [🎨]              │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │                                                         │   │ │
│  │  │  Type your announcement here...                         │   │ │
│  │  │                                                         │   │ │
│  │  │                                                         │   │ │
│  │  │                                                         │   │ │
│  │  │                                                         │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  📎 Attachments:                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  [📁 Upload Files] or drag and drop files here                 │ │
│  │                                                                 │ │
│  │  📄 policy-update.pdf (2.3 MB) [❌]                           │ │
│  │  📊 quarterly-report.xlsx (1.8 MB) [❌]                       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Publishing Options:                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐│
│  │ Publication Date:       │  │ Expiration Date: (Optional)         ││
│  │ ⚪ Publish Now          │  │ [_______________] 📅               ││
│  │ ⚪ Schedule: [_______] 📅│  │                                     ││
│  └─────────────────────────┘  └─────────────────────────────────────┘│
│                                                                       │
│  Target Audience:                                                     │
│  ☑ All Employees  ☐ Specific Departments: [HR▼] [IT▼] [+]          │
│                                                                       │
│           [Cancel]  [Save Draft]  [Preview]  [Publish Notice]        │
└─────────────────────────────────────────────────────────────────────┘
```

### Notice Detail View
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Notice Board                           [Edit] [Delete]    │
├─────────────────────────────────────────────────────────────────────┤
│  🔴 URGENT • HR                                          👁 125 views│
│                                                                       │
│  Office Closure - Emergency Maintenance                              │
│  Posted by: John Admin • 5 hours ago                                 │
│  Expires: Tomorrow at 6:00 PM                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Dear Team,                                                           │
│                                                                       │
│  Due to emergency electrical maintenance, our main office will be    │
│  closed tomorrow, September 8th, 2025. All employees should work     │
│  from home unless specifically instructed otherwise by your manager. │
│                                                                       │
│  Key Points:                                                          │
│  • Building will be inaccessible from 6 AM to 6 PM                   │
│  • All meetings should be conducted virtually                        │
│  • Security systems will be offline                                  │
│  • Building will reopen Thursday morning as usual                    │
│                                                                       │
│  Please contact your manager if you have any questions.              │
│                                                                       │
│  Best regards,                                                        │
│  Facilities Management                                                │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  📎 Attachments:                                                     │
│  📄 emergency-procedures.pdf                                         │
│  📞 emergency-contacts.docx                                          │
├─────────────────────────────────────────────────────────────────────┤
│  💬 Comments (3)                               [💬 Add Comment]      │
│                                                                       │
│  👤 Sarah Jones - 2 hours ago                                        │
│  Thanks for the heads up! Will my keycard work tomorrow evening?     │
│  [Reply]                                                              │
│                                                                       │
│  👤 Mike Tech - 1 hour ago                                           │
│  @Sarah No, keycards will be disabled. Wait for all-clear email.    │
│  [Reply]                                                              │
│                                                                       │
│  👤 Lisa Manager - 30 minutes ago                                    │
│  My team has client calls tomorrow. Are phones working?              │
│  [Reply]                                                              │
└─────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technical Implementation

### Step 1: Database Schema
```sql
-- Notices table
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    priority_level VARCHAR(20) NOT NULL DEFAULT 'medium',
    
    -- Publishing details
    author_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, expired, archived
    publication_date TIMESTAMP,
    expiry_date TIMESTAMP,
    is_pinned BOOLEAN DEFAULT false,
    
    -- Engagement tracking
    views_count INTEGER DEFAULT 0,
    
    -- Target audience
    target_audience JSONB DEFAULT '{"type": "all"}', -- {"type": "all"} or {"type": "departments", "departments": ["hr", "it"]}
    
    -- File attachments
    attachments JSONB DEFAULT '[]', -- [{"filename": "file.pdf", "path": "/uploads/...", "size": 1024}]
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || content || ' ' || category)
    ) STORED
);

-- Notice views tracking (for analytics)
CREATE TABLE notice_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    viewed_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(notice_id, user_id) -- Prevent duplicate view counts per user
);

-- Notice comments
CREATE TABLE notice_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    parent_comment_id UUID REFERENCES notice_comments(id), -- For threaded comments
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notices_status_date ON notices(status, publication_date DESC);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_priority ON notices(priority_level);
CREATE INDEX idx_notices_search ON notices USING GIN(search_vector);
CREATE INDEX idx_notice_views_notice ON notice_views(notice_id);
CREATE INDEX idx_notice_comments_notice ON notice_comments(notice_id);
```

### Step 2: Backend API Routes
```typescript
// backend/src/routes/notices.ts
import express from 'express';
import { NoticeController } from '../controllers/notice.controller';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateNotice } from '../middleware/validation';
import { upload } from '../middleware/upload';

const router = express.Router();
const noticeController = new NoticeController();

// Public routes (read-only)
router.get('/', noticeController.getNotices);
router.get('/:id', noticeController.getNotice);
router.post('/:id/view', authenticateToken, noticeController.trackView);

// Protected routes
router.use(authenticateToken);

// Comment operations
router.get('/:id/comments', noticeController.getComments);
router.post('/:id/comments', noticeController.addComment);
router.delete('/comments/:commentId', noticeController.deleteComment);

// Notice management (managers and above)
router.post('/', requireRole(['manager', 'admin']), upload.array('attachments'), validateNotice, noticeController.createNotice);
router.put('/:id', requireRole(['manager', 'admin']), upload.array('attachments'), validateNotice, noticeController.updateNotice);
router.delete('/:id', requireRole(['manager', 'admin']), noticeController.deleteNotice);

// Admin operations
router.patch('/:id/pin', requireRole(['admin']), noticeController.pinNotice);
router.patch('/:id/feature', requireRole(['admin']), noticeController.featureNotice);

export default router;
```

### Step 3: Notice Service
```typescript
// backend/src/services/notice.service.ts
export class NoticeService {
  async getNotices(params: GetNoticesParams) {
    const {
      page = 1,
      limit = 10,
      category,
      priority,
      status = 'published',
      sortBy = 'publication_date',
      sortOrder = 'desc'
    } = params;

    let query = `
      SELECT 
        n.*,
        u.first_name || ' ' || u.last_name as author_name,
        u.department as author_department,
        COALESCE(cc.comment_count, 0) as comment_count
      FROM notices n
      JOIN users u ON n.author_id = u.id
      LEFT JOIN (
        SELECT notice_id, COUNT(*) as comment_count 
        FROM notice_comments 
        GROUP BY notice_id
      ) cc ON n.id = cc.notice_id
      WHERE n.status = $1
      AND (n.expiry_date IS NULL OR n.expiry_date > NOW())
    `;

    const params_array = [status];
    let paramIndex = 2;

    if (category) {
      query += ` AND n.category = $${paramIndex}`;
      params_array.push(category);
      paramIndex++;
    }

    if (priority) {
      query += ` AND n.priority_level = $${paramIndex}`;
      params_array.push(priority);
      paramIndex++;
    }

    // Pinned notices first, then by specified sort
    query += ` ORDER BY n.is_pinned DESC, n.${sortBy} ${sortOrder}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    
    params_array.push(limit.toString(), ((page - 1) * limit).toString());

    const result = await db.query(query, params_array);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM notices n 
      WHERE n.status = $1 
      AND (n.expiry_date IS NULL OR n.expiry_date > NOW())
    `;
    const totalResult = await db.query(countQuery, [status]);
    
    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(totalResult.rows[0].count),
        totalPages: Math.ceil(totalResult.rows[0].count / limit)
      }
    };
  }

  async createNotice(noticeData: CreateNoticeData, authorId: string, files?: Express.Multer.File[]) {
    // Handle file uploads
    const attachments = files ? files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    const notice = await db.query(`
      INSERT INTO notices (
        title, content, category, priority_level, author_id,
        publication_date, expiry_date, target_audience, attachments, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      noticeData.title,
      noticeData.content,
      noticeData.category,
      noticeData.priority_level,
      authorId,
      noticeData.publication_date || new Date(),
      noticeData.expiry_date,
      JSON.stringify(noticeData.target_audience),
      JSON.stringify(attachments),
      noticeData.status || 'published'
    ]);

    return notice.rows[0];
  }

  async trackView(noticeId: string, userId: string) {
    // Insert view record (ignore if already exists)
    await db.query(`
      INSERT INTO notice_views (notice_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (notice_id, user_id) DO NOTHING
    `, [noticeId, userId]);

    // Update view count
    await db.query(`
      UPDATE notices 
      SET views_count = (
        SELECT COUNT(*) FROM notice_views WHERE notice_id = $1
      )
      WHERE id = $1
    `, [noticeId]);
  }
}
```

### Step 4: Frontend Components
```tsx
// frontend/src/components/notices/NoticeBoard.tsx
import React, { useState, useEffect } from 'react';
import { NoticeCard } from './NoticeCard';
import { NoticeForm } from './NoticeForm';
import { noticeService } from '../../services/notice.service';
import { useAuth } from '../../hooks/useAuth';

export const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    sortBy: 'publication_date'
  });
  const { user } = useAuth();
  const canCreateNotice = ['manager', 'admin'].includes(user?.role);

  const loadNotices = async () => {
    try {
      const response = await noticeService.getNotices(filters);
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [filters]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          📢 Notice Board
        </h1>
        {canCreateNotice && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + New Notice
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="hr">HR</option>
            <option value="it">IT</option>
            <option value="safety">Safety</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onView={(id) => noticeService.trackView(id)}
            onEdit={canCreateNotice ? () => {/* Open edit form */} : undefined}
          />
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <NoticeForm
          onSave={() => {
            loadNotices();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
```

## 🔌 API Specifications

### GET /api/notices
```json
{
  "method": "GET",
  "endpoint": "/api/notices",
  "parameters": {
    "page": "number",
    "limit": "number",
    "category": "string",
    "priority": "string",
    "status": "string"
  },
  "response": {
    "data": [
      {
        "id": "uuid",
        "title": "string",
        "content": "string (truncated)",
        "category": "string",
        "priority_level": "string",
        "author_name": "string",
        "publication_date": "timestamp",
        "views_count": "number",
        "comment_count": "number",
        "is_pinned": "boolean",
        "attachments": []
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

### POST /api/notices
```json
{
  "method": "POST",
  "endpoint": "/api/notices",
  "requestBody": {
    "title": "string (required)",
    "content": "string (required)",
    "category": "string (required)",
    "priority_level": "string (required)",
    "publication_date": "timestamp (optional)",
    "expiry_date": "timestamp (optional)",
    "target_audience": "object",
    "status": "string (draft|published)"
  },
  "files": "multipart/form-data (attachments)",
  "response": {
    "201": "Notice created successfully",
    "400": "Validation error",
    "403": "Insufficient permissions"
  }
}
```

## ✅ Testing Checklist

### Functionality Tests
- [ ] Create notice with all required fields
- [ ] Create notice with attachments
- [ ] Edit existing notice
- [ ] Delete notice with confirmation
- [ ] View notice details and track views
- [ ] Comment on notices
- [ ] Filter notices by category/priority
- [ ] Pin/unpin notices (admin only)

### Permission Tests
- [ ] Regular users cannot create notices
- [ ] Managers can create/edit notices
- [ ] Users can only edit their own notices
- [ ] Admin can manage all notices

### Rich Text Editor Tests
- [ ] Basic formatting (bold, italic, underline)
- [ ] Lists and bullet points
- [ ] Links and images
- [ ] Content saves correctly

## 🔄 Next Steps
After completing this story:
- [Story 3.2: Notice Board - Categories & Targeting](./03-02-notice-targeting.md)
- [Story 3.3: Real-time Notifications](./03-03-real-time-notifications.md)
