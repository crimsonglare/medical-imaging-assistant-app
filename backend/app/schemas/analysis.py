from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AnalysisBase(BaseModel):
    findings: Optional[str] = None
    annotation: Optional[str] = None  # JSON string

class AnalysisCreate(AnalysisBase):
    patient_id: int

class AnalysisRead(AnalysisBase):
    id: int
    patient_id: int
    created_at: datetime

    class Config:
        orm_mode = True
