from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.analysis import AnalysisCreate, AnalysisRead
from app.models.analysis import Analysis
from app.core.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/analyses", tags=["analyses"])

@router.post("/", response_model=AnalysisRead)
def create_analysis(analysis_in: AnalysisCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = Analysis(**analysis_in.dict())
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/patient/{patient_id}", response_model=List[AnalysisRead])
def list_analyses_for_patient(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Analysis).filter(Analysis.patient_id == patient_id).all()
