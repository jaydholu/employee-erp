from pydantic import BaseModel, Field
from datetime import date


class PerformanceBase(BaseModel):
    communication: float = Field(..., ge=1, le=10)
    technical_skill: float = Field(..., ge=1, le=10)
    teamwork: float = Field(..., ge=1, le=10)
    leadership: float = Field(..., ge=1, le=10)
    review_date: date


class PerformanceCreate(PerformanceBase):
    employee_id: int


class PerformanceOut(PerformanceBase):
    id: int
    employee_id: int
    overall_score: float

    model_config = {"from_attributes": True}
