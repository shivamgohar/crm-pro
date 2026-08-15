import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function LowStockProducts({ products = [] }) {
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
        ⚠ Low Stock Products
      </Typography>

      <List>
        {products.length === 0 ? (
          <Typography color="text.secondary">
            No Low Stock Products
          </Typography>
        ) : (
          products.map((product, index) => (
            <Box key={product.id || index}>
              <ListItem disableGutters>
                <ListItemText
                  primary={product.name}
                  secondary={`Stock : ${product.stock}`}
                />
              </ListItem>

              {index !== products.length - 1 && (
                <Divider />
              )}
            </Box>
          ))
        )}
      </List>
    </Paper>
  );
}

export default LowStockProducts;