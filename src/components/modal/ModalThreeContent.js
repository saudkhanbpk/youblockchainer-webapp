import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'

function ModalThreeContent() {
    return (
        <>
            <Grid sx={{ margin: '5% 0' }}>
                <Box sx={{ padding: '0 20%', marginBottom: '2%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}>Complete Your Profile Now!</Typography>
                </Box>
            </Grid>
        </>
    )
}

export default ModalThreeContent