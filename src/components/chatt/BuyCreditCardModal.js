import {
    Box,
    Button,
    Modal,
    Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { bold_name } from '../../theme/CssMy';
import Web3 from 'web3';
import { makeStyles } from '@mui/styles';
import CheckIcon from '@mui/icons-material/Check';
import StripeCheckout from 'react-stripe-checkout';
import { ybcontext } from '../../context/MainContext';
import { toast } from 'react-toastify';
import { getExpertById } from '../../services/userServices';
import { STRIPE_PUBLISH_KEY, baseUrl } from '../../Constants';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

const useStyles = makeStyles((theme) => ({
    content: {
        display: 'grid',
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
                </div>
            </div>
            <div className={classes.cardContent}>
                <ListItem text={`${parseInt(numOfScripts)} scripts`} />
                <div className={classes.cardActions}>
                    <Button
                        size='large'
                        className={classes.button}
                        onClick={() => clicker(packageId, price,parseInt(numOfScripts))}
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
    const [selectedPackage, setSelectedPackage] = useState(null);

   const {fetchPendingScriptswithCredit,setUser} =useContext(ybcontext)

    const web3 = new Web3(window.web3);
    const classes = useStyles();

    const handleCheckout = async (totalAmount, token) => {
        const response = await fetch(`${baseUrl}/user/checkout`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stripeToken: {
                    amount: totalAmount,
                    currency: 'usd',
                    source: token,
                    description: 'Payment description',
                    metadata: { integration_check: 'accept_a_payment' },
                    packageId:selectedPackage.packageId,
                    scripts:selectedPackage.scripts
                },
                userId: user?._id 
            }),
        });

        const session = await response.json();

        if (session.error) {
            console.error(session.error.message);
            return;
        }
        let res = await getExpertById(user._id);
          localStorage.setItem('ybUser', JSON.stringify(res.data));
          setUser(res.data);
          setSelectedPackage(null)
          fetchPendingScriptswithCredit()
        toast.success('purchased successfully');
        handleClose()
    };

    const tokenHandler = (token) => {
        if (selectedPackage) {
            handleCheckout(selectedPackage.price * 100, token);  
        }
    }

    const clicker = (packageId, price,scripts) => {
        setSelectedPackage({ packageId, price, scripts});
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
                    {selectedPackage && (
                        <StripeCheckout
                            stripeKey={STRIPE_PUBLISH_KEY}
                            token={tokenHandler}
                            amount={selectedPackage.price * 100} // price in cents
                            name="Subscription Package"
                            description={`Purchase the ${selectedPackage.packageId} package`}
                            panelLabel="Pay"
                            currency="USD"
                        />
                    )}
                </Box>
            </Box>
        </Modal>
    );
}