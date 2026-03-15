from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

from app.models.user import User
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.core.security import hash_password


def get_all_employees(db: Session):
    return (
        db.query(Employee)
        .options(joinedload(Employee.user))
        .all()
    )


def get_employee_by_id(db: Session, employee_id: int):
    emp = (
        db.query(Employee)
        .options(joinedload(Employee.user))
        .filter(Employee.id == employee_id)
        .first()
    )
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


def get_employee_by_user_id(db: Session, user_id: int):
    emp = (
        db.query(Employee)
        .options(joinedload(Employee.user))
        .filter(Employee.user_id == user_id)
        .first()
    )
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


def create_employee(db: Session, payload: EmployeeCreate):
    # Check uniqueness
    if db.query(User).filter(User.username == payload.user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == payload.user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        fullname=payload.user.fullname,
        username=payload.user.username,
        email=payload.user.email,
        password_hash=hash_password(payload.user.password),
        role=payload.user.role,
    )
    db.add(user)
    db.flush()  # get user.id before commit

    employee = Employee(
        user_id=user.id,
        department=payload.employee.department,
        position=payload.employee.position,
        joining_date=payload.employee.joining_date,
        salary=payload.employee.salary,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    db.refresh(user)
    return employee


def update_employee(db: Session, employee_id: int, payload: EmployeeUpdate):
    emp = get_employee_by_id(db, employee_id)

    if payload.department is not None:
        emp.department = payload.department
    if payload.position is not None:
        emp.position = payload.position
    if payload.joining_date is not None:
        emp.joining_date = payload.joining_date
    if payload.salary is not None:
        emp.salary = payload.salary
    if payload.fullname is not None:
        emp.user.fullname = payload.fullname
    if payload.email is not None:
        emp.user.email = payload.email

    db.commit()
    db.refresh(emp)
    return emp
