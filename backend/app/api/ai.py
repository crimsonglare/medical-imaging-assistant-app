from fastapi import APIRouter, UploadFile, File, Body
from fastapi.responses import JSONResponse
import base64

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/analyze-image")
def analyze_image(file: UploadFile = File(...)):
    findings = "No acute findings. Lungs are clear. Heart size is normal."
    blank_png = base64.b64encode(b"fake_png_data").decode()
    return JSONResponse({
        "findings": findings,
        "segmentation_mask": blank_png,
        "annotation": [
            {"label": "lung", "bbox": [50, 50, 200, 200]},
            {"label": "heart", "bbox": [120, 220, 180, 300]}
        ]
    })

@router.post("/generate-report")
def generate_report(
    patient_id: int = Body(...),
    findings: str = Body(None)
):
    # Stub: Generate a draft report using findings or a default
    report = f"Draft Report for Patient {patient_id}:\n"
    if findings:
        report += f"Findings: {findings}\n"
    else:
        report += "No acute findings. Lungs are clear. Heart size is normal.\n"
    report += "Impression: No evidence of pneumonia or mass."
    return {"report": report} 