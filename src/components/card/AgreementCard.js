import React, { useEffect, useState } from 'react'
import { getExpertById } from '../../services/userServices'
import { Avatar, CardContent, CardMedia, Grid, Rating, Stack, Typography } from '@mui/material'
import { card, circularImage, df_jc_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import moment from 'moment'

export default function AgreementCard({ agreement }) {
    const [user1, setUser1] = useState(null)
    const [user2, setUser2] = useState(null)


    useEffect(() => {
        const func = async () => {
            setUser1(agreement.user1)
            setUser2(agreement.user2)
        }
        func()
    }, [])

    console.log(user1, user2)

    return (
        <>
            {user1 && user2 && <CardContent sx={{ ...card }}>
                <Grid container  >
                    <Grid item md={2} sx={{ ...df_jfs_ac, marginRight: '5px' }}>
                        <Stack direction="row" spacing={-3}>
                            <Avatar sx={{ width: 60, height: 60, border: '2px solid #3770FF' }} alt={user1.username} src={user1.profileImage} />
                            <Avatar sx={{ width: 60, height: 60, border: '2px solid #3770FF' }} alt={user1.username} src={user2.profileImage} />
                        </Stack>
                    </Grid>
                    <Grid item md={9} sx={df_jfs_ac_fdc}>
                        <Typography variant='p' sx={{ ...ptag, fontWeight: '700', fontSize: '1rem', color: 'black' }}> {agreement.name}</Typography>
                        <p style={ptag}>{moment.unix(agreement.startsAt).format('MMMM DD, YY')} - {agreement?.endsAt ? moment.unix(agreement.endsAt).format('MMMM DD, YY') : 'Present'}</p>
                        <Rating value={agreement.ratingForU1} readOnly size="small" />
                    </Grid>
                </Grid>
            </CardContent>}
        </>
    )
}
