import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <Box
      maxWidth={400}
      mx="auto"
      mt={8}
      p={4}
      boxShadow={3}
      borderRadius={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h5" mb={2}>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
      <Button
        color="secondary"
        onClick={() => navigate("/register")}
        sx={{ mt: 2 }}
      >
        Don't have an account? Register
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => window.location.href = "http://localhost:8000/api/auth/github/login"}
        sx={{ mt: 2 }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
}

export default Login;