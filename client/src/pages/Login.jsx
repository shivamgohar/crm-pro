import { useState } from "react";
import axios from "axios";
// import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Link as RouterLink } from "react-router-dom";
import { brandConfig } from "../config/brandConfig";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  Stack,
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
      localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

console.log(response.data.user);

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
        bgcolor: "background.paper",
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
        <Typography variant="h3" fontWeight="bold" align="center">
          {brandConfig.companyName}
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={3}
        >
          CRM Management System
        </Typography>

        <Typography variant="h6" align="center" mb={1}>
          Welcome Back 👋
        </Typography>

        <Typography align="center" color="text.secondary" mb={3}>
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <FormControlLabel
            control={<Checkbox size="small" />}
            label="Remember Me"
          />

          <Link component={RouterLink} to="/forgot-password" underline="hover">
            Forgot Password?
          </Link>
        </Stack>

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

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register" underline="hover">
              Create Account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
