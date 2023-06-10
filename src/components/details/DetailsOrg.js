import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, CardMedia, Chip, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { bold_name, btn_connect, circularImage, circularprog, df_jc_ac, df_jfe_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import { Icon } from '@iconify/react'
import AgreementCard from '../card/AgreementCard'
import { createRoom } from '../../services/ChatApi'
import { getBrandById } from '../../services/brandsApi'
import SortIcon from '@mui/icons-material/Sort';
import EmptyState from '../loadingoremptystate/EmptyState'
import Loading from '../loader/Loading'
import successHandler from '../toasts/successHandler'
import errorHandler from '../toasts/errorHandler'

const style = {
    margin: { marginTop: '3%' },
    icon: { color: '#424242', fontSize: '20px' },
}


export default function DetailsOrg() {


    const params = useParams()
    const navigate = useNavigate()
    const id = params.id
    const [details, setDetails] = useState(null)
    const [allDetails, setAllDetails] = useState(null)
    const [connectLoad, setConnectLoad] = useState(false)
    const [load, setLoad] = useState(false)
    const [orgAgreements, setOrgAgreements] = useState([])
    const token = localStorage.getItem('ybToken')
    const user = JSON.parse(localStorage.getItem('ybUser'))
    console.log(token)

    useEffect(() => {
        setLoad(true)
        const func = async () => {
            const id = params.id
            let res = await getBrandById(id)

            setAllDetails(res.data)
            setDetails(res.data.manager)
            setOrgAgreements(res.data.manager.agreements.filter((agr) => agr.user1 === res.data.manager._id))
            console.log(res.data, id)
            setLoad(false)

        }
        func()
    }, [])

    const connect = async () => {
        setConnectLoad(true)
        await createRoom(details._id, token).then((res) => {
            navigate(`/chat/${res.data._id}`)
            setConnectLoad(false)
            successHandler('Connection successful')
        }).catch((e) => {
            setLoad(false)
            errorHandler('Something went wrong')
        })
    }

    return (
        <>
            {load ? <Loading /> : details && allDetails &&
                <>
                    <Grid container columnSpacing={4} sx={{ borderBottom: '2px solid #E9E9E9', paddingBottom: '2%' }}>
                        <Grid item md={1.5}>
                            <CardMedia component='img' image={allDetails.img} sx={circularImage} />
                        </Grid>
                        <Grid item md={7.5} sx={df_jfs_ac_fdc}>
                            <Typography variant='h4' sx={bold_name}>{allDetails.name}</Typography>
                            <div style={df_jfe_ac}>
                                {/* <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                                <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p> */}
                            </div>
                        </Grid>
                        <Grid item md={1.5} sx={df_jc_ac} />
                        {user && details._id !== user._id && <Grid item md={1.5} sx={df_jc_ac}>
                            {connectLoad ? <CircularProgress size={30} sx={circularprog} /> : <Button sx={btn_connect} onClick={() => connect()}>Connect</Button>}
                        </Grid>}
                    </Grid>
                    <Grid container columnSpacing={4} >
                        <Grid item md={4} xs={12} sx={{ borderRight: { sm: '2px solid #E9E9E9', xs: 'none' }, margin: '0', paddingTop: '2%' }}>
                            <Typography variant='h6' sx={bold_name}>Skills</Typography>
                            <Stack direction='row' sx={{ paddingTop: '2%' }} spacing={1} useFlexGap flexWrap="wrap">
                                {
                                    allDetails.skills.map((skill, index) => {
                                        return <Chip key={index} label={skill} size="small" />

                                    })
                                }
                            </Stack>
                        </Grid>
                        <Grid item md={8} xs={12} sx={{ paddingTop: '2%' }}>
                            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                                <SortIcon style={{ ...style.icon }} />
                                <p style={{ ...ptag, fontWeight: 'bold' }}>Description</p>
                            </Grid>
                            <p style={{ ...ptag, }}>{allDetails.description}</p>

                            <Grid xs={12} container rowSpacing={3}>
                                <Typography sx={{ ...bold_name, paddingTop: '5%', color: '#3770FF' }}>All agreements</Typography>

                                {details.agreements.length !== 0 ? <Grid container rowSpacing={{ md: 0.8, xs: 3 }}>
                                    {
                                        details.agreements.map((agreement) => {
                                            return <Grid md={12} xs={12} item>
                                                <AgreementCard agreement={agreement} />
                                            </Grid>
                                        })
                                    }
                                </Grid> : <EmptyState text='Nothing to show' size='20rem' />}
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            }
        </>
    )
}
