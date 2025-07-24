import { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // FastAPI expects "username" and "password" as form fields
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/api/auth/token",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      // Save token to localStorage
      localStorage.setItem("token", response.data.access_token);
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4
        }}
      >
        <LocalHospitalIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => window.location.href = "http://localhost:8000/api/auth/github/login"}
            sx={{ mb: 2 }}
          >
            Sign In with GitHub
          </Button>
          <Button
            fullWidth
            onClick={() => navigate("/register")}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;