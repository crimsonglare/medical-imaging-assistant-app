from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    content: Optional[str] = None

class ReportCreate(ReportBase):
    patient_id: int

class ReportUpdate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 