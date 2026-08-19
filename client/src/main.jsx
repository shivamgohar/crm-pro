import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import {
  ThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

import { SnackbarProvider } from "notistack";

import "./index.css";
import App from "./App";

import {
  createAppTheme,
} from "./theme";

const THEME_STORAGE_KEY =
  "qexo-theme-settings";

const DEFAULT_THEME = {
  mode: "light",
  presetId: "qexo-soft",
  primaryColor: "#2563eb",
  secondaryColor: "#0f172a",
};


function loadThemeSettings() {
  try {
    const saved =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (!saved) {
      return DEFAULT_THEME;
    }

    return {
      ...DEFAULT_THEME,
      ...JSON.parse(saved),
    };

  } catch (error) {

    console.error(
      "Failed to load theme settings:",
      error
    );

    return DEFAULT_THEME;
  }
}


function AppRoot() {

  const [
    themeSettings,
    setThemeSettings,
  ] = useState(
    loadThemeSettings
  );


  const theme = useMemo(
    () =>
      createAppTheme(
        themeSettings
      ),
    [themeSettings]
  );


  const handleThemeChange = (
    newSettings
  ) => {

    const updatedSettings = {
      ...DEFAULT_THEME,
      ...newSettings,
    };


    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify(
        updatedSettings
      )
    );


    setThemeSettings(
      updatedSettings
    );
  };


  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />

      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >

        <HashRouter>

          <App
            themeSettings={
              themeSettings
            }

            onThemeChange={
              handleThemeChange
            }
          />

        </HashRouter>

      </SnackbarProvider>

    </ThemeProvider>
  );
}


createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
);