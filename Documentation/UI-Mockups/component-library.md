# UI Component Library & Mockups

## 📋 Overview
This document outlines the visual design system and UI components for the Company Dashboard application.

## 🎨 Design System

### Color Palette
```
Primary Colors:
- Primary Blue: #3B82F6 (Buttons, Links, Active States)
- Primary Dark: #1E40AF (Hover States)
- Primary Light: #DBEAFE (Backgrounds, Subtle Highlights)

Secondary Colors:
- Gray 900: #111827 (Headings, Primary Text)
- Gray 600: #4B5563 (Secondary Text)
- Gray 400: #9CA3AF (Borders, Dividers)
- Gray 100: #F3F4F6 (Backgrounds, Cards)
- White: #FFFFFF (Main Background)

Status Colors:
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)  
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

Priority Colors:
- Urgent: #DC2626 (Red)
- High: #F59E0B (Orange)
- Medium: #10B981 (Green)
- Low: #6B7280 (Gray)
```

### Typography
```
Headings:
- H1: 2.25rem (36px) - font-bold
- H2: 1.875rem (30px) - font-semibold  
- H3: 1.5rem (24px) - font-semibold
- H4: 1.25rem (20px) - font-medium

Body Text:
- Large: 1.125rem (18px) - font-normal
- Normal: 1rem (16px) - font-normal
- Small: 0.875rem (14px) - font-normal
- Extra Small: 0.75rem (12px) - font-normal
```

### Spacing
```
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)  
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
```

## 🧩 Core Components

### Navigation Components

#### Main Navigation
```
┌─────────────────────────────────────────────────────────────────────┐
│  🏢 Company Dashboard                    👤 John Doe ▼  🔔 ⚙️     │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Dashboard  📞 Contacts  🏢 Companies  📢 Notices  👔 Board      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Sidebar Navigation (Alternative)
```
┌──────────────────┐ ┌─────────────────────────────────────────────────┐
│ 🏢 Dashboard     │ │                                                 │
├──────────────────┤ │                                                 │
│ 📊 Overview      │ │              Main Content Area                  │
│ 📞 Contacts      │ │                                                 │
│ 🏢 Companies     │ │                                                 │
│ 📢 Notices       │ │                                                 │
│ 👔 Board Members │ │                                                 │
│ ⚙️ Settings      │ │                                                 │
│                  │ │                                                 │
│ 👤 John Doe      │ │                                                 │
│ 🚪 Logout        │ │                                                 │
└──────────────────┘ └─────────────────────────────────────────────────┘
```

### Form Components

#### Input Field
```
┌─────────────────────────────────────────────────────────────────────┐
│ Label: *                                                            │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Placeholder text...                                           🔍│ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ Helper text or error message                                        │
└─────────────────────────────────────────────────────────────────────┘
```

#### Select Dropdown
```
┌─────────────────────────────────────────────────────────────────────┐
│ Select Option:                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Choose an option...                                           ▼ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

#### Multi-select with Tags
```
┌─────────────────────────────────────────────────────────────────────┐
│ Tags:                                                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [frontend ×] [react ×] [team-lead ×] Add tag...               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Display Components

#### Card Component
```
┌─────────────────────────────────────────────────────────────────────┐
│  📄 Card Title                                         [⚙️ Actions] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Card content goes here with proper spacing and typography.        │
│  Multiple lines are supported with consistent formatting.           │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐                                  │
│  │   Button    │  │   Button    │                                  │
│  └─────────────┘  └─────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Data Table
```
┌─────────────────────────────────────────────────────────────────────┐
│ Search: [_______________] 🔍    Filter: [All ▼]    [+ Add New]     │
├─┬─────────────────┬─────────────────┬─────────────────┬──────────────┤
│☐│ Name ▲          │ Email           │ Department      │ Actions      │
├─┼─────────────────┼─────────────────┼─────────────────┼──────────────┤
│☐│ John Smith      │ j.smith@co.com  │ Engineering     │ ✏️ 👁️ 🗑️    │
│☐│ Jane Doe        │ jane@co.com     │ Marketing       │ ✏️ 👁️ 🗑️    │
│☐│ Mike Johnson    │ mike@co.com     │ Sales           │ ✏️ 👁️ 🗑️    │
├─┴─────────────────┴─────────────────┴─────────────────┴──────────────┤
│ ☐ Select All     Showing 1-10 of 156   [◀ Prev] [1][2][3] [Next ▶] │
└─────────────────────────────────────────────────────────────────────┘
```

