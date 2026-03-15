from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.performance import Performance
from app.models.employee import Employee
from app.schemas.performance import PerformanceCreate


def get_performance_by_employee(db: Session, employee_id: int):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return (
        db.query(Performance)
        .filter(Performance.employee_id == employee_id)
        .order_by(Performance.review_date.desc())
        .all()
    )


def create_performance_review(db: Session, payload: PerformanceCreate):
    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    overall = round(
        (payload.communication + payload.technical_skill + payload.teamwork + payload.leadership) / 4,
        2,
    )

    review = Performance(
        employee_id=payload.employee_id,
        communication=payload.communication,
        technical_skill=payload.technical_skill,
        teamwork=payload.teamwork,
        leadership=payload.leadership,
        overall_score=overall,
        review_date=payload.review_date,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
