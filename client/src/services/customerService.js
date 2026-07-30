import api from "../api/api";

export const createCustomer = async (formData) => {
  const response = await api.post("/customers", {
    fields: formData,
  });

  return response.data;
};