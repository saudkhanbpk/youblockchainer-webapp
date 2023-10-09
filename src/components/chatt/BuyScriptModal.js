import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { bold_name, btn_connect, circularprog, ptag } from '../../theme/CssMy';
import Web3 from 'web3';
import AskGPT from '../../abis/AskGPT.json';

import { contractAddress } from '../../Constants';
import {
  getScriptPrice,
  purchaseScript,
  getPackages,
} from '../../services/agreement';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';
import { ethers } from 'ethers';
import { makeStyles } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

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

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(3,1fr)',
    },
    gridTemplateColumns: '1fr',
    gridGap: 20,
  },
  card: {
    height: '250px',
    border: '1px solid #000',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    // height: 120,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 32px',
    backgroundColor: '#7D8485',
    color: '#FFF',
  },
  price: {
    textAlign: 'start',
  },
  cardContent: {
    padding: '16px 32px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
  },
  itemMargin: {
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  numberInput: {},
  button: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
}));

const ListItem = ({ text }) => {
  const classes = useStyles();
  return (
    <div className={classes.listItem}>
      <CheckIcon className={classes.itemMargin} />
      <span className={classes.itemMargin}>{text}</span>
    </div>
  );
};

const Card = ({ name, price, numOfScripts, packageId, etherPrice, clicker }) => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <Typography component='h2' variant='h6' align='left'>
          {name}
        </Typography>
        <div className={classes.price}>
          <Typography component='span' variant='h3'>
            {price} ETH
          </Typography>
          <Typography component='span' variant='body2'>
            (${price * etherPrice})
          </Typography>
        </div>
      </div>
      <div className={classes.cardContent}>
        <ListItem text={`${numOfScripts} Scripts`} />
        <div className={classes.cardActions}>
          <Button size='large' className={classes.button} onClick={() => clicker(packageId, price)}>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function BuyScriptModal({ open, handleClose, user }) {
  // const [num, setNum] = useState(0);
  // const [price, setPrice] = useState(0);
  const [etherPrice, setEtherPrice] = useState(0);
  const [packages, setPackages] = useState(null);

  const { fetchPendingScripts } = useContext(ybcontext);

  let provider = window.web3;
  const web3 = new Web3(provider);
  let contract2 = new web3.eth.Contract(AskGPT, contractAddress);
  const [loading, setLoading] = useState(false);

  function getDollarValues() {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      )
      .then((response) => {
        setEtherPrice(response.data[1].current_price);
      })
      .catch((error) => console.log(error));
  }

  const clicker = async (packageId, price) => {
    setLoading(true);
    await subscribe(contract2, packageId, price, user.walletAddress)
      .then((res) => {
        if(res === false) throw Error();
        setNum(0);
        console.log(res);
        handleClose();
        successHandler('Subscribed successfully');
        fetchPendingScripts();
        setLoading(false);
      })
      .catch((e) => {
        errorHandler('Something went wrong');
        setLoading(false);
      });
  };

  // const fetchScriptPrice = async () => {
  //   const p = await getScriptPrice(contract2);
  //   setPrice(ethers.utils.formatEther(p));
  // }

  const fetchPackages = async () => {
    const p = await getPackages(contract2);
    setPackages(p);
  };

  useEffect(() => {
    // fetchScriptPrice();
    getDollarValues();
    fetchPackages();
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <ListItem>
          <ListItemText primary="Subscription Packages" />
          <ListItemIcon onClick={handleClose}>
            <ArrowBackIos />
          </ListItemIcon>
        </ListItem>
        {/* <Typography
          sx={bold_name}
          id='modal-modal-title'
          variant='h6'
          component='h2'
        >
          Subscription Packages
        </Typography> */}
        {packages && packages[0] && packages[0][0] && (
          <>
            <Card
              name={packages[0][0]}
              price={packages[0][1]}
              numOfScripts={packages[0][2]}
              packageId={1}
              etherPrice={etherPrice}
              clicker={clicker}
            />
            <Card
              name={packages[1][0]}
              price={packages[1][1]}
              numOfScripts={packages[1][2]}
              packageId={2}
              etherPrice={etherPrice}
              clicker={clicker}
            />
            <Card
              name={packages[2][0]}
              price={packages[2][1]}
              numOfScripts={packages[2][2]}
              packageId={3}
              etherPrice={etherPrice}
              clicker={clicker}
            />
            <Card
              name={packages[3][0]}
              price={packages[3][1]}
              numOfScripts={packages[3][2]}
              packageId={4}
              etherPrice={etherPrice}
              clicker={clicker}
            />
          </>
        )}
        {/* <p style={{ ...ptag, marginTop: '5%' }}>Number of Scripts</p>
        <TextField
          type='number'
          value={num}
          onChange={(e) => setNum(e.target.value)}
          sx={{ width: '100%' }}
        />
        <p style={{ ...ptag, marginTop: '2%' }}>To Pay ($ETH)</p>
        <TextField value={JSON.stringify(price * num)} sx={{ width: '100%' }} disabled /> */}
        {/* <Box
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
        </Box> */}
      </Box>
    </Modal>
  );
}
