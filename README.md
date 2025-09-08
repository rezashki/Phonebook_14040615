# Phonebook Application

A portable, dependency-free Windows phonebook application with a modern web interface.

## Features

- **Dashboard**: Overview of contacts, companies, and notices
- **Contacts Management**: Add, edit, delete, and search contacts
- **Companies Management**: Manage company information separately
- **Notice Board**: Post announcements visible to all users
- **User Management**: Admin panel for managing users (admin only)
- **Role-based Access Control**: Three user roles (admin, editor, user)
- **Session-based Authentication**: Secure login system

## Quick Start

1. **Download**: Get the `Phonebook.exe` file from the `dist` folder
2. **Run**: Double-click `Phonebook.exe` to start the application
3. **Access**: Open your browser and go to `http://localhost:5000`
4. **Login**: Use the default admin credentials:
   - Username: `admin`
   - Password: `admin123`

## User Roles

### Admin
- Full access to all features
- Can create, edit, and delete all data
- Can manage users (create, edit, delete)
- Can post notices

### Editor
- Can create and edit their own contacts
- Can view all contacts and companies
- Cannot manage users or post notices

### User
- Can view contacts and companies
- Cannot create, edit, or delete any data
- Cannot access user management or notice posting

## Application Structure

The application consists of:
- **Frontend**: React-based web interface with Tailwind CSS styling
- **Backend**: Flask REST API with SQLite database
- **Packaging**: Single executable file containing everything needed

## Database

The application uses SQLite for data storage. The database file (`phonebook.db`) is created automatically when you first run the application.

## Security Features

- Password hashing with Werkzeug
- Session-based authentication
- Role-based access control
- CSRF protection
- Input validation and sanitization

## Development

If you want to modify the application:

1. **Frontend**: Located in the `frontend/` directory
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend**: Located in the `backend/` directory
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Build**: Use the build script
   ```bash
   python build.py
   ```

## Requirements

- Windows 10 or later
- No additional dependencies required (everything is bundled)

## Troubleshooting

- **Port already in use**: The application runs on port 5000. If it's already in use, close other applications using that port.
- **Database issues**: Delete the `phonebook.db` file to reset the database.
- **Permission errors**: Make sure you have write permissions in the application directory.

## License

This project is for educational and personal use.
