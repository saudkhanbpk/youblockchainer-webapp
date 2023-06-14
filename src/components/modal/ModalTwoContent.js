import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as Yup from "yup";
import { Formik, Form, yupToFormErrors } from "formik";
import TextField from './TextField/TextField'
import { useContext } from 'react';
import { CardMedia, Checkbox, Grid } from '@mui/material';
import './modal.css'
import logo from '../../images/logo.png'
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, height } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { updateMe } from '../../services/userServices';
import { ybcontext } from '../../context/MainContext';
import { df_jc_ac, df_jfs_ac, ptag } from '../../theme/CssMy';

const INITIAL_FORM_STATE = {
    email: "",
    country:''
};

const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Required"),
    country: Yup.string()
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const btn = {
    color: '#BC09C7',
    width: '100%',
    height: '100%'
}
function ModalTwoContent({ setActiveStep, activeStep }) {
    const { user, setUser, account, setAccount, token } = useContext(ybcontext)
    const [check, setCheck] = useState(false)

    const handleSubmit = async (values) => {
        // console.log(token)
        await updateMe({ email: values.email, country:values.country }, token)
            .then((res) => {
                // console.log(res.data);
                localStorage.setItem("ybUser", JSON.stringify(res.data))
                setUser(res.data)
                setCheck(true);
                setTimeout(() => {
                    setActiveStep(activeStep + 1);
                }, 2000);
            })
            .catch((err) => {
                // console.log(values);
                console.log(err);
            })
    }

    return (
        <Grid sx={{ margin: '5% 0' }}>
            <Box sx={{ padding: '0 20%', marginBottom: '2%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CardMedia component='img' image={logo} sx={{ width: '100px' }} />
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}>Enter your email to stay updated for exciting offers!</Typography>
            </Box>
            <Formik
                initialValues={{ ...INITIAL_FORM_STATE }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values) => handleSubmit(values)}
            >
                <Form >
                    <Grid container sx={{ width: '100%' }}>
                        <Grid item md={11} sm={11} xs={11}>
                            <TextField name='email' placeholder={user.email ? user.email : 'Email'} />
                            <TextField name='country' placeholder={'Enter your country'} />
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                            <Button sx={btn} type='submit'>
                                {
                                    check ? <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                    </svg> : <CheckCircleIcon sx={{ width: '100%', height: '100%', color: '#D6D6D6' }} />
                                }
                            </Button>

                        </Grid>
                    </Grid>
                </Form>
            </Formik>
        </Grid>
    )
}

export default ModalTwoContent