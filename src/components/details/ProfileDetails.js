import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getExpertById } from '../../services/userServices'
import { Box, Button, CardContent, CardMedia, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { bold_name, btn, btn_connect, btn_hire, circularImage, circularprog, df_jc_ac, df_jfe_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import { Icon } from '@iconify/react'
import AgreementCard from '../card/AgreementCard'
import { createRoom } from '../../services/ChatApi'
import AgreementModal from '../agreement/AgreementModal'
import EmptyState from '../loadingoremptystate/EmptyState'
import userImg from '../../images/user.png'

export default function ProfileDetails() {
    const [details, setDetails] = useState(null)
    const [expAgreements, setExpAgreements] = useState([])
    const token = localStorage.getItem('ybToken')
    const user = JSON.parse(localStorage.getItem('ybUser'))
    console.log(token)

    useEffect(() => {
        const func = async () => {
            setDetails(JSON.parse(localStorage.getItem('ybUser')))
            setExpAgreements(JSON.parse(localStorage.getItem('ybUser'))?.agreements.filter((agg) => agg.user1 === JSON.parse(localStorage.getItem('ybUser'))._id))

        }
        func()
    }, [])


    return (
        <>
            {details &&
                <>
                    <Grid container columnSpacing={4} sx={{ borderBottom: '2px solid #E9E9E9', paddingBottom: '2%' }}>
                        <Grid item md={1.5}>
                            <CardMedia component='img' image={details.profileImage ? details.profileImage : userImg} sx={circularImage} />
                        </Grid>
                        <Grid item md={7.5} sx={df_jfs_ac_fdc}>
                            <Typography variant='h4' sx={bold_name}>{details.username}</Typography>
                            {/* <div style={df_jfe_ac}>
                                <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                                <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p>
                            </div> */}
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={4}>
                        <Grid item md={4} sx={{ borderRight: '2px solid #E9E9E9', margin: '0', paddingTop: '2%' }}>
                            <Typography variant='h6' sx={bold_name}>Skills</Typography>
                            {details.skills.length !== 0 ? <Stack direction='row' sx={{ paddingTop: '2%' }} spacing={1} useFlexGap flexWrap="wrap">
                                {
                                    details.skills.map((skill, index) => {
                                        return <Chip key={index} label={skill} size="small" />

                                    })
                                }
                            </Stack> : <EmptyState text='Nothing to show' size='10rem' />}
                        </Grid>
                        <Grid item md={8} sx={{ paddingTop: '2%' }}>
                            <Typography variant='h6' sx={bold_name}>{details.descriptorTitle}</Typography>
                            <p style={{ ...ptag, paddingTop: '2%' }}>{details.bio}</p>
                            <Typography sx={{ ...bold_name, paddingTop: '5%', color: '#3770FF' }}>All agreements</Typography>

                            {expAgreements.length !== 0 ? <Grid container rowSpacing={3}>
                                {
                                    expAgreements.map((agreement) => {
                                        return <Grid item md={12}>
                                            <AgreementCard agreement={agreement} />
                                        </Grid>
                                    })
                                }
                            </Grid> : <EmptyState text='Nothing to show' size='20rem' />}
                        </Grid>
                    </Grid>
                </>
            }
        </>
    )
}
