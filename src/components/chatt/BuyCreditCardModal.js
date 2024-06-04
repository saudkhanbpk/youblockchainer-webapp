import {
    Box,
    Button,
    Modal,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { bold_name } from '../../theme/CssMy';
import Web3 from 'web3';
import AskGPT from '../../abis/AskGPT.json';


import { contractAddress } from '../../Constants';
import {
    getScriptPrice,
    purchaseScript,
    getPackages,
    subscribe,
} from '../../services/agreement';
import { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';
import { ethers } from 'ethers';
import { makeStyles } from '@mui/styles';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import getStripe from '../../lib/loadStripe';
import { loadStripe } from '@stripe/stripe-js';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: { md: 1000, sm: 600, xs: 400 },
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

const useStyles = makeStyles((theme) => ({
    content: {
        display: 'grid',
        // [theme.breakpoints.up('sm')]: {
        //   gridTemplateColumns: 'repeat(3,1fr)',
        // },
        gridTemplateColumns: 'repeat(4,1fr)',
        gridGap: 20,
    },
    card: {
        height: '250px',
        width: '200px',
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

const Card = ({
    name,
    price,
    numOfScripts,
    packageId,
    etherPrice,
    clicker,
}) => {
    const classes = useStyles();


    return (
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <Typography component='h3' variant='h6' align='left'>
                    {name}
                </Typography>
                <div className={classes.price}>
                    <Typography component='span' variant='h5'>
                        {price} $
                    </Typography>
                    {/* <Typography component='span' variant='body2'>
              (${(ethers.utils.formatEther(price) * etherPrice).toFixed(2)})
            </Typography> */}
                </div>
            </div>
            <div className={classes.cardContent}>
                <ListItem text={`${parseInt(numOfScripts)} Scripts`} />
                <div className={classes.cardActions}>
                    <Button
                        size='large'
                        className={classes.button}
                        onClick={() => clicker(packageId, price)}
                    >
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    );
};



export default function BuyCreditCardModal({ open, handleClose, user }) {

    const [etherPrice, setEtherPrice] = useState(0);

    let provider = window.web3;
    const web3 = new Web3(provider);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();




    async function handleCheckout() {
        const stripe = await loadStripe('pk_test_51PNZQSDmMfVWb91lVcKSkfQu6QsaWydE0FMu91wM9TM2OeBFC2hMEjh9sH6ZY3ivqhcATv73ft8ZCDqOwiMh8S0900K9EPNYcd')

  
    }

    const clicker = async (packageId, price) => {
        setLoading(true);
        console.log('click')
        handleCheckout()
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box>
                <Box sx={style}>
                    <Typography
                        sx={bold_name}
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                    >
                        Subscription Packages
                    </Typography>
                    <div className={classes.content}>
                        <Card
                            name={"Standard"}
                            price={20}
                            numOfScripts={2}
                            packageId={1}
                            etherPrice={etherPrice}
                            clicker={clicker}
                        />
                        <Card
                            name={"Premium"}
                            price={40}
                            numOfScripts={4}
                            packageId={2}
                            etherPrice={etherPrice}
                            clicker={clicker}
                        />
                        <Card
                            name={"Gold"}
                            price={60}
                            numOfScripts={6}
                            packageId={3}
                            etherPrice={etherPrice}
                            clicker={clicker}
                        />
                        <Card
                            name={'VIP'}
                            price={100}
                            numOfScripts={10}
                            packageId={4}
                            etherPrice={etherPrice}
                            clicker={clicker}
                        />
                    </div>
                </Box>
            </Box>
        </Modal>
    );
}
