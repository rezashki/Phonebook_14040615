from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from database import db

# Import models to ensure they're registered with SQLAlchemy
import models


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    # Configuration
    if test_config is None:
        app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///phonebook.db"
    else:
        app.config.update(test_config)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # Import and register blueprints
    try:
        from routes import auth, contacts, companies, notices, users

        app.register_blueprint(auth.bp)
        app.register_blueprint(contacts.bp)
        app.register_blueprint(companies.bp)
        app.register_blueprint(notices.bp)
        app.register_blueprint(users.bp)
    except ImportError:
        # Routes not implemented yet
        pass

    # Get the directory where static files are located
    static_dir = os.path.join(os.path.dirname(__file__), "static")

    # Serve React frontend
    @app.route("/")
    def serve_frontend():
        return send_from_directory(static_dir, "index.html")

    @app.route("/<path:path>")
    def serve_static(path):
        # Try to serve the file from static directory
        file_path = os.path.join(static_dir, path)
        if os.path.exists(file_path):
            return send_from_directory(static_dir, path)
        # If file doesn't exist, serve the React app (for client-side routing)
        return send_from_directory(static_dir, "index.html")

    # Create database tables
    with app.app_context():
        db.create_all()

        # Create default admin user if none exists
        from models import User

        if not User.query.filter_by(role="admin").first():
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
            print("Created default admin user: admin / admin123")

    return app


# Create app instance for development
app_instance = create_app()

if __name__ == "__main__":
    print("Starting Phonebook application...")
    print("Server will be available at: http://127.0.0.1:5000")
    try:
        print("About to start Flask server...")
        app_instance.run(debug=True, host="127.0.0.1", port=5000, threaded=True)
    except OSError as e:
        if "Address already in use" in str(e):
            print("Port 5000 is already in use. Trying port 5001...")
            app_instance.run(debug=True, host="127.0.0.1", port=5001, threaded=True)
        else:
            print(f"Error starting server: {e}")
            input("Press Enter to exit...")
    except Exception as e:
        print(f"Unexpected error: {e}")
        input("Press Enter to exit...")
