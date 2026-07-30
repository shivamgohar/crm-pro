import { useState } from "react";
import UploadStep from "../components/UploadStep";
import PreviewStep from "../components/PreviewStep";
import { getImportFields } from "../services/importService";
import MappingStep from "../components/MappingStep";
import { autoMapColumns } from "../utils/autoMapper";
import { transformRows } from "../utils/transformRows";

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
  const [rows, setRows] = useState([]);
  const [crmFields, setCrmFields] = useState([]);
  const [mapping, setMapping] = useState({});

  const handleFileSelect = async (file) => {
    setSelectedFile(file);

    const excelWorkbook = await readExcelFile(file);

    setWorkbook(excelWorkbook);

    setSheetNames(excelWorkbook.SheetNames);

    const firstSheet = excelWorkbook.SheetNames[0];

    const data = getSheetData(excelWorkbook, firstSheet);

    setRows(data);

    console.log("Workbook :", excelWorkbook);

    console.log("Sheets :", excelWorkbook.SheetNames);

    console.log("Rows :", data);

    console.log("Total Rows :", data.length);

    const fields = await getImportFields();

    setCrmFields(fields);

    console.log("CRM Fields :", fields);

    const excelColumns = Object.keys(data[0] || {});

    const autoMapping = autoMapColumns(excelColumns, fields);

    setMapping(autoMapping);

    console.log(autoMapping);

    const transformedData = transformRows(rows, mapping);

    console.log(transformedData);
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedFile) {
      alert("Please select an Excel file.");
      return;
    }

    if (activeStep === 1 && Object.keys(mapping).length === 0) {
      alert("Please map at least one column.");
      return;
    }

    setActiveStep((prev) => prev + 1);
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
          />
        )}

        {activeStep === 1 && (
          <MappingStep
            rows={rows}
            crmFields={crmFields}
            mapping={mapping}
            setMapping={setMapping}
          />
        )}

        {activeStep === 2 && <PreviewStep rows={rows} />}

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
