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
  Alert,
  Box,
  Avatar,
  Fade,
  Zoom
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email,
  Lock,
  WorkOutline
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: theme.spacing(1.5),
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(90deg, #5a67d8 0%, #6b46a0 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
  },
  "&:active": {
    transform: "translateY(0)",
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 16px rgba(102, 126, 234, 0.15)",
    }
  }
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: "0 auto",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
  marginBottom: theme.spacing(2)
}));

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setSnackbarMessage("Welcome back! Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || "Invalid credentials");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecf5 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)",
          pointerEvents: "none"
        }
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <div>
            <StyledPaper elevation={3}>
              {/* Logo Section */}
              <Zoom in={true} timeout={800}>
                <Box textAlign="center" mb={3}>
                  <LogoAvatar>
                    <WorkOutline sx={{ fontSize: 40 }} />
                  </LogoAvatar>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    fontWeight="800"
                    sx={{
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px"
                    }}
                  >
                    MyWorkTrace
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome back! Please login to your account
                  </Typography>
                </Box>
              </Zoom>

              {/* Form Section */}
              <form onSubmit={handleLogin}>
                <StyledTextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your email"
                />

                <StyledTextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setShowPassword((prev) => !prev)} 
                          edge="end"
                          sx={{ color: "text.secondary" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your password"
                />

                {/* Forgot Password Link */}
                <Box textAlign="right" mt={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#667eea",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" }
                    }}
                    onClick={() => {/* Handle forgot password */}}
                  >
                    Forgot password?
                  </Typography>
                </Box>

                <GradientButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 3 }}
                  startIcon={<LoginIcon />}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </GradientButton>
              </form>
            </StyledPaper>

            {/* Footer */}
            <Box mt={4} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                © 2024 MyWorkTrace. All rights reserved.
              </Typography>
            </Box>
          </div>
        </Fade>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ 
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
            }}
            elevation={6}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}