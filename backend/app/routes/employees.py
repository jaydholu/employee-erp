from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeOut
from app.services import employee_service
from app.core.security import require_admin, get_current_user
from app.models.user import User


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/", response_model=List[EmployeeOut])
def list_employees(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: list all employees."""
    return employee_service.get_all_employees(db)


@router.post("/", response_model=EmployeeOut, status_code=201)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Admin only: create a new employee + user account."""
    return employee_service.create_employee(db, employee)


@router.get("/me", response_model=EmployeeOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Employee: get own profile."""
    return employee_service.get_employee_by_user_id(db, current_user.id)


@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin or the employee themselves can view this."""
    emp = employee_service.get_employee_by_id(db, employee_id)
    if current_user.role != "admin" and emp.user_id != current_user.id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Access denied")
    return emp


@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only: update employee details."""
    return employee_service.update_employee(db, employee_id, payload)
