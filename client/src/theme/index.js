import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import { spacing } from "./spacing";
import { shape } from "./shape";
import { typography } from "./typography";
import { layout } from "./layout";
import { components } from "./components";
import { shadows } from "./shadows";
import { breakpoints } from "./breakpoints";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },

    secondary: {
      main: colors.secondary,
    },

    success: {
      main: colors.success,
    },

    warning: {
      main: colors.warning,
    },

    error: {
      main: colors.error,
    },

    background: {
      default: colors.background,
      paper: colors.paper,
    },

    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },

  spacing,

  breakpoints,

  shape: {
    borderRadius: shape.radius.md,
  },

  typography,

  components,

  shadows,

  custom: {
    colors,
    spacing,
    shape,
    layout,
    shadows,
  },
});

export default theme;