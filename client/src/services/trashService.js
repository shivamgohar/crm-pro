import api from "../api/api";

export const getTrashedCustomers = async (params) => {
  const response = await api.get("/customers/trash", {
    params,
  });

  return response.data;
};

export const getActiveCustomersForTrash = async (params) => {
  const response = await api.get(
    "/customers/trash/active",
    {
      params,
    }
  );

  return response.data;
};

export const moveCustomersToTrash = async (ids) => {
  const response = await api.post("/customers/trash", {
    ids,
  });

  return response.data;
};

export const restoreCustomers = async (ids) => {
  const response = await api.put("/customers/trash/restore", {
    ids,
  });

  return response.data;
};

export const permanentlyDeleteCustomers = async (ids) => {
  const response = await api.delete("/customers/trash/permanent", {
    data: {
      ids,
    },
  });

  return response.data;
};

// export const getActiveCustomersForTrash = async () => {
//   const response = await api.get("/customers/trash/active");

//   return response.data;
// };