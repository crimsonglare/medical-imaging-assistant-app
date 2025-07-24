from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.report import ReportCreate, ReportRead, ReportUpdate
from app.models.report import Report
from app.core.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.post("/", response_model=ReportRead)
def create_report(report_in: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = Report(
        **report_in.dict(),
        author_id=current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/", response_model=List[ReportRead])
def list_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Report).offset(skip).limit(limit).all()

@router.get("/patient/{patient_id}", response_model=List[ReportRead])
def list_reports_for_patient(patient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Report).filter(Report.patient_id == patient_id).all()

@router.get("/{report_id}", response_model=ReportRead)
def get_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{report_id}", response_model=ReportRead)
def update_report(report_id: int, report_in: ReportUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Authorization check
    if report.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this report")

    update_data = report_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(report, key, value)

    db.commit()
    db.refresh(report)
    return report

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"ok": True} 