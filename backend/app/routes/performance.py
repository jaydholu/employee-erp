from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.performance import PerformanceCreate, PerformanceOut
from app.services import performance_service
from app.core.security import require_admin, get_current_user
from app.models.user import User


router = APIRouter(prefix="/performance", tags=["Performance"])


@router.get("/{employee_id}", response_model=List[PerformanceOut])
def get_performance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin or the employee themselves can view performance reviews."""
    if current_user.role != "admin":
        # employees can only see their own reviews
        from app.services.employee_service import get_employee_by_user_id
        emp = get_employee_by_user_id(db, current_user.id)
        if emp.id != employee_id:
            from fastapi import HTTPException
            raise HTTPException(status_code=403, detail="Access denied")
    return performance_service.get_performance_by_employee(db, employee_id)


@router.post("/", response_model=PerformanceOut, status_code=201)
def create_review(
    payload: PerformanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: add a performance review for an employee."""
    return performance_service.create_performance_review(db, payload)
