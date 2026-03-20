"""
Run once after migrations to create the default admin user.

    python seed.py

Credentials for default admin: admin / admin@company
"""


import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, RoleEnum


def seed():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == "admin").first()
        if existing:
            print("Admin already exists - skipping seed.")
            db.close()
            return

        admin = User(
            fullname="Admin - Company",
            username="admin",
            email="admin@company.com",
            password_hash=hash_password("admin@company"),
            role=RoleEnum.admin
        )

        db.add(admin)
        db.commit()
        db.close()

        print("Admin created successfully.\nUsername: admin  |  Password: admin@company")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
