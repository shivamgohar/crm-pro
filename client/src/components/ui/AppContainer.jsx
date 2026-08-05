import { Container } from "@mui/material";

export default function AppContainer({ children }) {
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {children}
    </Container>
  );
}