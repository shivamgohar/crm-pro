import { useState } from "react";

import UploadStep from "../components/UploadStep";
import PreviewStep from "../components/PreviewStep";
import MappingStep from "../components/MappingStep";
import ImportStep from "../components/ImportStep";
import GoogleSheetStep from "../components/GoogleSheetStep";

import { getImportFields, importCustomers } from "../services/importService";

import {
  // authorizeGoogleSheets,
  extractSpreadsheetId,
  fetchGoogleSheetData,
} from "../services/googleSheetService";

import { autoMapColumns } from "../utils/autoMapper";
import { transformRows } from "../utils/transformRows";
import { cleanColumns } from "../utils/cleanColumns";

import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import AppBreadcrumb from "../../../components/ui/AppBreadcrumb";

import { readExcelFile, getSheetData } from "../services/excelService";

import {
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
} from "@mui/material";

const steps = ["Select Source", "Get Data", "Map Columns", "Preview", "Import"];

export default function ImportWizard() {
  const [activeStep, setActiveStep] = useState(0);

  // Source
  const [importSource, setImportSource] = useState(null);

  // Excel
  const [selectedFile, setSelectedFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [googleAccessToken, setGoogleAccessToken] = useState(null);

  // Google Sheet
  const [sheetUrl, setSheetUrl] = useState("");

  // Common data
  const [rows, setRows] = useState([]);
  const [crmFields, setCrmFields] = useState([]);
  const [mapping, setMapping] = useState({});
  const [previewRows, setPreviewRows] = useState([]);

  // Import
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // --------------------------------------------------
  // LOAD EXCEL SHEET DATA
  // --------------------------------------------------

  const loadSheetData = async (excelWorkbook, sheetName) => {
    const data = getSheetData(excelWorkbook, sheetName);

    const cleanedData = cleanColumns(data);

    setRows(cleanedData);

    const fields = await getImportFields();

    setCrmFields(fields);

    const excelColumns = Object.keys(cleanedData[0] || {});

    const autoMapping = autoMapColumns(excelColumns, fields);

    setMapping(autoMapping);
  };

  // --------------------------------------------------
  // EXCEL FILE SELECT
  // --------------------------------------------------

  const handleFileSelect = async (file) => {
    try {
      setSelectedFile(file);

      const excelWorkbook = await readExcelFile(file);

      setWorkbook(excelWorkbook);

      setSheetNames(excelWorkbook.SheetNames);

      const firstSheet = excelWorkbook.SheetNames[0];

      setSelectedSheet(firstSheet);

      await loadSheetData(excelWorkbook, firstSheet);
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Failed to read Excel file.", {
        variant: "error",
      });
    }
  };

  // --------------------------------------------------
  // EXCEL SHEET CHANGE
  // --------------------------------------------------

  const handleSheetChange = async (sheetName) => {
    setSelectedSheet(sheetName);

    await loadSheetData(workbook, sheetName);
  };

  // --------------------------------------------------
  // GOOGLE SHEET ID
  // --------------------------------------------------


  // --------------------------------------------------
  // NEXT
  // --------------------------------------------------

  const handleNext = async () => {
    // STEP 0
    // Select Source
    if (activeStep === 0) {
      if (!importSource) {
        enqueueSnackbar("Please select an import source.", {
          variant: "warning",
        });

        return;
      }

      setActiveStep(1);

      return;
    }

    
   // STEP 1
// Get Data
if (activeStep === 1) {

  // Excel
  if (importSource === "excel") {

    if (!selectedFile) {
      enqueueSnackbar("Please select an Excel file.", {
        variant: "warning",
      });

      return;
    }

    setActiveStep(2);
    return;
  }

  // Google Sheet
  if (importSource === "google_sheet") {

    const spreadsheetId =
      extractSpreadsheetId(sheetUrl);

    if (!spreadsheetId) {
      enqueueSnackbar(
        "Please enter a valid Google Sheet URL.",
        {
          variant: "warning",
        }
      );

      return;
    }

    if (!googleAccessToken) {
      enqueueSnackbar(
        "Please connect your Google account first.",
        {
          variant: "warning",
        }
      );

      return;
    }

    try {

      const values =
        await fetchGoogleSheetData({
          spreadsheetId,
          accessToken: googleAccessToken,
        });

      console.log(
        "GOOGLE SHEET DATA:",
        values
      );

      const headers = values[0] || [];

      const dataRows = values.slice(1);

      const googleObjects = dataRows.map((row) => {

        const obj = {};

        headers.forEach((header, index) => {
          obj[header] = row[index] ?? "";
        });

        return obj;
      });

      const cleanedData =
        cleanColumns(googleObjects);

      setRows(cleanedData);

      const fields =
        await getImportFields();

      setCrmFields(fields);

      const googleColumns =
        Object.keys(
          cleanedData[0] || {}
        );

      const autoMapping =
        autoMapColumns(
          googleColumns,
          fields
        );

      setMapping(autoMapping);

      setActiveStep(2);
      return;

    } catch (error) {

      console.error(error);

      enqueueSnackbar(
        error.message ||
          "Failed to fetch Google Sheet.",
        {
          variant: "error",
        }
      );

      return;
    }
  }
}

    // STEP 2
    // Mapping
    if (activeStep === 2) {
      const mappedFields = Object.values(mapping).filter(
        (value) => value !== "",
      );

      if (mappedFields.length === 0) {
        enqueueSnackbar("Please map at least one column.", {
          variant: "warning",
        });

        return;
      }

      const requiredFields = crmFields.filter((field) => field.is_required);

      const missingFields = requiredFields.filter(
        (field) => !Object.values(mapping).includes(field.field_key),
      );

      if (missingFields.length > 0) {
        enqueueSnackbar(
          `Please map required field(s): ${missingFields
            .map((field) => field.field_label)
            .join(", ")}`,
          {
            variant: "warning",
          },
        );

        return;
      }

      const transformed = transformRows(rows, mapping);

      setPreviewRows(transformed);

      console.log("Preview Data:", transformed);

      setActiveStep(3);

      return;
    }

    // STEP 3
    // Preview
    if (activeStep === 3) {
      setActiveStep(4);
      return;
    }
  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // --------------------------------------------------
  // IMPORT
  // --------------------------------------------------

  const handleImport = async () => {
    try {
      setImporting(true);

      const result = await importCustomers(previewRows);

      console.log(result);

      setImportResult(result);

      enqueueSnackbar("Import Completed", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Import Failed", {
        variant: "error",
      });
    } finally {
      setImporting(false);
    }
  };

  // --------------------------------------------------
  // FINISH
  // --------------------------------------------------

  const handleFinish = () => {
    navigate("/customers");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Paper sx={{ p: 3 }}>
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
            label: "Customer Import",
          },
        ]}
      />

      <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
        Customer Import
      </Typography>

      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={5}>
        {/* STEP 0 */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Choose Import Source
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Select where you want to import customer data from.
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant={importSource === "excel" ? "contained" : "outlined"}
                onClick={() => setImportSource("excel")}
                sx={{
                  minWidth: 180,
                  minHeight: 80,
                }}
              >
                Excel / CSV
              </Button>

              <Button
                variant={
                  importSource === "google_sheet" ? "contained" : "outlined"
                }
                onClick={() => setImportSource("google_sheet")}
                sx={{
                  minWidth: 180,
                  minHeight: 80,
                }}
              >
                Google Sheet
              </Button>
            </Box>
          </Box>
        )}

        {/* STEP 1 */}
        {activeStep === 1 && importSource === "excel" && (
          <UploadStep
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            onSheetChange={handleSheetChange}
          />
        )}

        {/* STEP 1 - GOOGLE SHEET */}
        {activeStep === 1 && importSource === "google_sheet" && (
          <GoogleSheetStep
            sheetUrl={sheetUrl}
            setSheetUrl={setSheetUrl}
            onAuthorized={setGoogleAccessToken}
          />
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <MappingStep
            rows={rows}
            crmFields={crmFields}
            mapping={mapping}
            setMapping={setMapping}
            selectedFile={selectedFile}
            selectedSheet={selectedSheet}
            totalRows={rows.length}
          />
        )}

        {/* STEP 3 */}
        {activeStep === 3 && <PreviewStep rows={previewRows} />}

        {/* STEP 4 */}
        {activeStep === 4 && (
          <ImportStep
            selectedFile={selectedFile}
            selectedSheet={selectedSheet}
            totalRows={rows.length}
            totalMappedFields={
              Object.values(mapping).filter((value) => value !== "").length
            }
            importing={importing}
            onImport={handleImport}
            importResult={importResult}
            onFinish={handleFinish}
          />
        )}

        {/* NAVIGATION */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          {activeStep < 4 && (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
