import { Box, Card, CardContent, CardMedia, Grid } from '@mui/material'
import React from 'react'
import { useContext } from 'react'

function ModalThreeContent() {
    // const { userBrand } = useContext(ybcontext)
    const userBrand = JSON.parse(localStorage.getItem("ybBrand")) ? JSON.parse(localStorage.getItem("ybBrand")) : null
    // console.log(userBrand);
    return (
        <>
            <Grid container spacing={5} sx={{ padding: '5% 0', display: 'flex', alignItems: 'center' }}>
                <Grid item sx={{ width: '100%' }} md={6}>
                    <h2>Hurrah!</h2>
                    <p style={{ marginTop: '1%', color: '#8C8C8C', fontSize: '12px' }}>You just created your own Organisation</p>
                </Grid>
                <Grid item sx={{ width: '100%' }} md={6}>
                    <Card>
                        <CardContent>
                            <div style={{ display: 'flex', alignItems: 'center', columnGap: '5%' }}>
                                <CardMedia component="img" image={userBrand && userBrand.img} sx={{ width: '70px', height: '70px', borderRadius: '50%' }} />
                                <Box>
                                    <h4>{userBrand && userBrand.name}</h4>
                                    <p style={{ marginTop: '1%', color: '#8C8C8C', fontSize: '12px' }}>{userBrand && userBrand.nickname}</p>
                                </Box>
                            </div>
                            <p style={{ marginTop: '1%', color: '#8C8C8C', fontSize: '12px' }}>{userBrand && userBrand.description}</p>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default ModalThreeContent