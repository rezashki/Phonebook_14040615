#!/usr/bin/env python3
"""Check users in the packaged app's database"""

import sqlite3
import os

db_path = r"f:\Reza Shaki\Github Repos\Phonebook_14040615\dist\instance\phonebook.db"

print(f"Checking database: {db_path}")
print(f"Database exists: {os.path.exists(db_path)}")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if users table exists
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users';"
        )
        table_exists = cursor.fetchone()
        print(f"Users table exists: {table_exists is not None}")

        if table_exists:
            # Count users
            cursor.execute("SELECT COUNT(*) FROM users;")
            user_count = cursor.fetchone()[0]
            print(f"Total users: {user_count}")

            # List all users
            cursor.execute("SELECT id, username, email, role, is_active FROM users;")
            users = cursor.fetchall()
            print("\nAll users:")
            for user in users:
                print(
                    f"  ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Role: {user[3]}, Active: {user[4]}"
                )

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("Database file not found!")
