import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import { DeleteSweep, ArrowBack } from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

function CleanImportedData() {
  const navigate = useNavigate();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [cleanupToken, setCleanupToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  return (
    <Box>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Data Management",
            path: "/settings/data-management",
          },
          {
            label: "Clean Imported Data",
          },
        ]}
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && !passwordDialogOpen && !confirmDialogOpen && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Typography variant="h4" fontWeight={700} mb={3}>
        Clean Imported Data
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <DeleteSweep fontSize="large" />

            <Typography variant="h6">Remove Imported Customer Data</Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            This action will remove previously imported customer data from the
            CRM. This action will require password verification.
          </Alert>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Use this option when you need to clear old imported data before
            performing a fresh customer import.
          </Typography>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/settings/data-management")}
            >
              Back
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
                setPassword("");
                setPasswordDialogOpen(true);
              }}
            >
              Clean Imported Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Password Dialog */}

      <Dialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setPassword("");
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Verify Password</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter your password to continue with this protected action.
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setPasswordDialogOpen(false);
              setPassword("");
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={!password || verifyingPassword}
            onClick={async () => {
              try {
                setVerifyingPassword(true);
                setErrorMessage("");
                setSuccessMessage("");

                const token = localStorage.getItem("token");

                if (!token) {
                  setErrorMessage("Session expired. Please login again.");
                  return;
                }

                const response = await api.post(
                  "/protected-actions/verify-password",
                  {
                    password,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                console.log("Password verification response:", response.data);

                if (response.data.success) {
                  setCleanupToken(response.data.cleanupToken);

                  setSuccessMessage("Password verified successfully.");

                  setPassword("");

                  setTimeout(() => {
                    setPasswordDialogOpen(false);
                    setSuccessMessage("");
                    setConfirmDialogOpen(true);
                  }, 500);
                } else {
                  setErrorMessage(
                    response.data.message || "Password verification failed",
                  );
                }
              } catch (error) {
                console.error("Password verification error:", error);

                setErrorMessage(
                  error.response?.data?.message ||
                    "Password verification failed",
                );
              } finally {
                setVerifyingPassword(false);
              }
            }}
          >
            {verifyingPassword ? "Verifying..." : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Data Cleanup</DialogTitle>

        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action will permanently remove imported customer data.
          </Alert>

          <Typography variant="body2">
            Are you sure you want to continue? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteSweep />}
            disabled={cleanupLoading}
            onClick={async () => {
              try {
                setCleanupLoading(true);
                setErrorMessage("");
                setSuccessMessage("");

                if (!cleanupToken) {
                  setErrorMessage(
                    "Cleanup authorization is missing. Please verify your password again.",
                  );
                  return;
                }

                const response = await api.post(
                  "/protected-actions/cleanup-imported-data",
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${cleanupToken}`,
                    },
                  },
                );

                console.log("Cleanup response:", response.data);

                if (response.data.success) {
                  setConfirmDialogOpen(false);
                  setCleanupToken("");

                  setSuccessMessage(
                    `Cleanup completed. ${response.data.deletedCustomers} imported customers deleted. ${response.data.skippedCustomersWithOrders} customer(s) with orders were preserved.`,
                  );
                } else {
                  setErrorMessage(response.data.message || "Cleanup failed");
                }
              } catch (error) {
                console.error("Cleanup error:", error);

                setErrorMessage(
                  error.response?.data?.message || "Cleanup failed",
                );
              } finally {
                setCleanupLoading(false);
              }
            }}
          >
            {cleanupLoading ? "Cleaning..." : "Yes, Clean Data"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CleanImportedData;
