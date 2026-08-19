import { createTheme } from "@mui/material/styles";

import { colors as defaultColors } from "./colors";
import {
  themePresets,
  DEFAULT_THEME_PRESET,
} from "./themePresets";

import { spacing } from "./spacing";
import { shape } from "./shape";
import { typography } from "./typography";
import { components } from "./components";
import { shadows } from "./shadows";
import { breakpoints } from "./breakpoints";

function getPreset(themeSettings = {}) {
  return (
    themePresets.find(
      (preset) =>
        preset.id === themeSettings.presetId
    ) ||
    themePresets.find(
      (preset) =>
        preset.primaryColor === themeSettings.primaryColor &&
        preset.secondaryColor === themeSettings.secondaryColor
    ) ||
    themePresets.find(
      (preset) =>
        preset.id === DEFAULT_THEME_PRESET
    ) ||
    themePresets[0]
  );
}

export function createAppTheme(themeSettings = {}) {
  const mode =
    themeSettings.mode || "light";

  const preset =
    getPreset(themeSettings);

  const modeColors =
    preset[mode] ||
    preset.light;

  const colors = {
    ...defaultColors,

    ...modeColors,

    primary:
      preset.primaryColor,

    primaryHover:
      preset.primaryColor,

    secondary:
      preset.secondaryColor,
  };

  return createTheme({
    palette: {
      mode,

      primary: {
        main: colors.primary,
        dark: colors.primaryHover,
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: colors.secondary,
        contrastText: "#FFFFFF",
      },

      success: {
        main: defaultColors.success,
      },

      warning: {
        main: defaultColors.warning,
      },

      error: {
        main: defaultColors.error,
      },

      info: {
        main: defaultColors.info,
      },

      background: {
        default: colors.background,
        paper: colors.surface,
      },

      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },

      divider:
        colors.border,
    },

    spacing,

    breakpoints,

    shape: {
      borderRadius:
        shape.radius.md,
    },

    typography,

    components,

    shadows,

    custom: {
      colors,
      spacing,
      shape,
      // layout,
      shadows,
    },
  });
}

const theme = createAppTheme();

export default theme;