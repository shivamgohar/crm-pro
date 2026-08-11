
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
