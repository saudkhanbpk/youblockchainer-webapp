import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { bold_name, btn_connect, circularprog, df_jc_ac, df_jc_ac_fdc, ptag, textField } from '../../theme/CssMy';
import { CircularProgress, TextField } from '@mui/material';
import { addMilestone, deleteMilestone, updateMilestone } from '../../services/agreement';
import { executeMetaTx } from '../../services/helper';
import Web3 from 'web3';
import Forwarder from '../../abis/Forwarder.json'
import AskGPT from '../../abis/AskGPT.json'
import { contractAddress, forwarderAddress } from '../../Constants';
import { Icon } from '@iconify/react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { md: 700, sm: 700, xs: 400 },
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
};

export default function AddMilestoneModal({ open,setMsLoading, setOpen, idclicked, agreementContract, agreementAddr, getMilestone }) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [desc, setDesc] = useState('')
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let contract1FC = new web3.eth.Contract(Forwarder, forwarderAddress);
    let contract2MC = new web3.eth.Contract(AskGPT, contractAddress);
    const addmilestn = async () => {
        setMsLoading(true)
        setLoading(true)
        console.log('-----------addcalled------------')
        if(await addMilestone(name, web3.utils.toWei(amount), desc, executeMetaTx, agreementContract, agreementAddr, contract1FC)){
            setName('')
            setAmount('')
            setDesc('')
            setOpen('');
            // getMilestone();
        };
        setLoading(false)
        setMsLoading(false);
    }
    console.log(open)
    const update = async () => {
        setMsLoading(true)
        setLoading(true)
        if (await updateMilestone(idclicked, name, web3.utils.toWei(amount), desc, executeMetaTx, agreementContract, agreementAddr, contract1FC))
        {
            setName('')
            setAmount('')
            setDesc('')
            setOpen('');
        }
        // await getMilestone();
        setLoading(false)
        setMsLoading(false);
    }

    const deletemlstn = async() => {
        setMsLoading(true)
        setLoading(true)
        if(await deleteMilestone(idclicked,  agreementContract,executeMetaTx, agreementAddr, contract1FC)){
            setName('')
            setAmount('')
            setDesc('')
            setOpen('');
        }
        // await getMilestone();
        setLoading(false)
        setMsLoading(false);
    }


    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen('')}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {(open === 'create' || open === 'edit' ) && <>
                        <Typography sx={bold_name}>{open === 'edit' ? 'Edit Milestone' : 'Create MileStone'}</Typography>
                        <div style={{ marginTop: '3%' }}>
                            <p style={ptag}>Title</p>
                            <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter title of milestone' sx={textField}></TextField>
                            <p style={ptag}>Amount</p>
                            <TextField value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter amount' sx={textField}></TextField>
                            <p style={{...ptag}}>Description</p>
                            <TextField value={desc} onChange={(e) => setDesc(e.target.value)} multiline rows={4} placeholder='Enter description' sx={textField}></TextField>
                        </div>
                    </>}
                    {
                        open === 'delete' && <Box sx={df_jc_ac_fdc}>
                            <Icon icon="ic:round-warning" width={58} height={58} />
                            <p style={ptag}>Are you sure you want to delete this milestone?</p>
                        </Box>
                    }
                    {loading ? <Box sx={df_jc_ac}>
                        <CircularProgress size={30} sx={circularprog} />
                    </Box> : <Button onClick={() => open === 'create' ? addmilestn() : open === 'edit' ? update() : deletemlstn()} sx={{ ...btn_connect, marginTop: '2%' }}>{open === 'create' ? 'Create milestone' : open === 'edit' ? 'Edit milestone' : 'Delete milestone'}</Button>}

                </Box>
            </Modal>
        </div>
    );
}