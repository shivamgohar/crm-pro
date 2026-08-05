import api from "../api/api";


export const updateService = async (id, data) => {

    const response = await api.put(
        `/services/${id}`,
        data
    );

    return response.data;

};