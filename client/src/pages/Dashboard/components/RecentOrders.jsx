import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";

function RecentOrders({ orders = [] }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
      >
        Recent Orders
      </Typography>

      <List>
        {orders.length === 0 ? (
          <Typography color="text.secondary">
            No Recent Orders
          </Typography>
        ) : (
          orders.map((order, index) => (
            <Box key={order.id || index}>
              <ListItem disableGutters>
                <Avatar sx={{ mr: 2 }}>
                  {String(order.customer_name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <ListItemText
                  primary={`${order.customer_name} • ${order.product_name}`}
                  secondary={`Qty : ${order.quantity} | ₹ ${Number(
                    order.total
                  ).toLocaleString("en-IN")}`}
                />
              </ListItem>

              {index !== orders.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>
    </Paper>
  );
}

export default RecentOrders;