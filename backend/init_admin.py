"""
Initialize default admin user for the Phonebook application.
Run this script to create the default admin user if it doesn't exist.
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import User


def init_admin_user():
    """Create default admin user if none exists"""
    app = create_app()

    with app.app_context():
        # Create tables if they don't exist
        db.create_all()

        # Check if any admin user exists
        admin_count = User.query.filter_by(role="admin").count()

        if admin_count == 0:
            print("No admin user found. Creating default admin user...")

            # Create default admin user
            admin_user = User(
                username="admin", email="admin@phonebook.local", role="admin"
            )
            admin_user.set_password("admin123")

            db.session.add(admin_user)
            db.session.commit()

            print("✅ Default admin user created successfully!")
            print("Username: admin")
            print("Password: admin123")
            print("Email: admin@phonebook.local")

        else:
            print(f"Found {admin_count} admin user(s) in the database.")

            # List existing admin users
            admins = User.query.filter_by(role="admin").all()
            print("\nExisting admin users:")
            for admin in admins:
                print(f"- Username: {admin.username}, Email: {admin.email}")


if __name__ == "__main__":
    init_admin_user()
