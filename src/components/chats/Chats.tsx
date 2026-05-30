import { Container, Typography } from "@mui/material";

export default function Chats() {
  return (
    <Container
      sx={{
        // maxWidth: "var(--container-size) !important",
        margin: "0 auto !important",
        display: "flex",
        flexDirection: "column",
        gap: "var(--size-l)",
      }}
    >
      <Typography variant="h3">Chats</Typography>
    </Container>
  );
}
