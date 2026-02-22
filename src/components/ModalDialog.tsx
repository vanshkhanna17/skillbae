import { Box, Modal, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface ModalDialogProps {
  open: boolean;
  handleClose: () => void;
  children?: ReactNode;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  border: "1px solid var(--color-gray-200)",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-l)",
  borderRadius: "var(--size-xxs)",
};

const ModalDialog = ({ handleClose, open, children }: ModalDialogProps) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bordeRadius: "8px" }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            What would you like to post?
          </Typography>
          {children ?? ""}
        </Box>
      </Modal>
    </div>
  );
};

export default ModalDialog;
