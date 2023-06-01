import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import HorizontalLinearStepper from './StepperModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { md: 700, sm: 700, xs: 400 },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function BrandModal(props) {
    const { open, setOpen } = props

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ "& .css-1m2x5u7": { border: 'none', borderRadius: '10px' } }}
            >
                <Box sx={style}>
                    <HorizontalLinearStepper open={open} setOpen={setOpen} />
                </Box>
            </Modal>
        </div>
    );
}
