import { CardContent, CardMedia, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { card, df_jfe_ac, ptag, text } from '../../theme/CssMy'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router'
import { useState } from 'react'

export default function CardExOrg({ exp, org }) {
    const navigate = useNavigate()
    const [imgLoad, setImgLoad] = useState(false)

    return (
        <CardContent sx={{ ...card, cursor: 'pointer' }} onClick={() => !org ? navigate(`/experts-details/${exp._id}`) : navigate(`/organizations-details/${exp._id}`)}>
            <Grid container>
                <Grid item md={12}>
                    <CardMedia onLoad={() => setImgLoad(true)} sx={imgLoad ? { height: { md: '30vh', sm: '20vh' }, borderRadius: '2.5%' } : { display: 'none' }} component='img' image={!org ? exp?.profileImage : exp?.img} />
                    {!imgLoad && <Skeleton animation="wave" sx={{ height: { md: '30vh', sm: '20vh' }, borderRadius: '2.5%' }} variant="rectangular" />}
                </Grid>
                <Grid item xs={8}>
                    <Typography sx={text} variant='h6'>{!org ? exp?.username : exp?.name}</Typography>
                    {!org ? <p style={ptag}>{exp?.descriptorTitle.length > 15 ? `${exp?.descriptorTitle.slice(0, 20)}...` : exp?.descriptorTitle}</p> :
                        <p style={ptag}>{exp?.description.length > 15 ? `${exp?.description.slice(0, 20)}...` : exp?.description}</p>}
                </Grid>
                <Grid item xs={4} sx={df_jfe_ac}>
                    {/* <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                    <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p> */}
                </Grid>
            </Grid>
            <Grid container sx={{ marginTop: '7%' }}>
                <Grid item xs={8}>
                    <Stack direction='row' spacing={1}>
                        {
                            exp?.skills.map((skill, index) => {
                                if (index < 2) {
                                    return <Chip key={index} label={skill} size="small" />
                                }
                            })
                        }
                    </Stack>
                </Grid>
                <Grid item xs={4} sx={df_jfe_ac}>
                    <Chip label="$50.02/h" size="small" sx={{ backgroundColor: '#3770FF', color: 'white' }} />
                </Grid>
            </Grid>
        </CardContent>
    )
}
