from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.patient import router as patient_router
from app.api.report import router as report_router
from app.api.ai import router as ai_router
from app.api.analysis import router as analysis_router
from app.core.oauth import oauth
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="YOUR_SECRET_KEY")

# CORS settings (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(report_router)
app.include_router(ai_router)
app.include_router(analysis_router)


@app.get("/")
def read_root():
    return {"message": "Medical Imaging and Report Assistant Backend is running."}