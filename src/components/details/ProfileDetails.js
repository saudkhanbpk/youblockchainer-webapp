import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getExpertById, updateMe } from '../../services/userServices'
import { Box, CardMedia, Chip, CircularProgress, Fab, Grid, Stack, Switch, TextField, Typography } from '@mui/material'
import { bold_name, circularImage, circularprog, df_jc_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy'
import { Icon } from '@iconify/react'
import AgreementCard from '../card/AgreementCard'
import EmptyState from '../loadingoremptystate/EmptyState'
import userImg from '../../images/user.png'
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'
import { uploadImg } from '../../services/ipfsServicesApi'
import { TagsInput } from 'react-tag-input-component'
import HorizontalScroll from 'react-scroll-horizontal'
import BasicTabs from './TabsUser'
import { ybcontext } from '../../context/MainContext'
import successHandler from '../toasts/successHandler'

const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    '&:hover': { backgroundColor: '#3770FF9c' }
};

export default function ProfileDetails() {
    const [details, setDetails] = useState(null)
    const [expAgreements, setExpAgreements] = useState([])
    const [chips, setChips] = useState((JSON.parse(localStorage.getItem('ybUser')))?.skills ? (JSON.parse(localStorage.getItem('ybUser')))?.skills : [])
    const token = localStorage.getItem('ybToken')
    const [isShownP, setIsShownP] = useState(true)
    const [instagram, setInstagram] = useState('')
    const [twitter, setTwitter] = useState('')
    const [facebook, setFacebook] = useState('')
    const [load, setLoad] = useState(false)
    const [checked, setChecked] = useState(false)
    const user = JSON.parse(localStorage.getItem('ybUser'))
    console.log(token)
    const { edit, setEdit } = useContext(ybcontext)
    const [img, setImg] = useState((JSON.parse(localStorage.getItem('ybUser')))?.profileImage)
    const [json, setJson] = useState({
        username: (JSON.parse(localStorage.getItem('ybUser'))).username,
        email: (JSON.parse(localStorage.getItem('ybUser'))).email,
        skills: chips,
        isExpert: checked,
        profileImage: img,
        bio: (JSON.parse(localStorage.getItem('ybUser')))?.bio,
        descriptorTitle: (JSON.parse(localStorage.getItem('ybUser')))?.descriptorTitle,
        socialHandles: [
            {
                name: 'instagram',
                link: instagram
            },
            {
                name: 'twitter',
                link: twitter
            },
            {
                name: 'facebook',
                link: facebook
            }
        ]
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setJson({ ...json, [name]: value });
        console.log({ ...json, [name]: value })
    }

    async function getImageFileObject(img, setObj) {
        // console.log(img, 'file');
        let form2Data = new FormData()
        form2Data.append('files', img.file);
        // console.log(img.file, token)
        const res = await uploadImg(form2Data, token)
        setObj(res.data.urls[0])
    }
    function runAfterImageDelete(file) {
        // console.log({ file })
    }


    useEffect(() => {
        const func = async () => {
            setDetails(JSON.parse(localStorage.getItem('ybUser')))
            setExpAgreements(JSON.parse(localStorage.getItem('ybUser'))?.agreements.filter((agg) => agg.user1 === JSON.parse(localStorage.getItem('ybUser'))._id))
        }
        func()
    }, [edit])

    useEffect(() => {
        setJson({
            ...json,
            profileImage: img,
            skills: chips,
            isExpert: checked,
            socialHandles: [
                {
                    name: 'instagram',
                    link: instagram
                },
                {
                    name: 'twitter',
                    link: twitter
                },
                {
                    name: 'facebook',
                    link: facebook
                }
            ]
        })
    }, [chips, instagram, facebook, twitter, img, checked])

    const save = async () => {
        setLoad(true)
        await updateMe(json)
            .then((res) => {
                console.log(res)
                localStorage.setItem('ybUser', JSON.stringify(res.data))
                setDetails(res.data)
                setEdit(false)
                setLoad(false)
                successHandler('Profile updated successfully')
            })
    }

    console.log(json)
    console.log(details)

    return (
        <>
            {edit ? details &&
                <>
                    <Grid container columnSpacing={4} sx={{ borderBottom: '2px solid #E9E9E9', paddingBottom: '2%' }}>
                        <Grid item md={1.5}>
                            {/* <CardMedia component='img' image={details.profileImage ? details.profileImage : userImg} sx={circularImage} /> */}
                            <Box sx={{ display: { md: 'flex', sm: 'flex', xs: 'none' }, width: '100px', height: '100px', objectFit: 'cover', backgroundImage: `url("${img ? img : details.profileImage}")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                                <ImageUploader
                                    style={{ borderRadius: '10%', width: '100%', height: '100%', objectFit: 'cover', backgroundColor: 'transparent' }}
                                    onFileAdded={(img) => getImageFileObject(img, setImg)}
                                    onFileRemoved={(img) => runAfterImageDelete(img)} />
                            </Box>
                        </Grid>
                        <Grid item md={7.5} sx={df_jfs_ac_fdc}>
                            <Typography variant='h4' sx={bold_name}>{details.username}</Typography>

                        </Grid>
                        <Grid item md={3} sx={df_jc_ac}>
                            <p style={ptag}>I'm not an Expert</p>
                            <Switch
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                            />
                            <p style={ptag}>I'm an Expert</p>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: '2%' }}>
                        <Typography variant='p' sx={{ ...bold_name }}>Account information</Typography>
                    </Box>
                    <Grid container sx={{ marginTop: '2%' }}>
                        <Grid item md={2} >
                            <p style={{ ...df_jfs_ac, height: '100%' }}>Username</p>
                        </Grid>
                        <Grid item md={10}>
                            <TextField value={json.username} name='username' onChange={handleChange} placeholder={details.username} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%' }}>
                        <Grid item md={2}>
                            <p style={{ ...df_jfs_ac, height: '100%' }}>Email</p>
                        </Grid>
                        <Grid item md={10}>
                            <TextField value={json.email} name='email' onChange={handleChange} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%' }}>
                        <Grid item md={2}>
                            <p style={{ ...df_jfs_ac, height: '100%' }}>Skills</p>
                        </Grid>
                        <Grid item md={10}>
                            <TagsInput
                                value={chips}
                                onChange={setChips}
                                name="skills"
                                placeHolder="enter skills"
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%' }}>
                        <Grid item md={2}>
                            <p style={{ ...df_jfs_ac, height: '100%' }}>Descriptor text</p>
                        </Grid>
                        <Grid item md={10}>
                            <TextField name='descriptorTitle' value={json.descriptorTitle} onChange={handleChange} placeholder={!json?.descriptorTitle && 'Describe yourself'} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%', paddingBottom: '2%', borderBottom: '2px solid #E9E9E9' }}>
                        <Grid item md={2}>
                            <p style={{ ...df_jfs_ac, height: '100%' }}>Bio</p>
                        </Grid>
                        <Grid item md={10}>
                            <TextField name='bio' multiline value={json.bio} onChange={handleChange} rows={4} placeholder={details?.bio ? details?.bio : 'Tell the world about yourself'} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: '3%' }}>
                        <Typography variant='p' sx={{ ...bold_name }}>Social media</Typography>
                    </Box>
                    <Grid container sx={{ marginTop: '2%', paddingBottom: '2%' }}>
                        <Grid item md={2} sx={df_jfs_ac}>
                            <Icon icon="basil:instagram-solid" width={32} height={32} color='#272727' />
                        </Grid>
                        <Grid item md={10}>
                            <TextField value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder='Paste link here' sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%', paddingBottom: '2%' }}>
                        <Grid item md={2} sx={df_jfs_ac}>
                            <Icon icon="mingcute:twitter-fill" width={32} height={32} color='#272727' />
                        </Grid>
                        <Grid item md={10}>
                            <TextField value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder='Paste link here' sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: '2%', paddingBottom: '2%' }}>
                        <Grid item md={2} sx={df_jfs_ac}>
                            <Icon icon="mdi:facebook" width={32} height={32} color='#272727' />
                        </Grid>
                        <Grid item md={10}>
                            <TextField value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder='Paste link here' sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                </>
                : details &&
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
                            {details.skills.length !== 0 ? <><Stack direction='row' sx={{ paddingTop: '2%' }} spacing={1} useFlexGap flexWrap="wrap">
                                {
                                    details.skills.map((skill, index) => {
                                        return <Chip key={index} label={skill} size="small" />
                                    })
                                }
                            </Stack></> : <Typography variant='h6' sx={ptag}>Add skills to your profile</Typography>}
                        </Grid>
                        <Grid item md={8} sx={{ paddingTop: '2%' }}>
                            <Typography variant='h6' sx={{ ...bold_name }}>{details.descriptorTitle}</Typography>
                            <p style={{ ...ptag, paddingTop: '2%', paddingBottom: '5%' }}>{details.bio}</p>



                            <BasicTabs details={details} setDetails={setDetails} />
                        </Grid>
                    </Grid>
                </>
            }
            {edit ? <Fab onClick={save} sx={{ ...fabStyle, backgroundColor: '#3770FF', color: 'white' }} >
                {load ? <CircularProgress size={28} sx={circularprog} /> : <Icon icon="ri:save-fill" width={24} height={24} />}
            </Fab> : <Fab onClick={() => setEdit(true)} sx={{ ...fabStyle, backgroundColor: '#3770FF', color: 'white' }} >
                <Icon icon="fluent:edit-16-filled" width={24} height={24} />
            </Fab>}
        </>
    )
}
