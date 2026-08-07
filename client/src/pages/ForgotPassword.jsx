import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Avatar,
} from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState("");

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
          Forgot Password
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={3}
        >
          Enter your email address to reset your password.
        </Typography>

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          Send Reset Link
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Remember your password?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
            >
              Back to Login
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

export default ForgotPassword;