import axios from "axios";

const API_URL = "http://localhost:5000/api/custom-fields";


// Get all custom fields
export const getCustomFields = async (module = null) => {
  const response = await axios.get(
    module
      ? `${API_URL}?module=${module}`
      : API_URL
  );

  return response.data.fields;
};


// Add custom field
export const addCustomField = async (fieldData) => {
  const response = await axios.post(
    API_URL,
    fieldData
  );

  return response.data;
};


// Update custom field
export const updateCustomField = async (
  id,
  fieldData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    fieldData
  );

  return response.data;
};


// Archive custom field
export const archiveCustomField = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/archive`
  );

  return response.data;
};


// Restore custom field
export const restoreCustomField = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/restore`
  );

  return response.data;
};


// Reorder custom fields
export const reorderCustomFields = async (fields) => {
  const response = await axios.patch(
    `${API_URL}/reorder`,
    {
      fields,
    }
  );

  return response.data;
};