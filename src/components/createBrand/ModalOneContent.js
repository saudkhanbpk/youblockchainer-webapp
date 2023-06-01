import { CardMedia, Grid } from '@mui/material'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import sad from '../../images/sad.png'
import { ybcontext } from '../../context/MainContext'


function ModalOneContent({ activeStep, setActiveStep }) {
    const { user, account } = useContext(ybcontext)
    useEffect(() => {

    }, [user])
    // console.log(user, account, "modalonek")
    return (
        <>
            <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <CardMedia sx={{ width: '70px', height: 'auto' }} component='img' image={sad} />
                <p style={{ marginTop: '1%', color: '#8C8C8C', fontSize: '12px' }}>Don't have a brand?</p>
                <h1 style={{ color: '#3770FF' }}> Create One Now!</h1>
            </Grid>
        </>
    )
}

export default ModalOneContent