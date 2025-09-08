import json
from app import create_app, db


class TestContactCRUDIntegration:
    """Integration test for contact CRUD operations"""

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

    def test_admin_can_create_contact(self):
        """Test that admin can create contacts"""
        self.login_as("admin")

        contact_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1-555-0123",
            "company": "Example Corp",
        }

        response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )

        assert response.status_code in [200, 201]
        data = json.loads(response.data)
        assert data["success"] == True
        assert data["contact"]["first_name"] == "John"

    def test_editor_can_create_and_edit_own_contacts(self):
        """Test that editor can create and edit their own contacts"""
        self.login_as("editor")

        # Create contact
        contact_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",
        }

        create_response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )

        contact_id = json.loads(create_response.data)["contact"]["id"]

        # Update contact
        update_data = {"phone": "+1-555-0456", "notes": "Updated by editor"}

        update_response = self.client.put(
            f"/api/contacts/{contact_id}",
            data=json.dumps(update_data),
            content_type="application/json",
        )

        assert update_response.status_code == 200
        data = json.loads(update_response.data)
        assert data["contact"]["phone"] == "+1-555-0456"

    def test_user_can_view_contacts_but_not_create(self):
        """Test that regular user can view but not create contacts"""
        # First, have admin create a contact
        self.login_as("admin")
        contact_data = {
            "first_name": "Alice",
            "last_name": "Brown",
            "email": "alice@example.com",
        }
        self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )

        # Now login as regular user
        self.login_as("user")

        # Should be able to view contacts
        get_response = self.client.get("/api/contacts")
        assert get_response.status_code == 200
        data = json.loads(get_response.data)
        assert len(data["contacts"]) == 1

        # Should NOT be able to create contacts
        create_response = self.client.post(
            "/api/contacts",
            data=json.dumps({"first_name": "Bob", "last_name": "Wilson"}),
            content_type="application/json",
        )
        assert create_response.status_code == 403

    def test_contact_search_functionality(self):
        """Test contact search and filtering"""
        self.login_as("admin")

        # Create multiple contacts
        contacts = [
            {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123",
            },
            {
                "first_name": "Jane",
                "last_name": "Smith",
                "email": "jane.smith@example.com",
                "phone": "+1-555-0456",
            },
            {
                "first_name": "Bob",
                "last_name": "Johnson",
                "email": "bob.johnson@example.com",
                "phone": "+1-555-0789",
            },
        ]

        for contact in contacts:
            self.client.post(
                "/api/contacts",
                data=json.dumps(contact),
                content_type="application/json",
            )

        # Test search by name
        search_response = self.client.get("/api/contacts?search=john")
        assert search_response.status_code == 200
        data = json.loads(search_response.data)
        # Should find John Doe and Bob Johnson
        assert len(data["contacts"]) == 2

    def test_contact_pagination(self):
        """Test contact list pagination"""
        self.login_as("admin")

        # Create many contacts
        for i in range(25):
            contact_data = {
                "first_name": f"Contact{i}",
                "last_name": f"Person{i}",
                "email": f"contact{i}@example.com",
            }
            self.client.post(
                "/api/contacts",
                data=json.dumps(contact_data),
                content_type="application/json",
            )

        # Test pagination
        response = self.client.get("/api/contacts?page=1&per_page=10")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data["contacts"]) == 10
        assert data["pagination"]["total"] == 25
        assert data["pagination"]["pages"] == 3

    def test_contact_deletion_permissions(self):
        """Test contact deletion permissions"""
        self.login_as("admin")

        # Create contact
        contact_data = {
            "first_name": "Test",
            "last_name": "Contact",
            "email": "test@example.com",
        }
        create_response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )
        contact_id = json.loads(create_response.data)["contact"]["id"]

        # Admin should be able to delete
        delete_response = self.client.delete(f"/api/contacts/{contact_id}")
        assert delete_response.status_code == 200

        # Verify it's deleted
        get_response = self.client.get("/api/contacts")
        data = json.loads(get_response.data)
        assert len(data["contacts"]) == 0
