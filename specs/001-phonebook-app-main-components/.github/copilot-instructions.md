# GitHub Copilot Instructions: Phonebook App

## Project Overview

You are helping build a portable Windows phonebook application with the following components:

- React frontend (built to static files)
- Flask backend API
- SQLite database
- PyInstaller packaging for single .exe distribution
- Single instance management
- Background server with auto-cleanup

## Key Requirements

- **Portability**: No external dependencies for end users
- **Single Instance**: Only one app instance can run at a time
- **Background Server**: Flask runs invisibly, stops on app exit
- **User Roles**: Admin, Editor, User with different permissions
- **Components**: Dashboard, Contacts, Companies, User Management, Notice Board

## Development Guidelines

### Code Structure

```
/app
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── build/         # Static files for Flask
├── backend/
│   ├── app.py         # Flask application
│   ├── models.py      # SQLAlchemy models
│   ├── routes/        # API endpoints
│   └── utils/         # Helper functions
├── launcher.py        # Main executable script
├── requirements.txt   # Python dependencies
└── build.py          # PyInstaller script
```

### API Design

- RESTful endpoints with JSON responses
- Session-based authentication
- Role-based access control
- Proper error handling and validation

### Frontend Guidelines

- Use React hooks for state management
- Implement responsive design
- Handle loading states and errors gracefully
- Use consistent styling (consider Tailwind CSS)

### Backend Guidelines

- Use Flask-SQLAlchemy for database operations
- Implement proper authentication decorators
- Validate all inputs
- Return consistent JSON responses
- Log important events

### Packaging Guidelines

- Use PyInstaller with --onefile flag
- Include all dependencies
- Bundle React static files
- Test the packaged executable thoroughly

## Common Patterns

### Authentication Check

```python
from functools import wraps
from flask import session, jsonify

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function
```

### Database Operations

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # ... other fields

# Usage
@app.route('/api/contacts', methods=['GET'])
@login_required
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts])
```

### React Component Structure

```jsx
import React, { useState, useEffect } from "react";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact-item">
          {contact.name}
        </div>
      ))}
    </div>
  );
}

export default ContactList;
```

## Best Practices

- Write clear, self-documenting code
- Add type hints to Python functions
- Use meaningful variable and function names
- Handle errors gracefully
- Write tests for critical functionality
- Follow REST API conventions
- Keep components small and focused
- Use environment variables for configuration

## Testing Strategy

- Unit tests for utility functions
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Test authentication and authorization
- Test single instance behavior
- Test packaging and distribution

## Deployment Checklist

- [ ] All dependencies listed in requirements.txt
- [ ] React app builds successfully
- [ ] Database migrations work
- [ ] Authentication flows tested
- [ ] PyInstaller creates working .exe
- [ ] Single instance prevention works
- [ ] Background server management works
- [ ] Auto-cleanup on exit works
- [ ] Documentation updated
