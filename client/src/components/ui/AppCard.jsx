import { Card } from "@mui/material";

function AppCard(props) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: theme.custom.shape.radius.lg,
        border: `1px solid ${theme.palette.divider}`,
      })}
      {...props}
    />
  );
}

export default AppCard;