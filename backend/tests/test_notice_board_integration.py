import json
from app import create_app, db
from datetime import datetime, timedelta


class TestNoticeBoardIntegration:
    """Integration test for notice board functionality"""

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
            # Create test users
            from models import User

            self.admin_user = User(
                username="admin", email="admin@example.com", role="admin"
            )
            self.admin_user.set_password("password123")
            self.editor_user = User(
                username="editor", email="editor@example.com", role="editor"
            )
            self.editor_user.set_password("password123")
            self.regular_user = User(
                username="user", email="user@example.com", role="user"
            )
            self.regular_user.set_password("password123")
            db.session.add_all([self.admin_user, self.editor_user, self.regular_user])
            db.session.commit()

    def login_as(self, username):
        """Helper to login as specific user"""
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": username, "password": "password123"}),
            content_type="application/json",
        )

    def test_admin_can_create_notices(self):
        """Test that admin can create notices"""
        self.login_as("admin")

        notice_data = {
            "title": "Important Announcement",
            "content": "Company meeting tomorrow at 10 AM in the main conference room",
            "priority": "high",
        }

        response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        assert response.status_code in [200, 201]
        data = json.loads(response.data)
        assert data["success"] == True
        assert data["notice"]["title"] == "Important Announcement"
        assert data["notice"]["priority"] == "high"

    def test_all_users_can_view_notices(self):
        """Test that all authenticated users can view notices"""
        self.login_as("admin")

        # Create a notice
        notice_data = {
            "title": "System Update",
            "content": "System will be updated tonight",
            "priority": "medium",
        }
        self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        # Test that regular user can see it
        self.login_as("user")
        response = self.client.get("/api/notices")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data["notices"]) == 1
        assert data["notices"][0]["title"] == "System Update"

    def test_editor_cannot_create_notices(self):
        """Test that editors cannot create notices (admin only)"""
        self.login_as("editor")

        notice_data = {
            "title": "Editor Notice",
            "content": "This should not be allowed",
        }

        response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        # Should be forbidden
        assert response.status_code == 403

    def test_notice_priorities(self):
        """Test notice priority levels"""
        self.login_as("admin")

        priorities = ["low", "medium", "high"]
        notices = []

        for priority in priorities:
            notice_data = {
                "title": f"{priority.title()} Priority Notice",
                "content": f"This is a {priority} priority notice",
                "priority": priority,
            }
            response = self.client.post(
                "/api/notices",
                data=json.dumps(notice_data),
                content_type="application/json",
            )
            notices.append(json.loads(response.data)["notice"])

        # Verify all priorities are stored correctly
        for i, notice in enumerate(notices):
            assert notice["priority"] == priorities[i]

    def test_notice_expiration(self):
        """Test notice expiration functionality"""
        self.login_as("admin")

        # Create notice with expiration
        future_date = (datetime.utcnow() + timedelta(days=7)).isoformat()
        notice_data = {
            "title": "Temporary Notice",
            "content": "This notice expires in 7 days",
            "priority": "medium",
            "expires_at": future_date,
        }

        self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )

        # Verify notice is visible
        get_response = self.client.get("/api/notices")
        data = json.loads(get_response.data)
        assert len(data["notices"]) == 1
        assert data["notices"][0]["expires_at"] is not None

    def test_notice_deletion_by_admin(self):
        """Test that admin can delete notices"""
        self.login_as("admin")

        # Create notice
        notice_data = {"title": "Test Notice", "content": "This will be deleted"}
        create_response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )
        notice_id = json.loads(create_response.data)["notice"]["id"]

        # Delete notice
        delete_response = self.client.delete(f"/api/notices/{notice_id}")
        assert delete_response.status_code == 200

        # Verify it's gone
        get_response = self.client.get("/api/notices")
        data = json.loads(get_response.data)
        assert len(data["notices"]) == 0

    def test_notice_board_empty_state(self):
        """Test notice board when no notices exist"""
        self.login_as("user")

        response = self.client.get("/api/notices")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "notices" in data
        assert len(data["notices"]) == 0

    def test_notice_content_validation(self):
        """Test notice content validation"""
        self.login_as("admin")

        # Test missing title
        invalid_data = {"content": "Notice without title"}
        response = self.client.post(
            "/api/notices",
            data=json.dumps(invalid_data),
            content_type="application/json",
        )
        assert response.status_code == 400

        # Test missing content
        invalid_data2 = {"title": "Title without content"}
        response2 = self.client.post(
            "/api/notices",
            data=json.dumps(invalid_data2),
            content_type="application/json",
        )
        assert response2.status_code == 400

    def test_notice_update_by_creator(self):
        """Test that notice creator can update their notices"""
        self.login_as("admin")

        # Create notice
        notice_data = {"title": "Original Title", "content": "Original content"}
        create_response = self.client.post(
            "/api/notices",
            data=json.dumps(notice_data),
            content_type="application/json",
        )
        notice_id = json.loads(create_response.data)["notice"]["id"]

        # Update notice
        update_data = {"title": "Updated Title", "content": "Updated content"}
        update_response = self.client.put(
            f"/api/notices/{notice_id}",
            data=json.dumps(update_data),
            content_type="application/json",
        )

        assert update_response.status_code == 200
        data = json.loads(update_response.data)
        assert data["notice"]["title"] == "Updated Title"
