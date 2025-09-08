from flask import Blueprint, request, jsonify, session
from database import db
from models import Company

bp = Blueprint("companies", __name__, url_prefix="/api/companies")


def login_required(f):
    """Decorator to require authentication"""

    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


@bp.route("", methods=["GET"])
@login_required
def get_companies():
    """Get all companies"""
    try:
        companies = Company.query.all()
        companies_data = [company.to_dict() for company in companies]
        return jsonify({"companies": companies_data}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("", methods=["POST"])
@login_required
def create_company():
    """Create a new company"""
    try:
        data = request.get_json()
        if not data or "name" not in data:
            return jsonify({"success": False, "error": "Name required"}), 400

        name = data["name"]
        industry = data.get("industry")
        website = data.get("website")
        email = data.get("email")
        phone = data.get("phone")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")
        zip_code = data.get("zip_code")
        country = data.get("country")
        description = data.get("description")

        company = Company(
            name=name,
            industry=industry,
            website=website,
            email=email,
            phone=phone,
            address=address,
            city=city,
            state=state,
            zip_code=zip_code,
            country=country,
            description=description,
            created_by=session["user_id"],
        )

        db.session.add(company)
        db.session.commit()

        return jsonify({"success": True, "company": company.to_dict()}), 201
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500
