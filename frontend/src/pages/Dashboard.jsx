import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
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

  return (
    <Box maxWidth={800} mx="auto" mt={8} p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Patient Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add Patient
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Medical Record #</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Dashboard;