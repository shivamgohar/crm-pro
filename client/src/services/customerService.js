import api from "../api/api";

export const createCustomer = async (formData) => {
  const response = await api.post("/customers", {
    fields: formData,
  });

  return response.data;
};

export const updateCustomer = async (id, formData) => {
  const response = await api.put(`/customers/${id}`, {
    fields: formData,
  });

  return response.data;
};