### Status & Priority Indicators

#### Priority Badges
```
🔴 URGENT    🟡 HIGH    🟢 MEDIUM    ⚪ LOW
```

#### Status Indicators
```
✅ Active    ⏸️ Inactive    🔄 Pending    ⚠️ Warning    ❌ Error
```

### Modal Components

#### Standard Modal
```
                    ┌─────────────────────────────────────┐
                    │ Modal Title                    [✖]  │
                    ├─────────────────────────────────────┤
                    │                                     │
                    │  Modal content goes here with      │
                    │  appropriate spacing and proper     │
                    │  typography formatting.             │
                    │                                     │
                    │  Form fields, text, or other       │
                    │  interactive elements.              │
                    │                                     │
                    ├─────────────────────────────────────┤
                    │        [Cancel]    [Save Changes]   │
                    └─────────────────────────────────────┘
```

#### Confirmation Dialog
```
                    ┌─────────────────────────────────────┐
                    │ ⚠️  Confirm Action                   │
                    ├─────────────────────────────────────┤
                    │                                     │
                    │  Are you sure you want to delete    │
                    │  this item? This action cannot be   │
                    │  undone.                            │
                    │                                     │
                    ├─────────────────────────────────────┤
                    │           [Cancel]    [Delete]      │
                    └─────────────────────────────────────┘
```

## 📱 Layout Templates

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  🏢 Company Dashboard         Search: [__________] 🔍  👤 User ▼     │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Dashboard  📞 Contacts  🏢 Companies  📢 Notices  👔 Board      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐           │
│  │ 📞 Contacts   │ │ 🏢 Companies  │ │ 📢 Notices    │           │
│  │               │ │               │ │               │           │
│  │     1,567     │ │      45       │ │      12       │           │
│  │   Total       │ │   Active      │ │   Active      │           │
│  └───────────────┘ └───────────────┘ └───────────────┘           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 📊 Recent Activity                                              │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ • John added contact "Jane Smith" - 2 hours ago                 │ │
│  │ • System posted "Office Closure Notice" - 3 hours ago          │ │
│  │ • Mike updated company "Tech Corp" - 5 hours ago               │ │
│  │ • Sarah created notice "New Policy Update" - 1 day ago         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 📢 Latest Notices                                               │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ 🔴 URGENT • Office Closure - Emergency Maintenance             │ │
│  │    Posted by: Admin • 2 hours ago                              │ │
│  │                                                                 │ │
│  │ 🟡 HIGH • New Employee Onboarding Process                      │ │
│  │    Posted by: HR Team • 1 day ago                              │ │
│  │                                                                 │ │
│  │ 🟢 MEDIUM • Company Picnic Planning                            │ │
│  │    Posted by: Events • 3 days ago                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Contact Detail View
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Contacts                              [Edit] [Delete]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────────────────────────────────────────┐│
│  │     📷      │  │ Jane Marie Smith                                ││
│  │             │  │ Senior Software Engineer                        ││
│  │  Profile    │  │ 📧 jane.smith@company.com                      ││
│  │   Photo     │  │ 📞 +1-555-0123  📱 +1-555-0124                ││
│  │             │  │ 🏢 Tech Corp • Engineering Department          ││
│  └─────────────┘  └─────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 📍 Contact Information                                          │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ Email:          jane.smith@company.com                          │ │
│  │ Secondary:      jane.marie@personal.com                         │ │
│  │ Phone:          +1-555-0123                                     │ │
│  │ Mobile:         +1-555-0124                                     │ │
│  │ Address:        123 Main St, New York, NY 10001, USA           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🏢 Work Information                                             │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ Company:        Tech Corp                                       │ │
│  │ Department:     Engineering                                     │ │
│  │ Position:       Senior Software Engineer                        │ │
│  │ Manager:        John Manager                                    │ │
│  │ Start Date:     January 15, 2022                               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🏷️ Tags & Notes                                                │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ Tags: [frontend] [react] [team-lead] [mentor]                   │ │
│  │                                                                 │ │
│  │ Notes:                                                          │ │
│  │ Excellent team player with strong frontend development skills.  │ │
│  │ Leads the React development team and mentors junior developers. │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Notice Board Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  📢 Notice Board                                  [+ New Notice]     │
├─────────────────────────────────────────────────────────────────────┤
│  Filter: [All Categories ▼] [All Priority ▼] Sort: [Newest ▼]       │
├─────────────────────────────────────────────────────────────────────┤
│  📌 PINNED                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🔴 URGENT │ Office Closure - Emergency Maintenance       📎 2   │ │
│  │ HR       │ Posted by: John Admin • 2 hours ago         👁 125  │ │
│  │          │ The office will be closed tomorrow due to...  💬 8   │ │
│  │          │ [Read More]                                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  📰 ALL NOTICES                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🟡 HIGH   │ New Employee Onboarding Process             👁 89  │ │
│  │ HR       │ Posted by: Sarah HR • 1 day ago             💬 12  │ │
│  │          │ We're excited to announce improvements...           │ │
│  │          │ [Read More]                                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🟢 MEDIUM │ Company Picnic Planning Committee           👁 45  │ │
│  │ General  │ Posted by: Mike Events • 3 days ago         💬 5   │ │
│  │          │ Join us in planning this year's company...          │ │
│  │          │ [Read More]                                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                           [Load More Notices]                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎭 Interactive States

