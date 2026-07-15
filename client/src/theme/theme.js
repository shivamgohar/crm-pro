import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  palette: {

    primary: {
      main: "#2563eb",
    },

    secondary: {
      main: "#0f172a",
    },

    background: {
      default: "#f4f7fe",
      paper: "#ffffff",
    },

    success: {
      main: "#22c55e",
    },

    warning: {
      main: "#f59e0b",
    },

    error: {
      main: "#ef4444",
    },

  },

  shape: {

    borderRadius: 12,

  },

  typography: {

    fontFamily: "Poppins, Roboto, sans-serif",

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },

  },

});

export default theme;