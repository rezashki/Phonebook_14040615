#!/usr/bin/env python3
"""Debug version of login endpoint to see what data is being sent"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from database import db
from models import User
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config["SECRET_KEY"] = "phonebook-dev-key-2024"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///phonebook.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/api/auth/login", methods=["POST"])
def debug_login():
    """Debug version of login to see what data is being sent"""
    print("\n=== DEBUG LOGIN ENDPOINT ===")
    print(f"Request method: {request.method}")
    print(f"Request URL: {request.url}")
    print(f"Request headers: {dict(request.headers)}")
    print(f"Content-Type: {request.content_type}")
    print(f"Raw data: {request.get_data()}")

    try:
        data = request.get_json()
        print(f"Parsed JSON data: {data}")
        print(f"Data type: {type(data)}")

        if data:
            print(f"Username in data: {'username' in data}")
            print(f"Password in data: {'password' in data}")
            if "username" in data:
                print(f"Username value: '{data['username']}'")
                print(f"Username type: {type(data['username'])}")
            if "password" in data:
                print(f"Password value: '{data['password']}'")
                print(f"Password type: {type(data['password'])}")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON"}), 400

    # Now try the actual login logic
    if not data or "username" not in data or "password" not in data:
        return (
            jsonify({"success": False, "error": "Username and password required"}),
            400,
        )

    username = data["username"]
    password = data["password"]

    print(f"Looking for user with username: '{username}'")

    with app.app_context():
        user = User.query.filter_by(username=username).first()
        print(f"Found user: {user}")

        if user:
            print(
                f"User details: ID={user.id}, Username={user.username}, Role={user.role}"
            )
            password_check = user.check_password(password)
            print(f"Password check result: {password_check}")

            if password_check and user.is_active:
                return (
                    jsonify({"success": True, "message": "Debug login successful"}),
                    200,
                )
            else:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Invalid credentials or inactive account",
                        }
                    ),
                    401,
                )
        else:
            print("No user found with that username")
            return jsonify({"success": False, "error": "User not found"}), 401


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)
