# Quick Start Guide: Phonebook App

## Prerequisites
- Windows 10/11
- No additional software installations required

## Installation
1. Copy the `PhonebookApp.exe` file to your local machine
2. Place it in any folder (desktop, documents, network share)
3. Ensure the folder is writable (for database storage)

## Running the Application
1. Double-click `PhonebookApp.exe`
2. The application will:
   - Start the background server automatically
   - Open your default web browser
   - Navigate to `http://localhost:5000`
3. If the app is already running, it will focus the existing window

## First Time Setup
1. On first run, you'll be prompted to create an admin user
2. Set up your username, email, and password
3. The admin user has full access to all features

## User Roles
- **Admin**: Full access to all features including user management
- **Editor**: Can manage contacts and companies, view notices
- **User**: Read-only access to contacts, companies, and notices

## Main Features
- **Dashboard**: Overview with recent activity and notices
- **Contacts**: Manage personal contact information
- **Companies**: Manage business contact information
- **User Management** (Admin only): Create and manage user accounts
- **Notice Board**: Post announcements for all users

## Troubleshooting
- **App won't start**: Check if another instance is running
- **Browser doesn't open**: Manually navigate to `http://localhost:5000`
- **Permission errors**: Ensure the folder containing the .exe is writable
- **Port conflict**: If port 5000 is in use, the app will use an available port

## Data Storage
- All data is stored locally in a SQLite database file
- Database file: `phonebook.db` (created automatically)
- Backup the database file to preserve your data

## Updating
1. Replace the old `PhonebookApp.exe` with the new version
2. Your existing data will be preserved
3. Restart the application

## Support
- Check the application logs for error details
- Contact your system administrator for assistance
- Report bugs with log files and system information

## Security Notes
- The application runs locally on your machine
- Data is stored securely in the local database
- No data is transmitted over the internet unless configured
- Use strong passwords for all user accounts
