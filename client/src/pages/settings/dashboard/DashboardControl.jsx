import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  Divider,
  Button,
  Alert,
} from "@mui/material";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import SaveIcon from "@mui/icons-material/Save";

import AppBreadcrumb from "../../../components/ui/AppBreadcrumb";
import api from "../../../api/api";

import { dashboardWidgets } from "../../Dashboard/dashboardConfig";

function DashboardControl() {
  const [widgetSettings, setWidgetSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD SETTINGS FROM DATABASE
  // ==========================================

  const loadSettings = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        "/dashboard/widgets"
      );

      const settings = {};

      response.data.settings.forEach((item) => {
        settings[item.widget_id] = item.enabled;
      });

      setWidgetSettings(settings);

    } catch (error) {
      console.error(
        "Dashboard settings load error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to load dashboard settings."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadSettings();
  }, []);

  // ==========================================
  // TOGGLE
  // ==========================================

  const handleToggle = (widgetId) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }));
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      await api.put(
        "/dashboard/widgets",
        {
          settings: widgetSettings,
        }
      );

      setMessage(
        "Dashboard settings saved successfully."
      );

    } catch (error) {
      console.error(
        "Dashboard settings save error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to save dashboard settings."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Box>
        <Typography>
          Loading Dashboard Settings...
        </Typography>
      </Box>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box>

      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Dashboard Control",
          },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 1,
        }}
      >
        <DashboardCustomizeIcon />

        <Typography
          variant="h4"
          fontWeight={700}
        >
          Dashboard Control
        </Typography>
      </Box>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Choose which widgets should appear on the
        company dashboard.
      </Typography>

      {message && (
        <Alert
          severity={
            message.includes("successfully")
              ? "success"
              : "error"
          }
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Alert
        severity="info"
        sx={{ mb: 3 }}
      >
        Disabled widgets will not appear on the
        Dashboard.
      </Alert>

      <Card>
        <CardContent sx={{ p: 0 }}>

          {dashboardWidgets.map(
            (widget, index) => (
              <Box key={widget.id}>

                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <Box>
                    <Typography
                      fontWeight={600}
                    >
                      {widget.label}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {widget.description}
                    </Typography>
                  </Box>

                  <Switch
                    checked={
                      widgetSettings[
                        widget.id
                      ] ?? widget.defaultEnabled
                    }
                    onChange={() =>
                      handleToggle(
                        widget.id
                      )
                    }
                  />

                </Box>

                {index !==
                  dashboardWidgets.length - 1 && (
                  <Divider />
                )}

              </Box>
            )
          )}

        </CardContent>
      </Card>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
        }}
      >

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Dashboard Settings"}
        </Button>

      </Box>

    </Box>
  );
}

export default DashboardControl;