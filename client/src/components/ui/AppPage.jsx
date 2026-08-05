import { Box } from "@mui/material";
import AppContainer from "./AppContainer";

function AppPage({ children }) {
  return (
  <Box
  sx={(theme) => ({
    // p: theme.custom.layout.pagePadding,
    
    bgcolor: theme.palette.background.default,
    minHeight: "100vh",
  })}
>
    <AppContainer>
        {children}
    </AppContainer>
</Box>
  );
}

export default AppPage;