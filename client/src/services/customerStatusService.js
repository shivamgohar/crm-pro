import api from "../api/api";

export const getCustomerStatuses = async () => {
    const response = await api.get("/company/customer-status");
    return response.data;
};

export const addCustomerStatus = async (statusData) => {
    const response = await api.post(
        "/company/customer-status",
        statusData
    );
    return response.data;
};

export const updateCustomerStatus = async (id, statusData) => {
    const response = await api.put(
        `/company/customer-status/${id}`,
        statusData
    );

    return response.data;
};


export const deleteCustomerStatus = async (id) => {
    const response = await api.delete(
        `/company/customer-status/${id}`
    );

    return response.data;
};

export const archiveCustomerStatus = async (id) => {
    const response = await api.put(
        `/company/customer-status/${id}/archive`
    );

    return response.data;
};

export const restoreCustomerStatus = async (id) => {
    const response = await api.put(
        `/company/customer-status/${id}/restore`
    );

    return response.data;
};


// Reorder
export const reorderCustomerStatus = async (statuses) => {
    const response = await api.put(
        "/company/customer-status/reorder",
        statuses
    );

    return response.data;
};