import { Button } from "@mui/material";

function AppButton(props) {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={(theme) => ({
        borderRadius: theme.custom.shape.radius.md,
        height: 40,
        px: 3,
        fontWeight: 600,
      })}
      {...props}
    />
  );
}

export default AppButton;