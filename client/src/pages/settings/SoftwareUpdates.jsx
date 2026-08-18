import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";

import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

import { brandConfig } from "../../config/brandConfig";

export default function SoftwareUpdates() {
  const [currentVersion, setCurrentVersion] = useState(
    brandConfig.appVersion
  );

  const [status, setStatus] = useState("idle");
  const [updateVersion, setUpdateVersion] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!window.electronAPI) {
      return;
    }

    window.electronAPI
      .getAppVersion()
      .then((version) => {
        if (version) {
          setCurrentVersion(version);
        }
      });

    const cleanup = window.electronAPI.onUpdateStatus(
      ({ type, data }) => {
        switch (type) {
          case "checking":
            setStatus("checking");
            setErrorMessage("");
            break;

          case "available":
            setStatus("available");
            setUpdateVersion(data?.version || null);
            setLastChecked(new Date());
            break;

          case "not-available":
            setStatus("latest");
            setLastChecked(new Date());
            break;

          case "progress":
            setStatus("downloading");
            setProgress(
              Math.round(data?.percent || 0)
            );
            break;

          case "downloaded":
            setStatus("downloaded");
            setProgress(100);
            setUpdateVersion(data?.version || updateVersion);
            break;

          case "error":
            setStatus("error");
            setLastChecked(new Date());
            setErrorMessage(
              data?.message || "Update check failed."
            );
            break;

          default:
            break;
        }
      }
    );

    return cleanup;
  }, [updateVersion]);

  const handleCheckForUpdates = async () => {
    setStatus("checking");
    setErrorMessage("");

    if (!window.electronAPI) {
      setStatus("error");
      setErrorMessage(
        "Update service is available only in the desktop application."
      );
      return;
    }

    const result =
      await window.electronAPI.checkForUpdates();

    if (!result?.success) {
      setStatus("error");
      setErrorMessage(
        result?.message || "Unable to check for updates."
      );
    }
  };

  const handleDownload = async () => {
    setStatus("downloading");
    setProgress(0);
    setErrorMessage("");

    const result =
      await window.electronAPI.downloadUpdate();

    if (!result?.success) {
      setStatus("error");
      setErrorMessage(
        result?.message || "Unable to download update."
      );
    }
  };

  const handleInstall = async () => {
    await window.electronAPI.installUpdate();
  };

  const getStatusContent = () => {
    if (status === "checking") {
      return {
        icon: (
          <SystemUpdateAltOutlinedIcon color="primary" />
        ),
        title: "Checking for updates...",
        description:
          "We're checking whether a newer version of QeXo is available.",
      };
    }

    if (status === "available") {
      return {
        icon: (
          <SystemUpdateAltOutlinedIcon color="primary" />
        ),
        title: `Version ${updateVersion} is available`,
        description:
          "A new version of QeXo is ready to download.",
      };
    }

    if (status === "downloading") {
      return {
        icon: (
          <DownloadOutlinedIcon color="primary" />
        ),
        title: "Downloading update...",
        description:
          "Please keep QeXo open while the update is downloading.",
      };
    }

    if (status === "downloaded") {
      return {
        icon: (
          <CheckCircleOutlineOutlinedIcon color="success" />
        ),
        title: "Update ready to install",
        description:
          `Version ${updateVersion || ""} has been downloaded successfully.`,
      };
    }

    if (status === "error") {
      return {
        icon: (
          <ErrorOutlineOutlinedIcon color="error" />
        ),
        title: "Update check failed",
        description:
          errorMessage || "Something went wrong while checking for updates.",
      };
    }

    return {
      icon: (
        <CheckCircleOutlineOutlinedIcon color="success" />
      ),
      title: "You're using the latest version",
      description:
        "Your software is currently up to date.",
    };
  };

  const statusContent = getStatusContent();

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 1,
      }}
    >
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Software Updates",
          },
        ]}
      />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Software Updates
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Keep {brandConfig.appName} up to date with the latest
          improvements and fixes.
        </Typography>
      </Box>

      {/* Update Card */}
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Version */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "#fff",
                }}
              >
                <SystemUpdateAltOutlinedIcon />
              </Box>

              <Box>
                <Typography fontWeight={700}>
                  {brandConfig.appName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Current version
                </Typography>
              </Box>
            </Box>

            <Chip
              label={`v${currentVersion}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            {statusContent.icon}

            <Box>
              <Typography fontWeight={600}>
                {statusContent.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {statusContent.description}
              </Typography>
            </Box>
          </Box>

          {/* Download Progress */}
          {status === "downloading" && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 7,
                  borderRadius: 5,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.75,
                }}
              >
                {progress}% downloaded
              </Typography>
            </Box>
          )}

          {/* Last Checked */}
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Last checked:{" "}
            {lastChecked
              ? lastChecked.toLocaleString()
              : "Not checked yet"}
          </Typography>

          {/* Actions */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 1.5,
            }}
          >
            {status === "available" && (
              <Button
                variant="contained"
                startIcon={<DownloadOutlinedIcon />}
                onClick={handleDownload}
              >
                Download Update
              </Button>
            )}

            {status === "downloaded" && (
              <Button
                variant="contained"
                startIcon={<RestartAltOutlinedIcon />}
                onClick={handleInstall}
              >
                Install & Restart
              </Button>
            )}

            {status !== "available" &&
              status !== "downloaded" &&
              status !== "downloading" && (
                <Button
                  variant="contained"
                  startIcon={
                    <SystemUpdateAltOutlinedIcon />
                  }
                  onClick={handleCheckForUpdates}
                  disabled={status === "checking"}
                >
                  {status === "checking"
                    ? "Checking..."
                    : "Check for Updates"}
                </Button>
              )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}