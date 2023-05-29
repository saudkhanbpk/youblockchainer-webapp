import { Button, CardMedia, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useWeb3React } from '@web3-react/core'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { connectMetaMask } from '../../services/connectors'
import { isMobile } from "react-device-detect";
import { InjectedConnector } from '@web3-react/injected-connector'
import { ybcontext } from '../../context/MainContext'

const style = {
    btn: { display: 'flex', padding: { md: '5px', xs: '0px' }, width: '100%', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#f2f2f2', height: '100%', flexDirection: 'column', alignItems: 'center', textTransform: 'none' },
    img: { width: '50px' },
    heading: { fontFamily: 'Poppins', margin: 0, padding: 0, fontWeight: 'bold', color: 'black' },
    ptag: { margin: 0, padding: 0, fontSize: '10px', color: '#4e4e4e' },
    gridItem: { padding: { md: '10px', xs: '5px' }, height: { md: '100%', xs: 'auto' } },
    gridContainer: { margin: '5% 0' },
}

function ModalOneContent({ activeStep, setActiveStep }) {
    const { activate } = useWeb3React();
    const { user, setUser, account, setAccount, token, setToken, setUserBrand } = useContext(ybcontext)

    const Injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42]
    });
    useEffect(() => {
        if (user !== null && user?.walletAddress) {
            if (!(user.email) || user.email === '' || user.email === null || user.email === undefined) {
                setActiveStep(activeStep + 1);
            } else {
                setActiveStep(activeStep + 2);
            }
        }
    }, [user])
    // console.log(user, account, "modalonek")

    return (
        <>
            <Grid container sx={style.gridContainer}>
                <Grid item container md={12}>
                    <Grid item md={12} sm={12} xs={12} sx={style.gridItem}>
                        <Button onClick={() => {
                            try {
                                activate(Injected)
                                connectMetaMask(user, setUser, account, setAccount, token, setToken, setUserBrand)
                            } catch (e) {
                                console.log(e)
                            }
                        }} sx={style.btn}>
                            <CardMedia sx={style.img} component='img' image="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" />
                            <Typography variant='h6' sx={style.heading}>MetaMask</Typography>
                            <p style={style.ptag}>Connect to your MetaMask Wallet</p>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default ModalOneContent