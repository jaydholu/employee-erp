from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    joining_date = Column(Date, nullable=False)
    salary = Column(Numeric(12, 2), nullable=False)

    # Relationships
    user = relationship("User", back_populates="employee")
    performance_reviews = relationship("Performance", back_populates="employee")
