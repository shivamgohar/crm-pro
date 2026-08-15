import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function TopSellingProducts({ products = [] }) {
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
        🏆 Top Selling Products
      </Typography>

      <List>
        {products.length === 0 ? (
          <Typography color="text.secondary">
            No Sales Yet
          </Typography>
        ) : (
          products.map((product, index) => (
            <Box key={product.id || index}>
              <ListItem disableGutters>
                <ListItemText
                  primary={product.name}
                  secondary={`${product.total_sold} Sold`}
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

export default TopSellingProducts;