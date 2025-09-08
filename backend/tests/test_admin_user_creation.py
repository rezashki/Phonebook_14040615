import json
from app import create_app, db


class TestAdminUserCreation:
    """Integration test for admin user creation workflow"""

    def setup_method(self):
        """Set up test client and database"""
        self.app = create_app(
            {
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "SECRET_KEY": "test-secret-key",
            }
        )
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def test_admin_user_creation_flow(self):
        """Test the complete flow of creating an admin user"""
        # Step 1: Create admin user via API
        admin_data = {
            "username": "admin",
            "email": "admin@company.com",
            "password": "securepassword123",
            "role": "admin",
        }

        response = self.client.post(
            "/api/users", data=json.dumps(admin_data), content_type="application/json"
        )

        # This should succeed (assuming the endpoint exists)
        assert response.status_code in [200, 201]
        data = json.loads(response.data)
        assert data["success"] == True
        assert "user" in data
        assert data["user"]["role"] == "admin"

    def test_admin_login_after_creation(self):
        """Test that admin can login after creation"""
        # First create admin
        admin_data = {
            "username": "admin",
            "email": "admin@company.com",
            "password": "securepassword123",
            "role": "admin",
        }
        self.client.post(
            "/api/users", data=json.dumps(admin_data), content_type="application/json"
        )

        # Then try to login
        login_response = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "admin", "password": "securepassword123"}),
            content_type="application/json",
        )

        assert login_response.status_code == 200
        login_data = json.loads(login_response.data)
        assert login_data["success"] == True
        assert login_data["user"]["role"] == "admin"

    def test_admin_can_create_other_users(self):
        """Test that admin can create other users after login"""
        # Create and login as admin
        admin_data = {
            "username": "admin",
            "email": "admin@company.com",
            "password": "securepassword123",
            "role": "admin",
        }
        self.client.post(
            "/api/users", data=json.dumps(admin_data), content_type="application/json"
        )

        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "admin", "password": "securepassword123"}),
            content_type="application/json",
        )

        # Create a regular user
        user_data = {
            "username": "editor1",
            "email": "editor@company.com",
            "password": "password123",
            "role": "editor",
        }

        response = self.client.post(
            "/api/users", data=json.dumps(user_data), content_type="application/json"
        )

        assert response.status_code in [200, 201]
        data = json.loads(response.data)
        assert data["success"] == True
        assert data["user"]["role"] == "editor"

    def test_non_admin_cannot_create_users(self):
        """Test that non-admin users cannot create other users"""
        # Create admin and regular user
        admin_data = {
            "username": "admin",
            "email": "admin@company.com",
            "password": "securepassword123",
            "role": "admin",
        }
        self.client.post(
            "/api/users", data=json.dumps(admin_data), content_type="application/json"
        )

        user_data = {
            "username": "user1",
            "email": "user@company.com",
            "password": "password123",
            "role": "user",
        }
        self.client.post(
            "/api/users", data=json.dumps(user_data), content_type="application/json"
        )

        # Login as regular user
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "user1", "password": "password123"}),
            content_type="application/json",
        )

        # Try to create another user (should fail)
        new_user_data = {
            "username": "user2",
            "email": "user2@company.com",
            "password": "password123",
            "role": "user",
        }

        response = self.client.post(
            "/api/users",
            data=json.dumps(new_user_data),
            content_type="application/json",
        )

        # Should be forbidden
        assert response.status_code == 403
