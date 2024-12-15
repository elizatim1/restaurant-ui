import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const UniversalModal = ({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
  isEditing,
  submitText = 'Save',
  cancelText = 'Cancel'
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          minWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            {submitText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UniversalModal;
