import * as XLSX from "xlsx";

export const readExcelFile = async (file) => {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  return workbook;
};

// Read data from one sheet
export const getSheetData = (workbook, sheetName) => {
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  });
};