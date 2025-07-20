from sqlalchemy import Column, Integer, String, Date
from app.db.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    medical_record_number = Column(String, unique=True, index=True, nullable=True) 