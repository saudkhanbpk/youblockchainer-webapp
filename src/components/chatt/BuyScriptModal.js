import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { bold_name, btn_connect, circularprog, ptag } from '../../theme/CssMy';
import Web3 from 'web3';
import AskGPT from '../../abis/AskGPT.json';

import { contractAddress } from '../../Constants';
import { getScriptPrice, purchaseScript } from '../../services/agreement';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';
import { ethers } from 'ethers';

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
  borderRadius: '10px',
};

export default function BuyScriptModal({ open, handleClose, user }) {
  const [num, setNum] = useState(0);
  const [price, setPrice] = useState(0);

  const { fetchPendingScripts } = useContext(ybcontext);

  let provider = window.web3;
  const web3 = new Web3(provider);
  let contract2 = new web3.eth.Contract(AskGPT, contractAddress);
  const [loading, setLoading] = useState(false);

  const clicker = async () => {
    setLoading(true);
    if (num <= 0) {
      setLoading(false);
      return errorHandler('Enter a number greater than 0');
    }
    await purchaseScript(contract2, num, price*num, user.walletAddress)
      .then((res) => {
        if(res === false) throw Error();
        setNum(0);
        console.log(res);
        handleClose();
        successHandler('Scripts bought successfully');
        fetchPendingScripts();
        setLoading(false);
      })
      .catch((e) => {
        errorHandler('Something went wrong');
        setLoading(false);
      });
  };

  const fetchScriptPrice = async () => {
    const p = await getScriptPrice(contract2);
    setPrice(ethers.utils.formatEther(p));
  }

  useEffect(() => {
    fetchScriptPrice();
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography
          sx={bold_name}
          id='modal-modal-title'
          variant='h6'
          component='h2'
        >
          Buy Scripts
        </Typography>
        <p style={{ ...ptag, marginTop: '5%' }}>Number of Scripts</p>
        <TextField
          type='number'
          value={num}
          onChange={(e) => setNum(e.target.value)}
          sx={{ width: '100%' }}
        />
        <p style={{ ...ptag, marginTop: '2%' }}>To Pay ($ETH)</p>
        <TextField value={JSON.stringify(price * num)} sx={{ width: '100%' }} disabled />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5%',
          }}
        >
          {loading ? (
            <CircularProgress size={30} sx={circularprog} />
          ) : (
            <>
              <Button onClick={handleClose} sx={btn_connect} style={{ margin: '0 5%' }}>
                Back
              </Button>
              <Button onClick={clicker} sx={btn_connect} style={{ margin: '0 5%' }}>
                Purchase
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
