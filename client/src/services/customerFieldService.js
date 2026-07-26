import api from "../api/api";

// Get Visible Fields
export const getCustomerFields = async () => {
    const response = await api.get("/company/customer-fields");
    return response.data;
};

// Get All Fields (Admin)
export const getAllCustomerFields = async () => {
    const response = await api.get("/company/customer-fields/all");
    return response.data;
};

// Add Field
export const addCustomerField = async (data) => {
    const response = await api.post("/company/customer-fields", data);
    return response.data;
};

// Update Field
export const updateCustomerField = async (id, data) => {
    const response = await api.put(`/company/customer-fields/${id}`, data);
    return response.data;
};

// Archive Field
export const archiveCustomerField = async (id) => {
    const response = await api.delete(`/company/customer-fields/${id}`);
    return response.data;
};

// Restore Field
export const restoreCustomerField = async (id) => {
    const response = await api.put(`/company/customer-fields/${id}/restore`);
    return response.data;
};

// Reorder
export const reorderCustomerFields = async (fields) => {
    const response = await api.put(
        "/company/customer-fields/reorder",
        { fields }
    );
    return response.data;
};