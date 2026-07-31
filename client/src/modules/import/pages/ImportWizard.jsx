import { useState } from "react";
import UploadStep from "../components/UploadStep";
import PreviewStep from "../components/PreviewStep";
import { getImportFields } from "../services/importService";
import MappingStep from "../components/MappingStep";
import { autoMapColumns } from "../utils/autoMapper";
import { transformRows } from "../utils/transformRows";
import { useSnackbar } from "notistack";
import { cleanColumns } from "../utils/cleanColumns";

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

const steps = ["Upload File", "Map Columns", "Preview", "Import"];

export default function ImportWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [rows, setRows] = useState([]);
  const [crmFields, setCrmFields] = useState([]);
  const [mapping, setMapping] = useState({});
  const [previewRows, setPreviewRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

const loadSheetData = async (workbook, sheetName) => {
  const data = getSheetData(workbook, sheetName);

  const cleanedData = cleanColumns(data);

  setRows(cleanedData);

  const fields = await getImportFields();

  setCrmFields(fields);

  const excelColumns = Object.keys(cleanedData[0] || {});

  const autoMapping = autoMapColumns(excelColumns, fields);

  setMapping(autoMapping);
};

  const handleFileSelect = async (file) => {
    setSelectedFile(file);

    const excelWorkbook = await readExcelFile(file);

    setWorkbook(excelWorkbook);

    setSheetNames(excelWorkbook.SheetNames);

    const firstSheet = excelWorkbook.SheetNames[0];

    setSelectedSheet(firstSheet);

    await loadSheetData(excelWorkbook, firstSheet);
  };


const handleNext = () => {
  if (activeStep === 0 && !selectedFile) {
    enqueueSnackbar("Please select an Excel file.", {
      variant: "warning",
    });
    return;
  }

  if (activeStep === 1) {
    // At least one mapping
    const mappedFields = Object.values(mapping).filter(
      (value) => value !== ""
    );

    if (mappedFields.length === 0) {
      enqueueSnackbar("Please map at least one column.", {
        variant: "warning",
      });
      return;
    }

    // Required fields validation
    const requiredFields = crmFields.filter(
      (field) => field.is_required
    );

    const missingFields = requiredFields.filter((field) => {
      return !Object.values(mapping).includes(field.field_key);
    });

    if (missingFields.length > 0) {
      enqueueSnackbar(
        `Please map required field(s): ${missingFields
          .map((f) => f.field_label)
          .join(", ")}`,
        {
          variant: "warning",
        }
      );

      return;
    }
  }

  if (activeStep === 1) {
  const transformed = transformRows(rows, mapping);

  setPreviewRows(transformed);

  console.log("Preview Data:", transformed);
}

  setActiveStep((prev) => prev + 1);
};


const handleSheetChange = async (sheetName) => {
  setSelectedSheet(sheetName);

  await loadSheetData(workbook, sheetName);
};

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
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
        {activeStep === 0 && (
          <UploadStep
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            onSheetChange={handleSheetChange}
          />
        )}

        {activeStep === 1 && (
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

        {activeStep === 2 && (
  <PreviewStep
    rows={previewRows}
    selectedFile={selectedFile}
    selectedSheet={selectedSheet}
  />
)}

        {activeStep === 3 && <Typography>Ready to Import</Typography>}

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 3}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
