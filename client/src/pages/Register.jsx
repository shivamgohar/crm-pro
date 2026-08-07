import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Avatar,
  Alert
} from "@mui/material";

function Register() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleRegister = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/register",
      {
        fullName,
        mobile,
        email,
        password,
      }
    );

    alert(response.data.message);

    navigate("/login");

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
          width: 450,
          p: 5,
          borderRadius: 4,
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "primary.main",
              fontSize: 28,
            }}
          >
            A
          </Avatar>
        </Box>

        <Typography variant="h4" fontWeight="bold" align="center">
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

        <Typography variant="h6" align="center">
          Create Account
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={3}
        >
          Create your CRM account
        </Typography>

        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <TextField
          label="Mobile Number"
          fullWidth
          margin="normal"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <TextField
          label="Email Address"
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

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleRegister}
        >
          Create Account
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
            >
              Login
            </Link>
          </Typography>
        </Box>

        <Typography
          variant="caption"
          display="block"
          align="center"
          color="text.secondary"
          mt={4}
        >
          Version 1.0.0
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;