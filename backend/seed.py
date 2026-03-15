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
from app.core.settings import settings
from app.models.user import User, RoleEnum


def seed():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if existing:
            print("Admin already exists – skipping.")
            return

        admin = User(
            fullname=settings.ADMIN_FULLNAME,
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD.get_secret_value()),
            role=RoleEnum.admin,
        )
        db.add(admin)
        db.commit()
        print(f"✅  Admin created: username={settings.ADMIN_USERNAME} | email={settings.ADMIN_EMAIL} | password={settings.ADMIN_PASSWORD.get_secret_value()}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
