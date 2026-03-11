import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

const Card = ({ children, key }: { children: ReactNode; key?: string }) => {
  return (
    <Paper key={key} sx={{ borderRadius: "var(--size-xs)" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--size)",
          textAlign: "left",
          padding: "var(--size)",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default Card;
