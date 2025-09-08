"""
Test login functionality directly
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import User
import json


def test_login():
    """Test login functionality"""
    app = create_app()

    with app.app_context():
        # Check if admin user exists
        admin_user = User.query.filter_by(username="admin").first()

        if not admin_user:
            print("❌ Admin user not found!")
            return

        print(f"✅ Admin user found: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   Role: {admin_user.role}")
        print(f"   Active: {admin_user.is_active}")

        # Test password
        test_password = "admin123"
        if admin_user.check_password(test_password):
            print(f"✅ Password '{test_password}' is correct!")
        else:
            print(f"❌ Password '{test_password}' is incorrect!")

        # Test alternative passwords
        alt_passwords = ["admin", "password", "securepassword123", "123456"]
        for pwd in alt_passwords:
            if admin_user.check_password(pwd):
                print(f"✅ Alternative password found: '{pwd}'")
                return

        print("❌ No alternative passwords worked")

        # Show password hash for debugging
        print(f"Password hash: {admin_user.password_hash[:50]}...")


def test_api_login():
    """Test the actual API login endpoint"""
    app = create_app()

    with app.test_client() as client:
        # Test login API
        login_data = {"username": "admin", "password": "admin123"}

        response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )

        print(f"\nAPI Test Results:")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")


if __name__ == "__main__":
    test_login()
    test_api_login()
