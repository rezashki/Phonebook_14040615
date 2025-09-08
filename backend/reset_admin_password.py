"""
Reset admin user password to default.
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import User


def reset_admin_password():
    """Reset admin user password to default"""
    app = create_app()

    with app.app_context():
        # Find the admin user
        admin_user = User.query.filter_by(username="admin").first()

        if admin_user:
            print(f"Found admin user: {admin_user.username}")

            # Reset password to default
            admin_user.set_password("admin123")
            db.session.commit()

            print("✅ Admin password reset successfully!")
            print("Username: admin")
            print("Password: admin123")

            # Test the password
            if admin_user.check_password("admin123"):
                print("✅ Password verification successful!")
            else:
                print("❌ Password verification failed!")

        else:
            print("❌ Admin user not found!")


if __name__ == "__main__":
    reset_admin_password()
