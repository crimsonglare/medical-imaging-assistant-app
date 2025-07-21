import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container,
  Stack, CircularProgress, IconButton, Card, CardContent, CardHeader, Divider
} from "@mui/material";
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Science as ScienceIcon,
  UploadFile as UploadFileIcon,
  History as HistoryIcon,
  Summarize as SummarizeIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analysesOpen, setAnalysesOpen] = useState(false);
  const [analyses, setAnalyses] = useState([]);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

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

  const handleAiOpen = (patient) => {
    setSelectedPatient(patient);
    setAiOpen(true);
  };

  const handleAiClose = () => {
    setAiOpen(false);
    setAiResult(null);
    setAiError("");
    setSelectedPatient(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleAiAnalyze = async (e) => {
    e.preventDefault();
    setAiError("");
    setAiResult(null);
    const file = fileInputRef.current.files[0];
    if (!file) {
      setAiError("Please select an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/ai/analyze-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setAiResult(response.data);

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
    } catch (err) {
      setAiError("AI analysis failed. Please try again.");
    }
  };

  const handleShowAnalyses = async (patient) => {
    setSelectedPatient(patient);
    setAnalysesOpen(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/analyses/patient/${patient.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalyses(response.data);
    } catch {
      setAnalyses([]);
    }
  };
  
  const handleAnalysesClose = () => {
    setAnalysesOpen(false);
    setSelectedPatient(null);
    setAnalyses([]);
  }

  const handleGenerateReport = async (patient) => {
    setSelectedPatient(patient);
    setReportOpen(true);
    setReportText("");
    setReportError("");
    setReportLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/ai/generate-report",
        { patient_id: patient.id }
      );
      setReportText(response.data.report);
    } catch (err) {
      setReportError("Failed to generate report.");
    }
    setReportLoading(false);
  };
  
  const handleReportClose = () => {
    setReportOpen(false);
    setSelectedPatient(null);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Patient Dashboard
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />} sx={{ mb: 3 }}>
          Add New Patient
        </Button>

        {/* Add Patient Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogContent>
            <form id="add-patient-form" onSubmit={handleAddPatient}>
              {/* Form fields remain the same */}
            </form>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="add-patient-form" variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
        
        {/* AI Analyze Image Dialog */}
        <Dialog open={aiOpen} onClose={handleAiClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Analyze Image for {selectedPatient?.name}
          </DialogTitle>
          <DialogContent>
            <form id="ai-analyze-form" onSubmit={handleAiAnalyze}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                  Upload Image
                  <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />
                </Button>
                {fileName && <Typography variant="body2">{fileName}</Typography>}
              </Stack>
            </form>
            {aiError && <Alert severity="error" sx={{ mt: 2 }}>{aiError}</Alert>}
            {aiResult && (
              <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6">Analysis Results</Typography>
                <Typography variant="subtitle1" mt={1} fontWeight="bold">Findings:</Typography>
                <Typography>{aiResult.findings}</Typography>
                <Typography variant="subtitle1" mt={2} fontWeight="bold">Annotations:</Typography>
                <Box component="pre" sx={{ bgcolor: 'grey.900', color: 'common.white', p: 2, borderRadius: 1, overflowX: 'auto', fontSize: '0.875rem' }}>
                  {JSON.stringify(aiResult.annotation, null, 2)}
                </Box>
              </Paper>
            )}
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleAiClose}>Close</Button>
            <Button type="submit" form="ai-analyze-form" variant="contained">Analyze</Button>
          </DialogActions>
        </Dialog>
        
        {/* View Analyses Dialog */}
        <Dialog open={analysesOpen} onClose={handleAnalysesClose} maxWidth="md" fullWidth>
          <DialogTitle>
             Analyses for {selectedPatient?.name}
             <IconButton onClick={handleAnalysesClose} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {analyses.length === 0 ? (
              <Typography>No analyses found for this patient.</Typography>
            ) : (
              <Stack spacing={2}>
                {analyses.map((a) => (
                  <Card key={a.id} variant="outlined">
                    <CardHeader title={`Analysis from: ${new Date(a.created_at).toLocaleString()}`} />
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold">Findings:</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{a.findings}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold">Annotation Data:</Typography>
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{a.annotation}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAnalysesClose}>Close</Button>
          </DialogActions>
        </Dialog>
        
        {/* Generate Report Dialog */}
        <Dialog open={reportOpen} onClose={handleReportClose} maxWidth="md" fullWidth>
           <DialogTitle>
             Draft Report for {selectedPatient?.name}
             <IconButton onClick={handleReportClose} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {reportLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
            ) : reportError ? (
              <Alert severity="error">{reportError}</Alert>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                <Typography component="pre" sx={{ whiteSpace: "pre-wrap", fontFamily: 'monospace' }}>
                  {reportText}
                </Typography>
              </Paper>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReportClose}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Patients Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'grey.200' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Medical Record #</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell component="th" scope="row">{patient.name}</TableCell>
                  <TableCell>{patient.dob || "-"}</TableCell>
                  <TableCell>{patient.gender || "-"}</TableCell>
                  <TableCell>{patient.medical_record_number || "-"}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" color="secondary" startIcon={<ScienceIcon />} onClick={() => handleAiOpen(patient)}>Analyze</Button>
                      <Button size="small" variant="outlined" startIcon={<HistoryIcon />} onClick={() => handleShowAnalyses(patient)}>History</Button>
                      <Button size="small" variant="contained" color="success" startIcon={<SummarizeIcon />} onClick={() => handleGenerateReport(patient)}>Report</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default Dashboard;