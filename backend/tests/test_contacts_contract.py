import json
from app import create_app, db


class TestContactsContract:
    """Test contacts endpoints according to contracts/contacts.md"""

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
                username="testuser", email="test@example.com", role="editor"
            )
            self.test_user.set_password("password123")
            db.session.add(self.test_user)
            db.session.commit()

    def login(self):
        """Helper to login and get session"""
        self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "testuser", "password": "password123"}),
            content_type="application/json",
        )

    def test_get_contacts_empty(self):
        """Test GET /api/contacts with no contacts"""
        self.login()
        response = self.client.get("/api/contacts")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "contacts" in data
        assert len(data["contacts"]) == 0

    def test_post_contacts_create(self):
        """Test POST /api/contacts to create a contact"""
        self.login()
        contact_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1-555-0123",
        }

        response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["success"] == True
        assert "contact" in data
        assert data["contact"]["first_name"] == "John"
        assert data["contact"]["last_name"] == "Doe"

    def test_get_contacts_after_create(self):
        """Test GET /api/contacts after creating contacts"""
        self.login()

        # Create a contact
        contact_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",
        }
        self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )

        # Get contacts
        response = self.client.get("/api/contacts")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data["contacts"]) == 1
        assert data["contacts"][0]["first_name"] == "Jane"

    def test_put_contacts_update(self):
        """Test PUT /api/contacts/{id} to update a contact"""
        self.login()

        # Create a contact
        contact_data = {
            "first_name": "Bob",
            "last_name": "Wilson",
            "email": "bob@example.com",
        }
        create_response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )
        contact_id = json.loads(create_response.data)["contact"]["id"]

        # Update the contact
        update_data = {"first_name": "Robert", "phone": "+1-555-9999"}
        response = self.client.put(
            f"/api/contacts/{contact_id}",
            data=json.dumps(update_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] == True
        assert data["contact"]["first_name"] == "Robert"
        assert data["contact"]["phone"] == "+1-555-9999"

    def test_delete_contacts(self):
        """Test DELETE /api/contacts/{id}"""
        self.login()

        # Create a contact
        contact_data = {
            "first_name": "Alice",
            "last_name": "Brown",
            "email": "alice@example.com",
        }
        create_response = self.client.post(
            "/api/contacts",
            data=json.dumps(contact_data),
            content_type="application/json",
        )
        contact_id = json.loads(create_response.data)["contact"]["id"]

        # Delete the contact
        response = self.client.delete(f"/api/contacts/{contact_id}")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] == True

        # Verify it's gone
        get_response = self.client.get("/api/contacts")
        data = json.loads(get_response.data)
        assert len(data["contacts"]) == 0
