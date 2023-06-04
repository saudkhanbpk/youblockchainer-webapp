import * as React from 'react';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { Box, CircularProgress, Grid, TextField } from '@mui/material';
import './modal.css'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ybcontext } from '../../context/MainContext';
import { newBrand } from '../../services/brandsApi';
import { uploadImg } from '../../services/ipfsServicesApi';
import { btn, btn_connect, circularprog } from '../../theme/CssMy';
import { TagsInput } from 'react-tag-input-component';

function ModalTwoContent({ setActiveStep, activeStep, open, setOpen }) {
    const { user, setUserBrand, token, userBrand } = useContext(ybcontext)
    const [loading, setLoading] = useState(false)
    const [chips, setChips] = useState([])

    const handleAddChip = (newChips) => {
        setChips([...chips, newChips])
    }
    const handleDeleteChip = (chip, index) => {
        console.log(index)
        setChips(chips.splice(index, 1))
    }
    console.log(chips)
    const [brand, setBrand] = useState({ name: '', nickName: '', walletAddress: user.walletAddress, description: '', secondaryImg: '', img: '' })
    const navigate = useNavigate()
    // console.log(brand);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBrand({ ...brand, [name]: value });
    }

    const createBrand = async () => {
        setLoading(true)
        await newBrand({ name: brand.name, skills: chips, nickname: brand.nickName, walletAddress: brand.walletAddress.toLowerCase(), description: brand.description, img: brand.img, secondaryImg: brand.secondaryImg })
            .then((res) => {
                // console.log(res.data);
                setUserBrand(res.data ? res.data : null)
                // console.log(res.data)
                localStorage.setItem("ybBrand", JSON.stringify(res.data ? res.data : null))
                setActiveStep(activeStep + 1)
                setLoading(false)
                setOpen(false)
                navigate('/')
                // successHandler('Brand created successfully')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    console.log(userBrand)

    return (
        <Grid container spacing={2} sx={{ padding: '2% 0' }}>
            <Grid item md={12} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Wallet Address</p>
                <TextField sx={{ width: '100%' }} name='walletAddress' value={brand.walletAddress} placeholder={user.walletAddress} disabled />
            </Grid>
            <Grid item md={6} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Enter name for your brand</p>
                <TextField sx={{ width: '100%' }} name='name' value={brand.name} placeholder='Name' onChange={handleChange} />
            </Grid>
            <Grid item md={6} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Enter nickname for your brand</p>
                <TextField sx={{ width: '100%' }} name='nickName' value={brand.nickName} placeholder='Nickname' onChange={handleChange} />
            </Grid>
            <Grid item md={12} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Description</p>
                <TextField sx={{ width: '100%' }} name='description' value={brand.description} onChange={handleChange} placeholder='Description' multiline rows={3} />
            </Grid>
            <Grid item md={12} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Add skills</p>
                <TagsInput

                    value={chips}
                    onChange={setChips}
                    name="skills"
                    placeHolder="enter skills"
                />
            </Grid>
            <Grid item md={6} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Image</p>
                <TextField sx={{ width: '100%' }}
                    type="file"
                    name='img'
                    onChange={async (e) => {
                        e.preventDefault()
                        let form2Data = new FormData()
                        console.log(e.target.files[0])
                        form2Data.append('files', e.target.files[0]);
                        // const headers = { 'content-type': 'multipart/form-data' }
                        const res = await uploadImg(form2Data, token)
                        setBrand({ ...brand, img: res.data.urls[0] })
                    }}
                />
            </Grid>
            <Grid item md={6} sx={{ width: '100%' }}>
                <p style={{ fontSize: '12px' }}>Secondary image</p>
                <TextField sx={{ width: '100%' }}
                    type="file"
                    onChange={async (e) => {
                        e.preventDefault()
                        let form2Data = new FormData()
                        form2Data.append('files', e.target.files[0]);
                        const res = await uploadImg(form2Data, token)
                        setBrand({ ...brand, secondaryImg: res.data.urls[0] })
                    }}
                />
            </Grid>
            <Grid item md={2}><Button onClick={() => navigate('/')} >
                Back
            </Button>
            </Grid>
            <Grid item md={7} />
            <Grid item md={3}>
                {
                    loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}> <CircularProgress size={30} sx={circularprog} /> </Box>
                        : <Button onClick={() => createBrand()} sx={btn_connect}>
                            Create Brand
                        </Button>
                }
            </Grid>
        </Grid>
    )
}

export default ModalTwoContent