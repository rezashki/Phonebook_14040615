from flask import Blueprint, request, jsonify, session
from database import db
from models import User, Notice
from datetime import datetime

bp = Blueprint("notices", __name__, url_prefix="/api/notices")


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


@bp.route("", methods=["GET"])
@login_required
def get_notices():
    """Get active notices"""
    try:
        # Get active notices that haven't expired
        now = datetime.utcnow()
        notices = (
            Notice.query.filter(
                Notice.is_active == True,
                (Notice.expires_at.is_(None) | (Notice.expires_at > now)),
            )
            .order_by(Notice.created_at.desc())
            .all()
        )

        notices_data = []
        for notice in notices:
            creator = User.query.get(notice.created_by)
            notice_dict = notice.to_dict()
            notice_dict["created_by"] = (
                {"id": creator.id, "username": creator.username} if creator else None
            )
            notices_data.append(notice_dict)

        return jsonify({"notices": notices_data}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("", methods=["POST"])
@admin_required
def create_notice():
    """Create a new notice"""
    try:
        data = request.get_json()
        if not data or "title" not in data or "content" not in data:
            return (
                jsonify({"success": False, "error": "Title and content required"}),
                400,
            )

        title = data["title"]
        content = data["content"]
        priority = data.get("priority", "medium")
        expires_at_str = data.get("expires_at")

        expires_at = None
        if expires_at_str:
            try:
                expires_at = datetime.fromisoformat(
                    expires_at_str.replace("Z", "+00:00")
                )
            except ValueError:
                return (
                    jsonify({"success": False, "error": "Invalid expires_at format"}),
                    400,
                )

        notice = Notice(
            title=title,
            content=content,
            priority=priority,
            expires_at=expires_at,
            created_by=session["user_id"],
        )

        db.session.add(notice)
        db.session.commit()

        return jsonify({"success": True, "notice": notice.to_dict()}), 201
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:notice_id>", methods=["PUT"])
@login_required
def update_notice(notice_id):
    """Update a notice"""
    try:
        notice = Notice.query.get_or_404(notice_id)

        # Check permissions: admin or creator
        if session.get("role") != "admin" and notice.created_by != session["user_id"]:
            return jsonify({"success": False, "error": "Permission denied"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        if "title" in data:
            notice.title = data["title"]
        if "content" in data:
            notice.content = data["content"]
        if "priority" in data:
            notice.priority = data["priority"]
        if "expires_at" in data:
            if data["expires_at"]:
                try:
                    notice.expires_at = datetime.fromisoformat(
                        data["expires_at"].replace("Z", "+00:00")
                    )
                except ValueError:
                    return (
                        jsonify(
                            {"success": False, "error": "Invalid expires_at format"}
                        ),
                        400,
                    )
            else:
                notice.expires_at = None

        db.session.commit()

        return jsonify({"success": True, "notice": notice.to_dict()}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:notice_id>", methods=["DELETE"])
@login_required
def delete_notice(notice_id):
    """Delete a notice"""
    try:
        notice = Notice.query.get_or_404(notice_id)

        # Check permissions: admin or creator
        if session.get("role") != "admin" and notice.created_by != session["user_id"]:
            return jsonify({"success": False, "error": "Permission denied"}), 403

        db.session.delete(notice)
        db.session.commit()

        return jsonify({"success": True, "message": "Notice deleted"}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500
