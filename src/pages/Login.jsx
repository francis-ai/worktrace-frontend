import React, { useState, useContext } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (err) {
      setSnackbarMessage("Invalid credentials");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          MyWorkTrace Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", fontSize: "16px" }}
          >
            Login
          </Button>
        </form>

        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
            <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
                elevation={6}
                variant="filled"
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>


        {/* <Typography sx={{ mt: 2 }} align="center" variant="body2">
          Don’t have an account? <span style={{ color: "#1976d2", cursor: "pointer" }}>Register</span>
        </Typography> */}
      </Paper>
    </Container>
  );
}
