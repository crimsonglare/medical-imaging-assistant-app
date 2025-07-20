from pydantic import BaseModel
from typing import Optional
from datetime import date

class PatientBase(BaseModel):
    name: str
    dob: Optional[date] = None
    gender: Optional[str] = None
    medical_record_number: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientRead(PatientBase):
    id: int

    class Config:
        orm_mode = True 