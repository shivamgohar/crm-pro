import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  IconButton,
  Badge,
  Popover,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  //   Button,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CircleIcon from "@mui/icons-material/Circle";

import api from "../../api/api";

function NotificationCenter({ mode = "navbar", limit = 5 }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);

      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // MARK AS READ
  // ==========================================

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: true,
              }
            : notification,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Notification read error:", error);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";

      case "medium":
        return "warning";

      default:
        return "info";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // NAVBAR MODE
  // ==========================================

  if (mode === "navbar") {
    const open = Boolean(anchorEl);

    return (
      <>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Paper
            sx={{
              width: 380,
              maxWidth: "90vw",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Notifications
              </Typography>

              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  size="small"
                  color="primary"
                />
              )}
            </Box>

            <Divider />

            <NotificationList
              notifications={notifications.slice(0, limit)}
              onRead={markAsRead}
              formatDate={formatDate}
              getPriorityColor={getPriorityColor}
            />
          </Paper>
        </Popover>
      </>
    );
  }

  // ==========================================
  // DASHBOARD MODE
  // ==========================================

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Notifications
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Important alerts and updates
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Chip label={`${unreadCount} unread`} color="primary" size="small" />
        )}
      </Box>

      <Divider />

      <NotificationList
        notifications={notifications.slice(0, limit)}
        onRead={markAsRead}
        formatDate={formatDate}
        getPriorityColor={getPriorityColor}
      />
    </Paper>
  );
}

// ==========================================
// NOTIFICATION LIST
// ==========================================

function NotificationList({
  notifications,
  onRead,
  formatDate,
  getPriorityColor,
}) {
  if (notifications.length === 0) {
    return (
      <Box
        sx={{
          py: 5,
          textAlign: "center",
        }}
      >
        <NotificationsNoneIcon
          sx={{
            fontSize: 42,
            color: "text.disabled",
            mb: 1,
          }}
        />

        <Typography fontWeight={600}>No notifications</Typography>

        <Typography variant="body2" color="text.secondary">
          You're all caught up.
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {notifications.map((notification, index) => (
        <Box key={notification.id}>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: notification.is_read
                ? "transparent"
                : "action.hover",
            }}
          >
            <ListItemButton
              onClick={() => {
                if (!notification.is_read) {
                  onRead(notification.id);
                }
              }}
              sx={{
                alignItems: "flex-start",
                py: 1.5,
              }}
            >
              <CircleIcon
                sx={{
                  fontSize: 9,
                  mt: 1,
                  mr: 1.5,
                  color: notification.is_read
                    ? "transparent"
                    : `${getPriorityColor(notification.priority)}.main`,
                }}
              />

              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography fontWeight={notification.is_read ? 500 : 700}>
                      {notification.title}
                    </Typography>

                    <Chip
                      label={notification.priority}
                      size="small"
                      color={getPriorityColor(notification.priority)}
                      sx={{
                        height: 20,
                        fontSize: 10,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      {notification.message}
                    </Typography>

                    <Typography
                      component="span"
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        display: "block",
                      }}
                    >
                      {formatDate(notification.created_at)}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>

          {index !== notifications.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
}

export default NotificationCenter;
