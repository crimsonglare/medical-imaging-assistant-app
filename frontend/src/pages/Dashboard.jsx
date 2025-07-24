import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Text as KonvaText, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    medical_record_number: ""
  });
  const navigate = useNavigate();

  // New state for AI analysis
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const fileInputRef = useRef();
  const [aiMode, setAiMode] = useState("findings"); // "findings" or "detection"

  // New state for patient analyses
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analysesOpen, setAnalysesOpen] = useState(false);
  const [analyses, setAnalyses] = useState([]);

  const [reportOpen, setReportOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportPatient, setReportPatient] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patients. Please make sure you are logged in.");
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", dob: "", gender: "", medical_record_number: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/patients/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleClose();
      fetchPatients();
    } catch (err) {
      setError("Failed to add patient. Please check your input.");
    }
  };

  const handleAiOpen = () => setAiOpen(true);
  const handleAiClose = () => {
    setAiOpen(false);
    setAiResult(null);
    setAiError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAiAnalyze = async (e) => {
    e.preventDefault();
    setAiError("");
    setAiResult(null);
    const file = fileInputRef.current.files[0];
    if (!file) {
      setAiError("Please select an image.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      let response;
      if (aiMode === "detection") {
        const token = localStorage.getItem("token");
        response = await axios.post(
          "http://localhost:8000/api/ai/detect-objects",
          formData,
          { 
            headers: { 
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        response = await axios.post(
        "http://localhost:8000/api/ai/analyze-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      }
      setAiResult(response.data);
      // Save analysis to backend only for findings mode
      if (aiMode === "findings") {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/analyses/",
        {
          patient_id: selectedPatient.id,
          findings: response.data.findings,
          annotation: JSON.stringify(response.data.annotation),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      }
    } catch (err) {
      setAiError("AI analysis failed.");
    }
  };

  const handleShowAnalyses = async (patientId) => {
    setAnalysesOpen(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/analyses/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalyses(response.data);
    } catch {
      setAnalyses([]);
    }
  };

  const handleGenerateReport = async (patient) => {
    setReportPatient(patient);
    setReportOpen(true);
    setReportText("");
    setReportError("");
    setReportLoading(true);
    try {
      // Get the latest analysis for this patient (if available)
      let findings = "";
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/analyses/patient/${patient.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && response.data.length > 0) {
          // Use findings from the most recent analysis
          findings = response.data[0].findings;
        }
      } catch {}
      // Fallback if no findings
      if (!findings) findings = "No acute findings. Lungs are clear. Heart size is normal.";
      // Call the OpenRouter-powered backend endpoint
      const reportResponse = await axios.post(
        "http://localhost:8000/api/ai/generate-report",
        { patient_id: patient.id, findings },
        { headers: { "Content-Type": "application/json" } }
      );
      if (reportResponse.data && reportResponse.data.report) {
        setReportText(reportResponse.data.report);
        // This is a new report, so we don't have an ID yet.
        // We will create it when the user saves.
        setCurrentReport({ patient_id: patient.id, content: reportResponse.data.report });
      } else {
        setReportError("Failed to generate report.");
      }
    } catch (err) {
      setReportError("Failed to generate report.");
    }
    setReportLoading(false);
  };

  const handleSaveReport = async () => {
    if (!currentReport) return;
    const token = localStorage.getItem("token");
    try {
      if (currentReport.id) {
        // Update existing report
        await axios.put(
          `http://localhost:8000/api/reports/${currentReport.id}`,
          { ...currentReport, content: reportText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new report
        const response = await axios.post(
          "http://localhost:8000/api/reports/",
          {
            patient_id: reportPatient.id,
            content: reportText,
            // author_id will be set by the backend based on the token
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentReport(response.data);
      }
      setReportOpen(false);
    } catch (err) {
      setReportError("Failed to save report.");
    }
  };

  // Helper to parse findings string to object
  function parseFindings(findingsStr) {
    try {
      // Try to parse as JSON first
      return typeof findingsStr === "object" ? findingsStr : JSON.parse(findingsStr.replace(/'/g, '"'));
    } catch {
      return {};
    }
  }

  // Helper component to display image with Konva and labels
  function AnnotatedImage({ imageUrl, annotations }) {
    const [image] = useImage(imageUrl);
    return (
      <Stage width={400} height={400}>
        <Layer>
          <KonvaImage image={image} width={400} height={400} />
          {annotations && annotations.map((ann, idx) => (
            <React.Fragment key={idx}>
              <Rect
                x={ann.bbox[0]}
                y={ann.bbox[1]}
                width={ann.bbox[2] - ann.bbox[0]}
                height={ann.bbox[3] - ann.bbox[1]}
                stroke="red"
                strokeWidth={2}
                dash={[4, 4]}
              />
              {ann.label && (
                <KonvaText
                  x={ann.bbox[0]}
                  y={ann.bbox[1] - 18}
                  text={ann.label}
                  fontSize={16}
                  fill="red"
                  fontStyle="bold"
                />
              )}
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={8} p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Patient Dashboard</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={() => navigate("/profile")} sx={{ mr: 2 }}>
            My Profile
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add Patient
      </Button>
      <Button variant="contained" color="secondary" onClick={handleAiOpen} sx={{ mb: 2, ml: 2 }}>
        Analyze Image (AI)
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <form id="add-patient-form" onSubmit={handleAddPatient}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Medical Record #"
              name="medical_record_number"
              value={form.medical_record_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="add-patient-form" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={aiOpen} onClose={handleAiClose}>
        <DialogTitle>Analyze Image (AI)</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Select
              value={aiMode}
              onChange={e => setAiMode(e.target.value)}
              size="small"
            >
              <MenuItem value="findings">Medical Findings</MenuItem>
              <MenuItem value="detection">Object Detection</MenuItem>
            </Select>
          </Box>
          <form id="ai-analyze-form" onSubmit={handleAiAnalyze}>
            <input type="file" accept="image/*" ref={fileInputRef} />
          </form>
          {aiError && <Alert severity="error">{aiError}</Alert>}
          {aiResult && (
            <Box mt={2}>
              <Typography variant="subtitle1">Findings:</Typography>
              {/* Parse findings string to object if needed (for findings mode) */}
              {aiMode === "findings" ? (() => {
                let findingsObj = {};
                try {
                  findingsObj = typeof aiResult.findings === "string"
                    ? JSON.parse(aiResult.findings.replace(/'/g, '"'))
                    : aiResult.findings;
                } catch {
                  findingsObj = {};
                }
                const sortedFindings = Object.entries(findingsObj).sort((a, b) => b[1] - a[1]);
                return (
                  <Table size="small" sx={{ maxWidth: 350, mb: 2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pathology</TableCell>
                        <TableCell align="right">Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedFindings.map(([label, value]) => (
                        <TableRow key={label} sx={{ backgroundColor: value > 0.5 ? '#e8f5e9' : undefined }}>
                          <TableCell>{label}</TableCell>
                          <TableCell align="right" sx={{ color: value > 0.5 ? 'green' : undefined }}>
                            {value.toFixed(3)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              })() : (
              <Typography>{aiResult.findings}</Typography>
              )}
              <Typography variant="subtitle1" mt={2}>Annotations:</Typography>
              {/* Display annotated image if available */}
              {fileInputRef.current && fileInputRef.current.files[0] && (
                <AnnotatedImage
                  imageUrl={URL.createObjectURL(fileInputRef.current.files[0])}
                  annotations={aiResult.annotation}
                />
              )}
              {/* Fallback: show annotation JSON */}
              {!fileInputRef.current || !fileInputRef.current.files[0] ? (
              <pre>{JSON.stringify(aiResult.annotation, null, 2)}</pre>
              ) : null}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAiClose}>Close</Button>
          <Button type="submit" form="ai-analyze-form" variant="contained">
            Analyze
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={analysesOpen} onClose={() => setAnalysesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI Analyses</DialogTitle>
        <DialogContent>
          {analyses.length === 0 ? (
            <Typography>No analyses found for this patient.</Typography>
          ) : (
            analyses.map((a) => (
              <Box key={a.id} mb={2} p={2} border={1} borderRadius={2}>
                <Typography variant="subtitle2">Date: {new Date(a.created_at).toLocaleString()}</Typography>
                <Typography variant="body1">Findings: {a.findings}</Typography>
                <Typography variant="body2">Annotation: {a.annotation}</Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Draft Report {reportPatient && `for ${reportPatient.name}`}
        </DialogTitle>
        <DialogContent>
          {reportLoading ? (
            <Typography>Generating report...</Typography>
          ) : reportError ? (
            <Alert severity="error">{reportError}</Alert>
          ) : (
            <ReactQuill
              theme="snow"
              value={reportText}
              onChange={setReportText}
              style={{ minHeight: '300px' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportOpen(false)}>Close</Button>
          <Button onClick={handleSaveReport} variant="contained">Save Report</Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Medical Record #</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.dob || "-"}</TableCell>
                <TableCell>{patient.gender || "-"}</TableCell>
                <TableCell>{patient.medical_record_number || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setAiOpen(true);
                    }}
                  >
                    Analyze Image
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => handleShowAnalyses(patient.id)}
                  >
                    View Analyses
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ ml: 1 }}
                    onClick={() => handleGenerateReport(patient)}
                  >
                    Generate Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

  export default Dashboard;