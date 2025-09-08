import json
from app import create_app, db


class TestAuthContract:
    """Test authentication endpoints according to contracts/auth.md"""

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

    def test_post_auth_login_success(self):
        """Test POST /api/auth/login with valid credentials"""
        # First create a test user
        with self.app.app_context():
            from models import User

            user = User(username="testuser", email="test@example.com")
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()

        # Test login
        response = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "testuser", "password": "password123"}),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"]
        assert "user" in data
        assert data["user"]["username"] == "testuser"

    def test_post_auth_login_invalid_credentials(self):
        """Test POST /api/auth/login with invalid credentials"""
        response = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "nonexistent", "password": "wrongpass"}),
            content_type="application/json",
        )

        assert response.status_code == 401
        data = json.loads(response.data)
        assert not data["success"]
        assert "error" in data

    def test_post_auth_logout(self):
        """Test POST /api/auth/logout"""
        # First login
        with self.app.app_context():
            from models import User

            user = User(username="testuser", email="test@example.com")
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()

        # Login first
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "testuser", "password": "password123"}),
            content_type="application/json",
        )

        # Then logout
        response = self.client.post("/api/auth/logout")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"]

    def test_get_auth_status_authenticated(self):
        """Test GET /api/auth/status when authenticated"""
        # First login
        with self.app.app_context():
            from models import User

            user = User(username="testuser", email="test@example.com")
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()

        # Login
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "testuser", "password": "password123"}),
            content_type="application/json",
        )

        # Check status
        response = self.client.get("/api/auth/status")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["authenticated"]
        assert data["user"]["username"] == "testuser"

    def test_get_auth_status_not_authenticated(self):
        """Test GET /api/auth/status when not authenticated"""
        response = self.client.get("/api/auth/status")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert not data["authenticated"]
