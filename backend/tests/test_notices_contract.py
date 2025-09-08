import json
from app import create_app, db


class TestNoticesContract:
    """Test notices endpoints according to contracts/notices.md"""

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
            # Create test user
            from models import User

            self.test_user = User(
                username="admin", email="admin@example.com", role="admin"
            )
            self.test_user.set_password("password123")
            db.session.add(self.test_user)
            db.session.commit()

    def login(self):
        """Helper to login as admin"""
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "admin", "password": "password123"}),
            content_type="application/json",
        )

    def test_get_notices_empty(self):
        """Test GET /api/notices with no notices"""
        self.login()
        response = self.client.get("/api/notices")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "notices" in data
        assert len(data["notices"]) == 0

    def test_post_notices_create(self):
        """Test POST /api/notices to create a notice"""
        self.login()
        notice_data = {
            "title": "System Maintenance",
            "content": "Scheduled maintenance tonight from 10 PM to 2 AM",
            "priority": "high",
        }

        response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["success"] == True
        assert "notice" in data
        assert data["notice"]["title"] == "System Maintenance"
        assert data["notice"]["priority"] == "high"

    def test_get_notices_after_create(self):
        """Test GET /api/notices after creating notices"""
        self.login()

        # Create a notice
        notice_data = {
            "title": "Company Meeting",
            "content": "All hands meeting tomorrow at 10 AM",
            "priority": "medium",
        }
        self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        # Get notices
        response = self.client.get("/api/notices")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data["notices"]) == 1
        assert data["notices"][0]["title"] == "Company Meeting"
        assert data["notices"][0]["priority"] == "medium"

    def test_post_notices_with_expiry(self):
        """Test creating notice with expiration date"""
        self.login()
        from datetime import datetime, timedelta

        expiry_date = (datetime.utcnow() + timedelta(days=7)).isoformat()
        notice_data = {
            "title": "Temporary Notice",
            "content": "This notice expires in 7 days",
            "priority": "low",
            "expires_at": expiry_date,
        }

        response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["notice"]["expires_at"] is not None

    def test_delete_notices(self):
        """Test DELETE /api/notices/{id}"""
        self.login()

        # Create a notice
        notice_data = {"title": "Test Notice", "content": "This is a test notice"}
        create_response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )
        notice_id = json.loads(create_response.data)["notice"]["id"]

        # Delete the notice
        response = self.client.delete(f"/api/notices/{notice_id}")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] == True

        # Verify it's gone
        get_response = self.client.get("/api/notices")
        data = json.loads(get_response.data)
        assert len(data["notices"]) == 0
