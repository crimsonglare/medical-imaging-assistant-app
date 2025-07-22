from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import torchxrayvision as xrv
import torch
import io
import numpy as np
import requests

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Load the model once at startup
model = xrv.models.DenseNet(weights="densenet121-res224-all")
model.eval()

# Load object detection model once at startup
import torchvision
import torchvision.transforms as T

detection_model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
detection_model.eval()

OPENROUTER_API_KEY = "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"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Read and preprocess the image
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("L")  # Grayscale
    img = img.resize((224, 224))
    img_np = np.array(img)
    img_tensor = torch.from_numpy(xrv.datasets.normalize(img_np, 255)).unsqueeze(0).unsqueeze(0).float()

    # Run inference
    with torch.no_grad():
        outputs = model(img_tensor)
        findings = {k: float(outputs[0, i]) for i, k in enumerate(model.pathologies)}

    # Return findings (no bounding boxes, just predictions)
    return JSONResponse({
        "findings": str(findings),
        "annotation": []  # No bounding boxes with this model
    })

@router.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    transform = T.Compose([T.ToTensor()])
    img_tensor = transform(img)
    with torch.no_grad():
        outputs = detection_model([img_tensor])[0]
    boxes = outputs['boxes'].cpu().numpy()
    scores = outputs['scores'].cpu().numpy()
    labels = outputs['labels'].cpu().numpy()
    annotations = []
    for box, score, label in zip(boxes, scores, labels):
        if score > 0.5:
            annotations.append({
                "label": str(label),
                "bbox": [float(box[0]), float(box[1]), float(box[2]), float(box[3])],
                "score": float(score)
            })
    return JSONResponse({
        "findings": f"Detected {len(annotations)} objects.",
        "annotation": annotations
    })

@router.post("/generate-report")
def generate_report(patient_id: int = None, findings: str = None):
    # Compose the prompt for the LLM
    prompt = f"""
You are a clinical radiology assistant. Given the following AI findings for a patient, generate a concise, professional draft radiology report. Use standard medical terminology and structure.

Findings: {findings}

Draft Report:
"""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "mistralai/mistral-7b-instruct",  # You can change to another available model
        "messages": [
            {"role": "system", "content": "You are a helpful medical report assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512
    }
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        report = result["choices"][0]["message"]["content"]
        return {"report": report}
    except Exception as e:
        return {"error": str(e)}