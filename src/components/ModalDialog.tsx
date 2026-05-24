import { Box, Modal, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

interface ModalDialogProps {
  open: boolean;
  handleClose: () => void;
  children?: ReactNode;
  sx?: SxProps;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "1px solid var(--color-gray-200)",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-l)",
  borderRadius: "var(--size-xxs)",
  padding: "0",
};

const ModalDialog = ({ handleClose, open, children, sx }: ModalDialogProps) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={sx ? { borderRadius: "8px", ...sx } : { borderRadius: "8px" }}
      >
        <Box sx={style}>{children ?? ""}</Box>
      </Modal>
    </div>
  );
};

export default ModalDialog;
