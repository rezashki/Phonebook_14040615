#!/usr/bin/env python3
"""Test script to simulate frontend login request to debug server"""

import requests
import json

# Test data
test_data = {"username": "admin", "password": "admin123"}

print("=== Testing login with debug server on port 5002 ===")
print(f"Sending data: {test_data}")

try:
    response = requests.post(
        "http://localhost:5002/api/auth/login",
        json=test_data,
        headers={"Content-Type": "application/json"},
    )

    print(f"Response status: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response data: {response.text}")

    if response.status_code == 200:
        print("✓ Login successful!")
    else:
        print("✗ Login failed!")

except Exception as e:
    print(f"Error: {e}")
