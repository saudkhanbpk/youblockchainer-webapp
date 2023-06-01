import React, { useEffect, useState, useContext } from 'react'
import BrandModal from './BrandModal'
import { ybcontext } from '../../context/MainContext'
import { CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import userImg from '../../images/user.png'
import { bold_name, circularImage, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import AgreementCard from '../card/AgreementCard'
import EmptyState from '../loadingoremptystate/EmptyState'
import SortIcon from '@mui/icons-material/Sort';

const style = {
    margin: { marginTop: '3%' },
    icon: { color: '#424242', fontSize: '20px' },
}

export default function MyOrgPopupModal() {
    const [open, setOpen] = useState(false)
    const { userBrand } = useContext(ybcontext)
    const [orgAgreements, setOrgAgreements] = useState([])

    useEffect(() => {
        userBrand && setOrgAgreements(userBrand.manager.agreements.filter((agr) => agr.user1 === userBrand.manager._id))
    }, [userBrand])

    useEffect(() => {
        localStorage.getItem("ybBrand") !== 'undefined' && JSON.parse(localStorage.getItem("ybBrand")) ? setOpen(false) : setOpen(true)
    }, [])

    return (
        <>
            <Grid container columnSpacing={4} sx={{ borderBottom: '2px solid #E9E9E9', paddingBottom: '2%' }}>
                <Grid item md={1.5}>
                    <CardMedia component='img' image={userBrand ? userBrand.img : userImg} sx={circularImage} />
                </Grid>
                <Grid item md={7.5} sx={df_jfs_ac_fdc}>
                    <Typography variant='h4' sx={bold_name}>{userBrand ? userBrand.name : 'Unnamed'}</Typography>
                    {/* <div style={df_jfe_ac}>
                                <Icon color='#3770FF' icon="mdi:arrow-top-bold-hexagon-outline" />
                                <p style={{ ...ptag, color: '#3770FF' }}>Top rated</p>
                            </div> */}
                </Grid>
                {/* <Grid item md={1.5} sx={df_jc_ac} />
                        <Grid item md={1.5} sx={df_jc_ac}>
                            {connectLoad ? <CircularProgress size={30} sx={circularprog} /> : <Button sx={btn_connect} onClick={() => connect()}>Connect</Button>}
                        </Grid> */}
            </Grid>
            <Grid container columnSpacing={4}>
                <Grid item md={4} sx={{ borderRight: '2px solid #E9E9E9', margin: '0', paddingTop: '2%' }}>
                    <Typography variant='h6' sx={bold_name}>Skills</Typography>
                    <Stack direction='row' sx={{ paddingTop: '2%' }} spacing={1} useFlexGap flexWrap="wrap">
                        {
                            userBrand && userBrand.skills.map((skill, index) => {
                                return <Chip key={index} label={skill} size="small" />

                            })
                        }
                    </Stack>
                </Grid>
                <Grid item md={8} sx={{ paddingTop: '2%' }}>
                    <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                        <SortIcon style={{ ...style.icon }} />
                        <p style={{ ...ptag, fontWeight: 'bold' }}>Description</p>
                    </Grid>
                    <p style={{ ...ptag, }}>{userBrand ? userBrand.description : 'Description here'}</p>
                    <Typography sx={{ ...bold_name, paddingTop: '5%', color: '#3770FF' }}>All agreements</Typography>

                    <Grid container rowSpacing={3}>

                        {orgAgreements.length !== 0 ? <Grid container rowSpacing={3}>
                            {
                                orgAgreements.map((agreement) => {
                                    return <Grid item md={12}>
                                        <AgreementCard agreement={agreement} />
                                    </Grid>
                                })
                            }
                        </Grid> : <EmptyState text='Nothing to show' size='20rem' />}
                    </Grid>
                </Grid>
            </Grid>
            <BrandModal open={open} setOpen={setOpen} />
        </>
    )
}
