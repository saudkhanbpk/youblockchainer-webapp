import { CardMedia, Grid } from '@mui/material'
import React from 'react'
import empty from '../../images/empty.gif'

function EmptyState({ text, size }) {
    return (
        <>
            <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} md={12}>
                <CardMedia component='img' image={empty} sx={{ width: size, height: size }} />
                <h4 style={{ color: 'grey' }}>{text} </h4>
            </Grid>
        </>
    )
}

export default EmptyState