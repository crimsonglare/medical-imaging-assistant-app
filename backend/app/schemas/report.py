from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    patient_id: int
    author_id: int
    content: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 