### Button States
```
Default:    [  Button  ]
Hover:      [  Button  ] (slightly darker)
Active:     [  Button  ] (pressed appearance)  
Disabled:   [  Button  ] (grayed out)
Loading:    [  ⟳ Loading...]
```

### Form Field States
```
Default:    ┌─────────────────────┐
            │ Enter text...       │
            └─────────────────────┘

Focus:      ┌─────────────────────┐ (blue border)
            │ Enter text...       │
            └─────────────────────┘

Error:      ┌─────────────────────┐ (red border)
            │ Enter text...       │
            └─────────────────────┘
            Error message here

Success:    ┌─────────────────────┐ (green border)
            │ Valid input ✓       │
            └─────────────────────┘
```

## 📐 Responsive Breakpoints

```
Mobile:     < 640px  (sm)
Tablet:     640px+   (md: 768px+)
Desktop:    1024px+  (lg)
Large:      1280px+  (xl)
```

### Mobile Layout Adaptations
- Navigation collapses to hamburger menu
- Tables become vertically stacked cards
- Forms stack fields vertically
- Action buttons become full-width
- Sidebar navigation becomes slide-out drawer

## ♿ Accessibility Features

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Visual focus indicators on all focusable elements
- Skip links for main content areas

### Screen Reader Support
- Semantic HTML structure
- Appropriate ARIA labels and roles
- Alt text for all images
- Form labels properly associated

### Color & Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Color is not the only means of conveying information
- High contrast mode support

## 🎨 Animation Guidelines

### Micro-interactions
```
Hover transitions:     250ms ease-in-out
Button press:          150ms ease-in-out
Modal appearance:      300ms ease-out
Page transitions:      500ms ease-in-out
Loading animations:    1000ms infinite
```

### Loading States
```
Spinner:        ⟳ (rotating circle)
Progress bar:   ████████████░░░░ 75%
Skeleton:       ████░░░░████░░░░ (shimmer effect)
Pulse:          Breathing opacity effect
```

This design system ensures consistency across all components and provides a solid foundation for implementing the user stories with professional, accessible, and user-friendly interfaces.
