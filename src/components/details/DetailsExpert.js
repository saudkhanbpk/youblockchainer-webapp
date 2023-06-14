import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getExpertById } from '../../services/userServices'
import { Box, Button, CardContent, CardMedia, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { bold_name, btn, btn_connect, btn_hire, circularImage, circularprog, df_jc_ac, df_jfe_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import userImg from '../../images/user.png'
import AgreementCard from '../card/AgreementCard'
import { createRoom } from '../../services/ChatApi'
import AgreementModal from '../agreement/AgreementModal'
import EmptyState from '../loadingoremptystate/EmptyState'
import Loading from '../loader/Loading'
import successHandler from '../toasts/successHandler'
import errorHandler from '../toasts/errorHandler'

export default function DetailsExpert() {
    const params = useParams()
    const navigate = useNavigate()
    const id = params.id
    const [details, setDetails] = useState(null)
    const [connectLoad, setConnectLoad] = useState(false)
    const [expAgreements, setExpAgreements] = useState([])
    const token = localStorage.getItem('ybToken')
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [load, setLoad] = useState(false)
    const user = JSON.parse(localStorage.getItem('ybUser'))
    console.log(token)

    useEffect(() => {
        setLoad(true)
        const func = async () => {
            const id = params.id
            const res = await getExpertById(id)
            setDetails(res.data)
            setExpAgreements(res.data.agreements.filter((agg) => agg.user1 === res.data._id))
            console.log(res.data, id)
            setLoad(false)
        }
        func()
    }, [])

    const connect = async () => {
        setConnectLoad(true)
        await createRoom(id, token)
            .then((res) => {
                console.log(res, 'roomchat')
                navigate(`/chat/${res.data._id}`)
                setConnectLoad(false)
                successHandler('Connection successful')
            }).catch((e) => {
                setConnectLoad(false)
                errorHandler('Something went wrong')
            })
    }

    return (
        <>
            {load ? <Loading /> : details &&
                <>
                    <Grid container columnSpacing={4} sx={{ borderBottom: '2px solid #E9E9E9', paddingBottom: '2%' }}>
                        <Grid item md={1.5}>
                            <CardMedia component='img' image={details?.profileImage ? details?.profileImage : userImg} sx={circularImage} />
                        </Grid>
                        <Grid item md={7.5} sx={df_jfs_ac_fdc}>
                            <Typography variant='h4' sx={bold_name}>{details.username}</Typography>
                            <div style={df_jfe_ac}>
                                {/* <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                                <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p> */}
                            </div>
                        </Grid>
                        {user && details._id !== user._id && <>
                            <Grid item md={1.5} sx={df_jc_ac}>
                                {connectLoad ? <CircularProgress size={30} sx={circularprog} /> : <Button sx={btn_connect} onClick={() => connect()}>Connect</Button>}
                            </Grid>
                            <Grid item md={1.5} sx={df_jc_ac}>
                                <Button sx={btn_hire} onClick={() => setOpen(true)}>Hire</Button>
                            </Grid>
                        </>}
                    </Grid>
                    <Grid container columnSpacing={4}>
                        <Grid item md={4} xs={12} sx={{ borderRight: { md: '2px solid #E9E9E9', sm:'none', xs: 'none' }, margin: '0', paddingTop: '2%', width: '100%' }}>
                            <Typography variant='h6' sx={bold_name}>Skills</Typography>
                            {details.skills.length !== 0 ? <Stack direction='row' sx={{ paddingTop: '2%' }} spacing={1} useFlexGap flexWrap="wrap">
                                {
                                    details.skills.map((skill, index) => {
                                        return <Chip key={index} label={skill} size="small" />

                                    })
                                }
                            </Stack> : <Typography variant='h6' sx={ptag}>No skills added yet</Typography>}
                            {
                                details?.videoVisibility ? <>
                                    <Typography variant='h6' sx={{ ...bold_name, marginTop: '8%' }}>Introductory video</Typography>
                                    <iframe
                                        src={details?.videoIntro}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Embedded youtube"
                                    />
                                </> : <div></div>
                            }
                        </Grid>
                        <Grid item md={8} xs={12} sx={{ paddingTop: '2%' }}>
                            <Typography variant='h6' sx={bold_name}>{details.descriptorTitle}</Typography>
                            <p style={{ ...ptag, paddingTop: '2%' }}>{details.bio}</p>
                            <Typography sx={{ ...bold_name, paddingTop: '5%', color: '#3770FF' }}>All agreements</Typography>

                            {details.agreements.length !== 0 ? <Grid container rowSpacing={{ md: 0.8, xs: 3 }}>
                                {
                                    details.agreements.map((agreement) => {
                                        return <Grid item md={12} sx={{ width: '100%' }}>
                                            <AgreementCard agreement={agreement} />
                                        </Grid>
                                    })
                                }
                            </Grid> : <EmptyState text='Nothing to show' size='20rem' />}
                        </Grid>
                    </Grid>
                    <AgreementModal open={open} handleClose={handleClose} user={user} expert={details} setDetails={setDetails} add={true} />
                </>
            }
        </>
    )
}
