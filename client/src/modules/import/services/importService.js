
import api from "../../../api/api";

// export const getImportFields = async () => {
//   try {
//     const response = await api.get("/company/customer-fields/import");

//     console.log("API SUCCESS:", response.data);

//     return response.data;
//   } catch (error) {
//     console.error("API ERROR:", error);
//     throw error;
//   }
// };


// export const getImportFields = async () => {
//   try {
//     const response = await api.get("/custom-fields", {
//       params: {
//         module: "customer",
//       },
//     });

//     const fields = response.data.fields || [];

//     // Import screen par sirf importable + visible fields
//     return fields.filter(
//       (field) =>
//         field.is_visible !== false &&
//         field.is_importable !== false &&
//         field.show_in?.import !== false
//     );

//   } catch (error) {
//     console.error("GET IMPORT FIELDS ERROR:", error);
//     throw error;
//   }
// };


export const getImportFields = async () => {
  try {
    const response = await api.get(
      "/company/customer-fields/import"
    );

    console.log("IMPORT FIELDS:", response.data);

    return response.data.filter(
      (field) =>
        field.is_visible !== false
    );

  } catch (error) {
    console.error(
      "GET IMPORT FIELDS ERROR:",
      error
    );
    throw error;
  }
};

export const importCustomers = async (rows, sourceMeta = null) => {

  const response = await api.post(
    "/customers/import",
    {
      rows,
      sourceMeta,
    }
  );

  return response.data;
};


export const saveGoogleSheetMapping = async ({
    spreadsheetId,
    sheetName,
    mapping,
}) => {

    const response = await api.post(
        "/services/google-mapping",
        {
            spreadsheetId,
            sheetName,
            mapping,
        }
    );

    return response.data;
};


export const getGoogleSheetMapping = async ({
    spreadsheetId,
    sheetName,
}) => {

    const response = await api.get(
        "/services/google-mapping",
        {
            params: {
                spreadsheetId,
                sheetName,
            },
        }
    );

    return response.data;
};
