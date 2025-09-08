from flask import Blueprint, request, jsonify, session
from database import db
from models import Contact, Company
from sqlalchemy import or_

bp = Blueprint("contacts", __name__, url_prefix="/api/contacts")


def login_required(f):
    """Decorator to require authentication"""

    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def editor_or_admin_required(f):
    """Decorator to require editor or admin role"""

    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        if session.get("role") not in ["admin", "editor"]:
            return (
                jsonify({"success": False, "error": "Editor or admin access required"}),
                403,
            )
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


@bp.route("", methods=["GET"])
@login_required
def get_contacts():
    """Get contacts with filtering and pagination"""
    try:
        page = int(request.args.get("page", 1))
        per_page = min(int(request.args.get("per_page", 20)), 100)
        search = request.args.get("search", "")
        company_id = request.args.get("company_id")

        query = Contact.query

        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Contact.first_name.ilike(f"%{search}%"),
                    Contact.last_name.ilike(f"%{search}%"),
                    Contact.email.ilike(f"%{search}%"),
                )
            )

        # Apply company filter
        if company_id:
            query = query.filter(Contact.company_id == company_id)

        # Paginate
        contacts = query.paginate(page=page, per_page=per_page, error_out=False)

        contacts_data = []
        for contact in contacts.items:
            contact_dict = contact.to_dict()
            if contact.company_id:
                company = Company.query.get(contact.company_id)
                if company:
                    contact_dict["company"] = {"id": company.id, "name": company.name}
            contacts_data.append(contact_dict)

        return (
            jsonify(
                {
                    "contacts": contacts_data,
                    "pagination": {
                        "page": contacts.page,
                        "per_page": contacts.per_page,
                        "total": contacts.total,
                        "pages": contacts.pages,
                    },
                }
            ),
            200,
        )
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("", methods=["POST"])
@editor_or_admin_required
def create_contact():
    """Create a new contact"""
    try:
        data = request.get_json()
        if not data or "first_name" not in data or "last_name" not in data:
            return (
                jsonify(
                    {"success": False, "error": "First name and last name required"}
                ),
                400,
            )

        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data.get("email")
        phone = data.get("phone")
        mobile = data.get("mobile")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")
        zip_code = data.get("zip_code")
        country = data.get("country")
        company_id = data.get("company_id")
        notes = data.get("notes")

        # Validate company_id if provided
        if company_id and not Company.query.get(company_id):
            return jsonify({"success": False, "error": "Invalid company_id"}), 400

        contact = Contact(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            zip_code=zip_code,
            country=country,
            company_id=company_id,
            notes=notes,
            created_by=session["user_id"],
        )

        db.session.add(contact)
        db.session.commit()

        contact_dict = contact.to_dict()
        if contact.company_id:
            company = Company.query.get(contact.company_id)
            if company:
                contact_dict["company"] = {"id": company.id, "name": company.name}

        return jsonify({"success": True, "contact": contact_dict}), 201
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:contact_id>", methods=["PUT"])
@login_required
def update_contact(contact_id):
    """Update a contact"""
    try:
        contact = Contact.query.get_or_404(contact_id)

        # Check permissions: admin/editor or creator
        user_role = session.get("role")
        if (
            user_role not in ["admin", "editor"]
            and contact.created_by != session["user_id"]
        ):
            return jsonify({"success": False, "error": "Permission denied"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        if "first_name" in data:
            contact.first_name = data["first_name"]
        if "last_name" in data:
            contact.last_name = data["last_name"]
        if "email" in data:
            contact.email = data["email"]
        if "phone" in data:
            contact.phone = data["phone"]
        if "mobile" in data:
            contact.mobile = data["mobile"]
        if "address" in data:
            contact.address = data["address"]
        if "city" in data:
            contact.city = data["city"]
        if "state" in data:
            contact.state = data["state"]
        if "zip_code" in data:
            contact.zip_code = data["zip_code"]
        if "country" in data:
            contact.country = data["country"]
        if "company_id" in data:
            if data["company_id"] and not Company.query.get(data["company_id"]):
                return jsonify({"success": False, "error": "Invalid company_id"}), 400
            contact.company_id = data["company_id"]
        if "notes" in data:
            contact.notes = data["notes"]

        db.session.commit()

        contact_dict = contact.to_dict()
        if contact.company_id:
            company = Company.query.get(contact.company_id)
            if company:
                contact_dict["company"] = {"id": company.id, "name": company.name}

        return jsonify({"success": True, "contact": contact_dict}), 200
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500


@bp.route("/<int:contact_id>", methods=["DELETE"])
@login_required
def delete_contact(contact_id):
    """Delete a contact"""
    try:
        contact = Contact.query.get_or_404(contact_id)

        # Check permissions: admin/editor or creator
        user_role = session.get("role")
        if (
            user_role not in ["admin", "editor"]
            and contact.created_by != session["user_id"]
        ):
            return jsonify({"success": False, "error": "Permission denied"}), 403

        db.session.delete(contact)
        db.session.commit()

        return (
            jsonify({"success": True, "message": "Contact deleted successfully"}),
            200,
        )
    except Exception:
        return jsonify({"success": False, "error": "Server error"}), 500
