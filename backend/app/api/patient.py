from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.patient import PatientCreate, PatientRead
from app.models.patient import Patient
from app.core.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.post("/", response_model=PatientRead)
def create_patient(patient_in: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = Patient(**patient_in.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/", response_model=List[PatientRead])
def list_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Patient).offset(skip).limit(limit).all()

@router.get("/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientRead)
def update_patient(patient_id: int, patient_in: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, value in patient_in.dict().items():
        setattr(patient, key, value)
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"ok": True} 