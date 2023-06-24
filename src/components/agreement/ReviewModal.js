import { Box, Button, CircularProgress, Modal, Rating, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { bold_name, btn_connect, circularprog, ptag, textField } from '../../theme/CssMy';
import moment from 'moment';
import Web3 from 'web3';
import Forwarder from '../../abis/Forwarder.json';
import AskGPT from '../../abis/AskGPT.json';

import { contractAddress, forwarderAddress, rpcConfig } from '../../Constants';
import { createAgreement, updateAgreement } from '../../services/agreement';
import { executeMetaTx } from '../../services/helper';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';
import { useNavigate } from 'react-router';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { md: 600, sm: 600, xs: 400 },
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
};


export default function ReviewModal({ open, setOpen, u1, u2, id }) {
    const [rate, setRate] = useState(0)
    const [review, setReview] = useState('')
const [loading, setLoading] = useState(false)
const navigate = useNavigate()
console.log(rate, review)
const clicker = async() =>{
    if(await updateAgreement(id, u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id ?
    {reviewForU2: review, ratingForU2: rate} : 
    {reviewForU1: review, ratingForU1: rate})){
        navigate('/profile')
    }
}

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={bold_name} id="modal-modal-title" variant="h6" component="h2">
                    Rate your experience with {u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id ? u2?.username : u1.username}
                </Typography>
                <Rating
                    name="simple-controlled"
                    value={rate}
                    onChange={(event, newValue) => {
                        setRate(newValue);
                    }}
                />
                <p style={ptag}>Write a review</p>
                <TextField sx={textField} multiline rows={4} value={review} onChange={(e) => setReview(e.target.value)}/>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                    {loading ? <CircularProgress size={30} sx={circularprog} /> : <Button onClick={clicker} sx={btn_connect} >Done</Button>}
                </Box>
            </Box>
        </Modal>
    )
}
