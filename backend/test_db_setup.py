#!/usr/bin/env python3
"""Test database creation and admin user setup"""

import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import db
from models import User
from app import create_app

print("Creating Flask app...")
app = create_app()

print("Setting up database...")
with app.app_context():
    # Create tables
    db.create_all()
    print("Database tables created")

    # Check if admin exists
    admin = User.query.filter_by(username="admin").first()
    if admin:
        print(f"Admin user found: {admin.username}")
    else:
        print("Creating admin user...")
        admin_user = User(
            username="admin",
            email="admin@phonebook.local",
            first_name="Administrator",
            last_name="User",
            role="admin",
            is_active=True,
        )
        admin_user.set_password("admin123")
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created successfully")

    # Test password
    if admin:
        password_correct = admin.check_password("admin123")
        print(f"Password test: {password_correct}")

print("Database setup complete!")
