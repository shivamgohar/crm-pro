export const getStatusColor = (status) => {

  switch (status) {

    case "Active":
      return "success";

    case "Pending":
      return "warning";

    case "Closed":
      return "error";

    default:
      return "default";

  }

};