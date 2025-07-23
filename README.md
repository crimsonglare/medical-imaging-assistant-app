# 🩺 Medical Imaging and Report Assistant

A full-stack clinical support tool for radiology, powered by AI and modern web technologies. This project enables clinicians, students, and researchers to upload medical images, receive AI-powered analyses, generate draft reports, and manage patient data—all in a secure, extensible platform.

---

## 🚀 Features

### ✅ Fully Implemented

* **User Authentication**

  * JWT-based login and registration
  * GitHub OAuth login (fully integrated, frontend and backend)
  * Role-based access (student, instructor, admin)
* **Patient Management**

  * Add, view, and manage patient records
* **AI Image Analysis**

  * Upload images for AI-powered findings using TorchXRayVision (medical-specific)
  * General object detection with torchvision (bounding boxes)
* **Annotation Viewer**

  * Visualize AI-generated bounding boxes on uploaded images
* **AI-Powered Report Generation**

  * Generate draft radiology reports using OpenRouter API (LLM-based)
* **Report Management**

  * View previously generated reports
* **Modern UI/UX**

  * React dashboard with Material UI, react-konva, and clean, responsive design
  * GitHub OAuth login button and automatic token handling in frontend
* **Backend**

  * FastAPI with endpoints for auth, patients, analysis, reports
  * PostgreSQL for production-ready storage (SQLite fallback)
  * SQLAlchemy ORM and Pydantic schemas

---

### 🛠️ In Progress / Planned

* [ ] Include patient metadata (name, age, study type) in LLM reports
* [ ] Save & edit generated reports in DB
* [ ] Retrieval-Augmented Generation (RAG) for literature-backed reporting
* [ ] Profile settings and OAuth (Google)
* [ ] User-generated annotation tools
* [ ] Segmentation models for pixel-level overlays
* [ ] Real-time collaboration via WebSocket
* [ ] Docker + Deployment guide
* [ ] Security & compliance features

---

## 🧑‍💻 Tech Stack

* **Frontend:** React, Material UI, React Router, React Konva
* **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic, PostgreSQL
* **AI/ML:** TorchXRayVision, torchvision, OpenRouter API (LLM)
* **Authentication:** JWT, GitHub OAuth
* **DevOps/Deployment:** Docker (planned), cloud-ready architecture

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/crimsonglare/medical-imaging-assistant-app.git
cd medical-imaging-assistant-app
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate (Linux/macOS)
pip install -r requirements.txt
```

#### Setup PostgreSQL Database

* Create a PostgreSQL DB named `nebula9` (or use SQLite for dev)
* Create `.env` file:

```ini
DATABASE_URL=postgresql://username:password@localhost/nebula9
JWT_SECRET_KEY=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### Initialize Database

```bash
python app/db/init_db.py
```

#### Run FastAPI server

```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

#### Setup GitHub OAuth

* In `backend/app/core/oauth.py`, set:
  * `GITHUB_CLIENT_ID = "your_client_id"`
  * `GITHUB_CLIENT_SECRET = "your_client_secret"`

---

## 🔧 OpenRouter API Setup

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign in and go to API keys section
3. Generate a key
4. Paste it into your backend `.env` as `OPENROUTER_API_KEY`

The API will be used to generate LLM-powered draft reports.

---

## 🖼️ Usage Flow

1. Register and log in (or use GitHub OAuth)
2. Add a new patient
3. Upload a medical image
4. Choose between:

   * "Medical Findings" (uses TorchXRayVision)
   * "Object Detection" (uses torchvision)
5. View AI analysis (including annotated image)
6. Generate draft report using OpenRouter
7. (Soon) Save, edit, and review reports

---

## 📅 Roadmap

* [x] GitHub OAuth login
* [ ] Include metadata in LLM prompt
* [ ] Store and edit reports in database
* [ ] Add RAG-based literature citations
* [ ] OAuth login
* [ ] Segmentation overlays
* [ ] Drawing tools for annotations
* [ ] Docker & deployment scripts
* [ ] Realtime WebSocket updates

---

## 👥 Contributing

Contributions are welcome. Please open issues or PRs for bugs, features, or documentation improvements.

---

## 📄 License

This tool is provided for educational and research use only. **Not for clinical use.**
See [LICENSE](LICENSE) for more.

---

## 📖 Acknowledgments

* [TorchXRayVision](https://github.com/mlmed/torchxrayvision)
* [OpenRouter](https://openrouter.ai/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [Material UI](https://mui.com/)
* [React Konva](https://konvajs.org/docs/react/)

---

## 🌐 Live Demo

*Coming soon*

---

## 🏥 Educational Use Disclaimer

This tool is intended for educational and research purposes only. It does not provide medical advice, diagnosis, or treatment.

---

## 📂 GitHub Repository

All source code, documentation, and setup instructions are available in this repo:
**[https://github.com/crimsonglare/medical-imaging-assistant-app](https://github.com/crimsonglare/medical-imaging-assistant-app)**
