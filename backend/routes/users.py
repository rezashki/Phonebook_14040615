from flask import Blueprint, request, jsonify, session
from database import db
from models import User

bp = Blueprint("users", __name__, url_prefix="/api/users")


def login_required(f):
    """Decorator to require authentication"""

    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def admin_required(f):
    """Decorator to require admin role"""

    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        if session.get("role") != "admin":
            return jsonify({"success": False, "error": "Admin access required"}), 403
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


@bp.route("", methods=["POST"])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        if (
            not data
            or "username" not in data
            or "email" not in data
            or "password" not in data
        ):
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Username, email, and password required",
                    }
                ),
                400,
            )

        username = data["username"]
        email = data["email"]
        password = data["password"]
        role = data.get("role", "user")

        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            return jsonify({"success": False, "error": "Username already exists"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "error": "Email already exists"}), 400

        # Allow creating first admin without authentication
        if role == "admin":
            admin_count = User.query.filter_by(role="admin").count()
            if admin_count == 0:
                # First admin can be created without authentication
                pass
            elif "user_id" not in session or session.get("role") != "admin":
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Admin access required to create admin users",
                        }
                    ),
                    403,
                )
        else:
            # Regular users require admin authentication
            if "user_id" not in session or session.get("role") != "admin":
                return (
                    jsonify({"success": False, "error": "Admin access required"}),
                    403,
                )

        user = User(username=username, email=email, role=role)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return jsonify({"success": True, "user": user.to_dict()}), 201
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("", methods=["GET"])
@admin_required
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        users_data = [user.to_dict() for user in users]
        return jsonify({"users": users_data}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    """Update a user"""
    try:
        user = User.query.get_or_404(user_id)

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        if "username" in data:
            # Check if new username is taken
            existing = User.query.filter_by(username=data["username"]).first()
            if existing and existing.id != user_id:
                return (
                    jsonify({"success": False, "error": "Username already exists"}),
                    400,
                )
            user.username = data["username"]

        if "email" in data:
            # Check if new email is taken
            existing = User.query.filter_by(email=data["email"]).first()
            if existing and existing.id != user_id:
                return jsonify({"success": False, "error": "Email already exists"}), 400
            user.email = data["email"]

        if "password" in data:
            user.set_password(data["password"])

        if "role" in data:
            user.role = data["role"]

        if "is_active" in data:
            user.is_active = data["is_active"]

        db.session.commit()

        return jsonify({"success": True, "user": user.to_dict()}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    """Delete a user"""
    try:
        user = User.query.get_or_404(user_id)

        # Prevent deleting self
        if user.id == session["user_id"]:
            return (
                jsonify({"success": False, "error": "Cannot delete your own account"}),
                400,
            )

        db.session.delete(user)
        db.session.commit()

        return jsonify({"success": True, "message": "User deleted"}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500
