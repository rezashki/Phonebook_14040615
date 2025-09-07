# Quickstart: Phone Book Feature

## Prerequisites
- Python 3.11+
- FastAPI
- PostgreSQL
- pytest

## Steps
1. Clone the repository and switch to the `001-phone-book` branch.
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn psycopg2 pytest
   ```
3. Set up PostgreSQL and create the database/schema for contacts.
4. Run the FastAPI application:
   ```bash
   uvicorn src.cli.main:app --reload
   ```
5. Run tests:
   ```bash
   pytest
   ```
6. Use the API endpoints defined in `contracts/openapi.yaml` to add, view, edit, delete, and search contacts.

## Notes
- Ensure the database connection string is configured in your environment or settings file.
- API documentation is available at `/docs` when the FastAPI app is running.

---
