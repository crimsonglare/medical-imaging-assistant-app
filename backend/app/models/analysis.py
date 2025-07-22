from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    findings = Column(Text, nullable=True)
    annotation = Column(Text, nullable=True)  # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient")
