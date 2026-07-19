import {
  Box,
  Typography,
  Button,
  Divider,
    Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";




const ServiceHistory = ({ services }) => {

  console.log("Services received:", services);

// const services = [
//   {
//     id: 1,
//     serviceDate: "18 Jul 2026",
//     serviceType: "Installation",
//     engineer: "Rohan",
//     amount: 700,
//     pending: 0,
//     status: "Completed",
//   },
//   {
//     id: 2,
//     serviceDate: "20 Jul 2026",
//     serviceType: "AMC Service",
//     engineer: "Amit",
//     amount: 500,
//     pending: 200,
//     status: "Pending",
//   },
// ];

console.log("ServiceHistory props:", services);
  return (
    <Box>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Service Records
        </Typography>

        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Service
        </Button> */}
      </Box>

      <Divider />

<TableContainer
  component={Paper}
  elevation={0}
  sx={{ mt: 2 }}
>
  <Table>

    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Service</TableCell>
        <TableCell>Engineer</TableCell>
        <TableCell align="right">Amount</TableCell>
        <TableCell align="right">Pending</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="center">Action</TableCell>
      </TableRow>
    </TableHead>

<TableBody>
  {services.map((service) => (
    <TableRow key={service.id}>
      <TableCell> {new Date(service.service_date).toLocaleDateString("en-IN")}</TableCell>

      <TableCell>{service.service}</TableCell>

      <TableCell>{service.engineer}</TableCell>

      <TableCell align="right">
        ₹{Number(service.amount).toFixed(2)}
      </TableCell>

      <TableCell align="right">
        ₹{service.pending ?? 0}
      </TableCell>

      <TableCell>
        {service.remark}
      </TableCell>


          <TableCell>
                    <Button
                      variant="contained"
                    
                    >
                      Edit
                    </Button>
                  </TableCell>
    </TableRow>
  ))}
</TableBody>

  </Table>
</TableContainer>

    </Box>
  );
};

export default ServiceHistory;