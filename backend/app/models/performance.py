from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Performance(Base):
    __tablename__ = "performance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    communication = Column(Float, nullable=False)       # score 1–10
    technical_skill = Column(Float, nullable=False)     # score 1–10
    teamwork = Column(Float, nullable=False)            # score 1–10
    leadership = Column(Float, nullable=False)          # score 1–10
    overall_score = Column(Float, nullable=False)       # computed or manually set
    review_date = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="performance_reviews")
