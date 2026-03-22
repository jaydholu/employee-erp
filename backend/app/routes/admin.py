from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, require_admin, get_current_user
from app.models.user import User, RoleEnum
from app.schemas.admin import AdminCreate, AdminUpdate, AdminOut


router = APIRouter(prefix="/admin", tags=["Admin"])


# ── helpers ──────────────────────────────────────────────────────────────────
def _get_admin_or_404(db: Session, username: str) -> type[User]:
    """Return the User with the given username, 404 if not found or not admin."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found.")
    if user.role != RoleEnum.admin:
        raise HTTPException(status_code=400, detail=f"User '{username}' is not an admin.")
    if user.username == "admin":
        raise HTTPException(status_code=403, detail=f"User '{username}' cannot delete it's own account.")

    return user


# ── POST /admin/  — create a new admin ───────────────────────────────────────
@router.post("/", response_model=AdminOut, status_code=201)
def create_admin(
        payload: AdminCreate,
        db: Session = Depends(get_db),
        _: User = Depends(require_admin),
):
    """
    Create a new admin user.
    Requires an existing admin's JWT token.
    Only callable from CLI/script — there is no frontend page for this.
    """
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{payload.username}' already exists.",
        )
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{payload.email}' already registered.",
        )

    new_admin = User(
        fullname=payload.fullname,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password.get_secret_value()),
        role=RoleEnum.admin,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


# ── PUT /admin/edit/{username}  — update own or another admin's details ───────
@router.put("/edit/{username}", response_model=AdminOut)
def edit_admin(
        username: str,
        payload: AdminUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    """
    Update an admin's details (fullname, username, email, password).
    Rules:
      - Any admin can edit their OWN account.
      - Only an admin can edit ANOTHER admin's account.
      - Employees cannot call this endpoint at all.
    """
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin access required.")

    # You may only edit yourself or another admin account
    target = _get_admin_or_404(db, username)

    # Check uniqueness only when the value actually changes
    if payload.username and payload.username != target.username:
        if db.query(User).filter(User.username == payload.username).first():
            raise HTTPException(
                status_code=400,
                detail=f"Username '{payload.username}' is already taken.",
            )
    if payload.email and payload.email != target.email:
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(
                status_code=400,
                detail=f"Email '{payload.email}' is already registered.",
            )

    if payload.fullname is not None:
        target.fullname = payload.fullname
    if payload.username is not None:
        target.username = payload.username
    if payload.email is not None:
        target.email = payload.email
    if payload.password is not None:
        target.password_hash = hash_password(payload.password.get_secret_value())

    db.commit()
    db.refresh(target)

    return target


# ── DELETE /admin/delete/{username}  — remove an admin account ───────────────
@router.delete("/delete/{username}", status_code=200)
def delete_admin(
        username: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    """
    Delete an admin account by username.
    Rules:
      - An admin can delete THEMSELVES.
      - An admin can also delete another admin account.
      - The last remaining admin cannot be deleted (safety guard).
      - Employees cannot call this endpoint.
    """
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin access required.")

    target = _get_admin_or_404(db, username)

    # Safety: never allow deleting the very last admin
    admin_count = db.query(User).filter(User.role == RoleEnum.admin).count()
    if admin_count <= 1:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete the last remaining admin account.",
        )

    db.delete(target)
    db.commit()

    return {"message": f"Admin '{username}' has been deleted successfully."}
