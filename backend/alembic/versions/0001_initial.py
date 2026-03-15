"""Initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2024-01-01 00:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("fullname", sa.String(100), nullable=False),
        sa.Column("username", sa.String(50), unique=True, nullable=False),
        sa.Column("email", sa.String(100), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        # SQLite stores enums as plain strings
        sa.Column("role", sa.String(20), nullable=False, server_default="employee"),
    )

    op.create_table(
        "employees",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), unique=True, nullable=False),
        sa.Column("department", sa.String(100), nullable=False),
        sa.Column("position", sa.String(100), nullable=False),
        sa.Column("joining_date", sa.Date(), nullable=False),
        sa.Column("salary", sa.Numeric(12, 2), nullable=False),
    )

    op.create_table(
        "performance",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id"), nullable=False),
        sa.Column("communication", sa.Float(), nullable=False),
        sa.Column("technical_skill", sa.Float(), nullable=False),
        sa.Column("teamwork", sa.Float(), nullable=False),
        sa.Column("leadership", sa.Float(), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("review_date", sa.Date(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("performance")
    op.drop_table("employees")
    op.drop_table("users")
