import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Server Error");
      }
    }
  };

  return (
    <Box
    sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#f4f7fe",
  }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 5,
          borderRadius: 4,
        }}
      >
       <Typography
variant="h3"
fontWeight="bold"
align="center"
>

ACN GROUP

</Typography>

<Typography
variant="subtitle1"
align="center"
color="text.secondary"
mb={3}
>

CRM Management System

</Typography>

<Typography
variant="h6"
align="center"
mb={1}
>

Welcome Back 👋

</Typography>

<Typography
align="center"
color="text.secondary"
mb={3}
>

Sign in to continue

</Typography> 
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
