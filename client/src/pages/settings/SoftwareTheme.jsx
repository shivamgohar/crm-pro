import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import {
  LightModeOutlined,
  DarkModeOutlined,
  PaletteOutlined,
  RestartAltOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";

import AppBreadcrumb from "../../components/ui/AppBreadcrumb";

import {
  themePresets,
  DEFAULT_THEME_PRESET,
} from "../../theme/themePresets";


const DEFAULT_THEME = {
  mode: "light",
  presetId: DEFAULT_THEME_PRESET,
  primaryColor: "#3B82F6",
  secondaryColor: "#1E293B",
};


function findPreset(settings) {
  return (
    themePresets.find(
      (preset) =>
        preset.id === settings.presetId
    ) ||
    themePresets.find(
      (preset) =>
        preset.primaryColor === settings.primaryColor &&
        preset.secondaryColor === settings.secondaryColor
    ) ||
    themePresets.find(
      (preset) =>
        preset.id === DEFAULT_THEME_PRESET
    ) ||
    themePresets[0]
  );
}


export default function SoftwareTheme({
  themeSettings,
  onThemeChange,
}) {

  const initialSettings = {
    ...DEFAULT_THEME,
    ...themeSettings,
  };


  const [settings, setSettings] =
    useState(initialSettings);


  const [selectedPreset, setSelectedPreset] =
    useState(
      findPreset(initialSettings).id
    );


  const handleModeChange = (event) => {

    setSettings((current) => ({
      ...current,
      mode: event.target.value,
    }));

  };


  const handlePresetChange = (preset) => {

    setSelectedPreset(preset.id);

    setSettings((current) => ({
      ...current,

      presetId: preset.id,

      primaryColor:
        preset.primaryColor,

      secondaryColor:
        preset.secondaryColor,
    }));

  };


  const handleSave = () => {

    onThemeChange(settings);

  };


  const handleReset = () => {

    const defaultPreset =
      themePresets.find(
        (preset) =>
          preset.id === DEFAULT_THEME_PRESET
      ) || themePresets[0];


    const resetSettings = {

      ...DEFAULT_THEME,

      presetId:
        defaultPreset.id,

      primaryColor:
        defaultPreset.primaryColor,

      secondaryColor:
        defaultPreset.secondaryColor,

    };


    setSettings(resetSettings);

    setSelectedPreset(
      defaultPreset.id
    );

    onThemeChange(resetSettings);

  };


  const selectedTheme =
    findPreset(settings);


  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
        },
        pb: 4,
      }}
    >

      {/* Breadcrumb */}

      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings",
          },
          {
            label: "Appearance & Theme",
          },
        ]}
      />


      {/* Header */}

      <Box
        sx={{
          mb: 3,
        }}
      >

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Appearance & Theme
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          Customize the appearance of your QeXo software.
        </Typography>

      </Box>


      <Stack spacing={2.5}>


        {/* ================================================= */}
        {/* APPEARANCE */}
        {/* ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },
              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 2.5,
                },
              },
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.75,
              }}
            >

              <PaletteOutlined
                color="primary"
                fontSize="small"
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Appearance
              </Typography>

            </Box>


            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
              }}
            >
              Choose how QeXo should appear.
            </Typography>


            <FormControl>

              <FormLabel
                sx={{
                  fontSize: 13,
                  mb: 0.5,
                }}
              >
                Theme Mode
              </FormLabel>


              <RadioGroup
                row
                value={settings.mode}
                onChange={handleModeChange}
                sx={{
                  gap: 1,
                }}
              >

                <FormControlLabel
                  value="light"
                  control={<Radio size="small" />}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <LightModeOutlined
                        fontSize="small"
                      />

                      <Typography variant="body2">
                        Light
                      </Typography>
                    </Box>
                  }
                />


                <FormControlLabel
                  value="dark"
                  control={<Radio size="small" />}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <DarkModeOutlined
                        fontSize="small"
                      />

                      <Typography variant="body2">
                        Dark
                      </Typography>
                    </Box>
                  }
                />

              </RadioGroup>

            </FormControl>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* COLOR THEMES */}
        {/* ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },
              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 2.5,
                },
              },
            }}
          >

            <Box
              sx={{
                mb: 2,
              }}
            >

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Color Theme
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                }}
              >
                Select a professionally designed color combination for QeXo.
              </Typography>

            </Box>


            {/* Compact theme grid */}

            <Grid
              container
              spacing={1.5}
            >

              {themePresets.map((preset) => {

                const isSelected =
                  selectedPreset === preset.id;


                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={preset.id}
                  >

                    <Paper
                      elevation={0}
                      onClick={() =>
                        handlePresetChange(preset)
                      }
                      sx={{
                        position: "relative",

                        minHeight: 92,

                        p: 1.5,

                        cursor: "pointer",

                        border: 1,

                        borderColor:
                          isSelected
                            ? "primary.main"
                            : "divider",

                        borderRadius: 2.5,

                        backgroundColor:
                          "background.paper",

                        transition:
                          "border-color .2s ease, background-color .2s ease, transform .2s ease",

                        "&:hover": {
                          borderColor:
                            "primary.main",

                          backgroundColor:
                            "action.hover",

                          transform:
                            "translateY(-1px)",
                        },
                      }}
                    >

                      {/* Selected indicator */}

                      {isSelected && (
                        <Chip
                          icon={
                            <CheckCircleOutlined
                              sx={{
                                fontSize: 15,
                              }}
                            />
                          }
                          label="Selected"
                          size="small"
                          color="primary"
                          sx={{
                            position:
                              "absolute",

                            top: 10,

                            right: 10,

                            height: 24,

                            fontSize: 11,

                            fontWeight: 600,

                            "& .MuiChip-icon": {
                              ml: 0.5,
                            },
                          }}
                        />
                      )}


                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 0,
                        }}
                      >

                        {/* Color preview */}

                        <Box
                          sx={{
                            width: 52,
                            height: 36,

                            flexShrink: 0,

                            display: "flex",

                            overflow: "hidden",

                            borderRadius: 1.5,

                            border: 1,

                            borderColor:
                              "divider",
                          }}
                        >

                          <Box
                            sx={{
                              flex: 1,
                              backgroundColor:
                                preset.primaryColor,
                            }}
                          />

                          <Box
                            sx={{
                              flex: 1,
                              backgroundColor:
                                preset.secondaryColor,
                            }}
                          />

                        </Box>


                        {/* Theme information */}

                        <Box
                          sx={{
                            minWidth: 0,

                            pr:
                              isSelected
                                ? 7
                                : 0,
                          }}
                        >

                          <Typography
                            variant="body2"
                            fontWeight={700}
                            noWrap
                          >
                            {preset.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display:
                                "block",

                              mt: 0.25,

                              lineHeight: 1.35,
                            }}
                          >
                            {preset.description}
                          </Typography>

                        </Box>

                      </Box>

                    </Paper>

                  </Grid>
                );

              })}

            </Grid>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* PREVIEW */}
        {/* ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },
              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 2.5,
                },
              },
            }}
          >

            <Box
              sx={{
                mb: 1.5,
              }}
            >

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Preview
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                }}
              >
                Preview the selected color combination.
              </Typography>

            </Box>


            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },

                borderRadius: 2,

                border: 1,

                borderColor:
                  "divider",

                backgroundColor:
                  "background.default",
              }}
            >

              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: 130,

                    backgroundColor:
                      settings.primaryColor,

                    "&:hover": {
                      backgroundColor:
                        settings.primaryColor,

                      opacity: 0.9,
                    },
                  }}
                >
                  Primary Button
                </Button>


                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: 140,

                    backgroundColor:
                      settings.secondaryColor,

                    "&:hover": {
                      backgroundColor:
                        settings.secondaryColor,

                      opacity: 0.9,
                    },
                  }}
                >
                  Secondary Button
                </Button>


                {/* Primary swatch */}

                <Box
                  sx={{
                    width: 36,
                    height: 36,

                    borderRadius: 1.5,

                    backgroundColor:
                      settings.primaryColor,

                    border: 1,

                    borderColor:
                      "divider",
                  }}
                />


                {/* Secondary swatch */}

                <Box
                  sx={{
                    width: 36,
                    height: 36,

                    borderRadius: 1.5,

                    backgroundColor:
                      settings.secondaryColor,

                    border: 1,

                    borderColor:
                      "divider",
                  }}
                />


                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    ml: {
                      xs: 0,
                      sm: 0.5,
                    },
                  }}
                >
                  {selectedTheme.name}
                </Typography>

              </Stack>

            </Paper>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* SAVE */}
        {/* ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },

              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 2.5,
                },
              },

              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: 2,

              flexWrap: "wrap",
            }}
          >

            <Box>

              <Typography
                variant="body2"
                fontWeight={700}
              >
                Save Appearance
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.25,
                }}
              >
                Your appearance preference will remain after restarting QeXo.
              </Typography>

            </Box>


            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >

              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <RestartAltOutlined />
                }
                onClick={handleReset}
              >
                Reset
              </Button>


              <Button
                variant="contained"
                size="small"
                onClick={handleSave}
              >
                Save Appearance
              </Button>

            </Box>

          </CardContent>

        </Card>

      </Stack>

    </Box>
  );
}