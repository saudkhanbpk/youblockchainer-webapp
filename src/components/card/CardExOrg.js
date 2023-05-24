import { CardContent, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { card, df_jfe_ac, ptag, text } from '../../theme/CssMy'
import { Icon } from '@iconify/react'

export default function CardExOrg({ exp }) {
    return (
        <CardContent sx={card}>
            <CardMedia sx={{ height: { md: '30vh', sm: '20vh' } }} component='img' image={exp?.profileImage} />
            <Grid container>
                <Grid item xs={8}>
                    <Typography sx={text} variant='h6'>{exp?.username}</Typography>
                    <p style={ptag}>{exp?.descriptorTitle.length > 15 ? `${exp?.descriptorTitle.slice(0, 20)}...` : exp?.descriptorTitle}</p>
                </Grid>
                <Grid item xs={4} sx={df_jfe_ac}>
                    <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                    <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p>
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
                    <Chip label="$50.02" size="small" sx={{ backgroundColor: '#3770FF', color: 'white' }} />
                </Grid>
            </Grid>
        </CardContent>
    )
}
