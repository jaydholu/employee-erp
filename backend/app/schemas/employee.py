from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from app.schemas.user import UserCreate, UserOut


class EmployeeBase(BaseModel):
    department: str
    position: str
    joining_date: date
    salary: Decimal


class EmployeeCreate(BaseModel):
    """Used by admin to create employee + user in one shot."""
    user: UserCreate
    employee: EmployeeBase


class EmployeeUpdate(BaseModel):
    department: str | None = None
    position: str | None = None
    joining_date: date | None = None
    salary: Decimal | None = None
    fullname: str | None = None
    email: str | None = None


class EmployeeOut(EmployeeBase):
    id: int
    user_id: int
    user: UserOut

    model_config = {"from_attributes": True}
