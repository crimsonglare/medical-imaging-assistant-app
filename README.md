# 🩺 Medical Imaging and Report Assistant

A full-stack clinical support tool for radiology, powered by AI and modern web technologies.  
This project enables clinicians, students, and researchers to upload medical images, receive AI-powered analyses, generate draft reports, and manage patient data—all in a secure, extensible platform.

---

## 🚀 Features

### ✅ Implemented

- **User Authentication**
  - JWT-based login and registration
  - Role-based access (student, instructor, admin)
- **Patient Management**
  - Add, view, and manage patient records
- **AI Image Analysis**
  - Upload images for AI-powered findings (classification)
  - Object detection overlays (bounding boxes) for general images
- **Annotation Viewer**
  - Visualize AI-generated bounding boxes on uploaded images
- **AI-Powered Report Generation**
  - Generate draft radiology reports using LLMs (OpenRouter API)
  - Reports incorporate AI findings and (soon) patient metadata
- **Report Management**
  - View generated reports in a user-friendly dialog
- **Modern UI/UX**
  - Built with React, Material UI, and react-konva for annotation
  - Responsive, clean dashboard for all workflows
- **Backend**
  - FastAPI with modular endpoints for patients, analyses, reports, and AI
  - PostgreSQL for robust, production-ready data storage

---

### 🛠️ In Progress / Planned

- **Enhanced Report Generation**
  - Pass patient name, age, and study type to LLM for more personalized reports
- **Report Saving & Review**
  - Store generated reports in the database and allow users to review/edit them
- **Literature-Backed (RAG) Reports**
  - Integrate retrieval-augmented generation (RAG) to cite relevant medical literature in reports
- **User Profile Management**
  - Edit profile, change password, manage roles
- **OAuth Login**
  - Google/GitHub login for easy access
- **Image Annotation Tools**
  - Allow users to draw/edit their own annotations
- **Medical-Specific Segmentation**
  - Integrate segmentation models for pixel-level overlays
- **Real-Time Collaboration**
  - WebSockets for collaborative review and notifications
- **Deployment**
  - Dockerized setup and cloud deployment instructions
- **Compliance & Security**
  - Data protection, audit logging, and educational use disclaimer

---

## 🧑‍💻 Tech Stack

- **Frontend:** React, Material UI, react-konva
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **AI/ML:** torchxrayvision, torchvision, OpenRouter (LLM API)
- **Authentication:** JWT (with planned OAuth)
- **Deployment:** Docker (planned), cloud-ready

---

## 📦 Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/medical-imaging-assistant.git
cd medical-imaging-assistant
```

### 2. **Backend Setup**
- Install Python dependencies:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
- Set up PostgreSQL and create a database (e.g., `nebula9`).
- Configure your `.env` file with your database URL and secrets.
- Initialize the database:
  ```bash
  python app/db/init_db.py
  ```
- Start the FastAPI server:
  ```bash
  uvicorn app.main:app --reload
  ```

### 3. **Frontend Setup**
- Install Node.js dependencies:
  ```bash
  cd ../frontend
  npm install
  ```
- Start the React development server:
  ```bash
  npm run dev
  ```

### 4. **AI/LLM Integration**
- The backend uses OpenRouter for LLM-powered report generation.  
  Set your OpenRouter API key in the backend code or as an environment variable.

---

## 🖼️ Usage

- Register and log in.
- Add new patients and upload medical images.
- Choose between “Medical Findings” (for clinical AI) and “Object Detection” (for general images).
- View AI-generated findings and bounding box overlays.
- Generate draft reports with a single click.
- (Soon) Save, edit, and review reports; see literature-backed explanations.

---

## 📝 Roadmap

- [ ] Pass patient info (name, age, study type) to LLM for personalized reports
- [ ] Save and review generated reports in the database
- [ ] Integrate RAG for literature-backed reporting
- [ ] Add user profile management and OAuth login
- [ ] Enable user annotation tools and medical segmentation overlays
- [ ] Real-time collaboration and notifications
- [ ] Dockerize and provide cloud deployment instructions
- [ ] Add compliance, audit logging, and educational disclaimer

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or pull requests for new features, bug fixes, or documentation improvements.

---

## 📄 License

This project is for educational and research purposes only.  
**Not for clinical use.**  
See [LICENSE](LICENSE) for details.

---

## 📚 Acknowledgments

- [torchxrayvision](https://github.com/mlmed/torchxrayvision)
- [OpenRouter](https://openrouter.ai/)
- [react-konva](https://konvajs.org/docs/react/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Material UI](https://mui.com/)

---

## 🌐 Live Demo

_Coming soon!_

---

## 🏥 Educational Use Disclaimer

This tool is intended for educational and research purposes only.  
It does not provide medical advice, diagnosis, or treatment.

---
