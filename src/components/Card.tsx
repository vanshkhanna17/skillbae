import { Box, Paper, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

const Card = ({ children, key, sx }: { children: ReactNode; key?: string; sx?: SxProps }) => {
  return (
    <Paper key={key} sx={{ borderRadius: "var(--size-xs)", ...sx }}>
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
