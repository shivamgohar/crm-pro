// import axios from "../../../services/api";  
import api from "../../../api/api";

export const getImportFields = async () => {

    const response = await api.get(
        "/api/company/customer-fields/import"
    );

    return response.data;

};