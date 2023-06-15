import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { md: 600, sm: 600, xs: 400 },
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 1,
    borderRadius:'10px',
    paddingBottom:'0'
};

export default function ModalInModal({open, setOpen}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <iframe width="100%" height="315"
                allow='autoplay'
                style={{borderRadius:'5px'}}
                src="https://www.youtube.com/embed/tgbNymZ7vqY">
              </iframe>
        </Box>
      </Modal>
    </div>
  );
}