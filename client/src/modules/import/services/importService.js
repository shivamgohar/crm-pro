// // import axios from "../../../services/api";  
// import api from "../../../api/api";

// export const getImportFields = async () => {

//     const response = await api.get(
//         "/company/customer-fields/import"
//     );

//     return response.data;

// };


import api from "../../../api/api";

export const getImportFields = async () => {
  try {
    const response = await api.get("/company/customer-fields/import");

    console.log("API SUCCESS:", response.data);

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};