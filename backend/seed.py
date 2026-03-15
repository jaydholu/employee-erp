"""
Run once after migrations to create the default admin user.

    python seed.py

Credentials for default admin: admin / admin@hal
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
            fullname="Admin HAL",
            username="admin",
            email="admin@hal.com",
            password_hash=hash_password("admin@hal"),
            role=RoleEnum.admin
        )

        db.add(admin)
        db.commit()
        db.close()

        print("Admin created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
