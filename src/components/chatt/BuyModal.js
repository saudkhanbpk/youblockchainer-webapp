import React from 'react';
import { Box, Button, Dialog, Modal } from '@mui/material';





export default function BuyModal({ open, handleClose, handleSelectedPayment }) {

    return (
        // <Modal
        //     open={true}
        //     onClose={handleClose}
        //     aria-labelledby='modal-modal-title'
        //     aria-describedby='modal-modal-description'
        // >

        //     {/* <Button onClick={() => { handleSelectedPayment('crypto') }}>Crypto</Button>
        //     <Button onClick={() => { handleSelectedPayment('Card') }}> Card</Button> */}
        // </Modal>

        <Dialog maxWidth={'md'} open={open} onClose={handleClose}>
            <Box width={'300px'} padding={5} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={3}>
                <Button variant="outlined"  onClick={() => { handleSelectedPayment('crypto') }}>Crypto</Button>
                <Button variant="outlined"  onClick={() => { handleSelectedPayment('card') }}> Card</Button>
            </Box>
        </Dialog>
    );
}
