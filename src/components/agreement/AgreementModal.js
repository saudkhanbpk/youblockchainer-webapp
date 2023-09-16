import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { bold_name, btn_connect, circularprog, ptag } from '../../theme/CssMy';
import moment from 'moment';
import Web3 from 'web3';
import Forwarder from '../../abis/Forwarder.json';
import AskGPT from '../../abis/AskGPT.json';

import { contractAddress, forwarderAddress, rpcConfig } from '../../Constants';
import { createAgreement } from '../../services/agreement';
import { executeMetaTx } from '../../services/helper';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';


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


export default function AgreementModal({ open, handleClose, user, expert, setDetails, add }) {
    const [name, setName] = useState('')
    const [startsAt, setStartsAt] = useState('')
    const { setUser } = useContext(ybcontext)
    let provider = window.web3;
    const web3 = new Web3(provider);
    let contract1 = new web3.eth.Contract(Forwarder, forwarderAddress);
    let contract2 = new web3.eth.Contract(AskGPT, contractAddress);
    const [loading, setLoading] = useState(false)

    const clicker = async () => {
        setLoading(true);
        if (startsAt < moment().format('YYYY-MM-DD')) {
            setLoading(false);
            return errorHandler('Enter valid date');

        }
        if (!startsAt || name.length === 0) {
            setLoading(false);

            return errorHandler('"Name" and "Starts At" field cannot be empty');
        }
        await createAgreement(
            user,
            expert,
            name,
            moment(startsAt).unix(),
            moment().unix(),
            contract2,
            executeMetaTx,
            web3,
            contract1,
            setDetails,
            add
        ).then((res) => {
            // setShowAgreement(null);
            setName('')
            setStartsAt('')
            console.log(res)
            setUser(res)
            handleClose()
            successHandler('Agreement created successfully')
            setLoading(false);
        }).catch((e) => {
            errorHandler('Something went wrong')
            setLoading(false);
        })

    };
    console.log(startsAt)


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={bold_name} id="modal-modal-title" variant="h6" component="h2">
                    Enter agreement details
                </Typography>
                <TextField value={name} onChange={(e) => setName(e.target.value)} sx={{ width: '100%', marginTop: '5%' }} placeholder='Agreement name' />
                <p style={{ ...ptag, marginTop: '5%' }}>Start Date</p>
                <TextField required value={startsAt} sx={{ width: '100%' }} InputProps={{ inputProps: { min: moment().format('YYYY-MM-DD') } }} type="date" name='startsAt' id='startsAt' onChange={(e) => setStartsAt(e.target.value)} />
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                    {loading ? <CircularProgress size={30} sx={circularprog} /> : <Button onClick={clicker} sx={btn_connect} >Done</Button>}
                </Box>

            </Box>
        </Modal>
    )
}
