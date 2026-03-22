from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # APP
    APP_TITLE: str = "Employee ERP | COMPANY"
    APP_ENV: str = "development"
    APP_DESCRIPTION: str = "Employee ERP system for Company using FastAPI and React"
    APP_VERSION: str = "1.0.0"
    BASE_URL: str = "http://localhost:8000"

    # Admin
    ADMIN_FULLNAME: str = "Admin at Company"
    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@company.com"
    ADMIN_PASSWORD: SecretStr = "admin@company"

    # Database
    DATABASE_URL: str = "sqlite:///./database/employee_erp.db"

    # JWT
    JWT_SECRET_KEY: SecretStr = "use-strong-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
