from pydantic import BaseModel, EmailStr, SecretStr


class AdminCreate(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: SecretStr


class AdminUpdate(BaseModel):
    fullname: str | None
    username: str | None
    email: EmailStr | None
    password: SecretStr | None


class AdminOut(BaseModel):
    id: int
    fullname: str
    username: str
    email: str
    role: str

    model_config = {"from_attributes": True}
