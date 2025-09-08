from flask import Blueprint, request, jsonify, session
from database import db
from models import User

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and create session"""
    try:
        # Debug logging
        print(f"\n=== LOGIN DEBUG ===")
        print(f"Request method: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"Raw data: {request.get_data()}")

        data = request.get_json()
        print(f"Parsed JSON data: {data}")

        if not data or "username" not in data or "password" not in data:
            print("Missing username or password in request")
            return (
                jsonify({"success": False, "error": "Username and password required"}),
                400,
            )

        username = data["username"]
        password = data["password"]

        print(f"Login attempt - Username: '{username}', Password: '{password}'")

        user = User.query.filter_by(username=username).first()
        print(f"User found: {user}")

        if user:
            password_check = user.check_password(password)
            print(f"Password check result: {password_check}")
            print(f"User active: {user.is_active}")

        if not user or not user.check_password(password):
            print("Invalid credentials - login failed")
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

        if not user.is_active:
            return jsonify({"success": False, "error": "Account is disabled"}), 401

        # Create session
        session["user_id"] = user.id
        session["username"] = user.username
        session["role"] = user.role

        return (
            jsonify(
                {"success": True, "user": user.to_dict(), "message": "Login successful"}
            ),
            200,
        )

    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/logout", methods=["POST"])
def logout():
    """Destroy user session"""
    try:
        session.clear()
        return jsonify({"success": True, "message": "Logout successful"}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/status", methods=["GET"])
def status():
    """Check authentication status"""
    try:
        if "user_id" in session:
            user = User.query.get(session["user_id"])
            if user and user.is_active:
                return jsonify({"success": True, "user": user.to_dict()}), 200

        return jsonify({"success": False}), 200
    except Exception:
        return jsonify({"success": False}), 500
