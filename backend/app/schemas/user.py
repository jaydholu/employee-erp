from pydantic import BaseModel, EmailStr
from app.models.user import RoleEnum


class UserBase(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    role: RoleEnum = RoleEnum.employee


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    model_config = {"from_attributes": True}


class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    fullname: str
