import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ModalOneContent from './ModalOneContent';
import { useContext } from 'react';
import ModalTwoContent from './ModalTwoContent';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import ModalThreeContent from './ModalThreeContent';
import { useNavigate } from 'react-router';
import { ybcontext } from '../../context/MainContext';
import ModalVideoContent from './ModalVideoContent';
import { uploadImg } from '../../services/ipfsServicesApi';
import { updateMe } from '../../services/userServices';
import { CircularProgress } from '@mui/material';
import { btn, btn_connect, circularprog } from '../../theme/CssMy';
import { useState } from 'react';
import { OnboardingButton } from './OnboardingButton';
import ModalIntro from './ModalIntro';
import ModalInModal from './ModalInModal';

const steps = ['Connect Wallet', '30s video intro', 'Basic details', 'What to expect', 'Complete your profile'];

export default function HorizontalLinearStepper({ open, setOpen }) {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const { user, setUser, account, setAccount, edit, setEdit } = useContext(ybcontext)
    const [video, setVideo] = React.useState(null)
    const [load, setLoad] = React.useState(false)
    const [yes, setYes] = useState(false)
    const [open2, setOpen2] = useState(false)

    const { deactivate } = useWeb3React()
    const isStepOptional = (step) => {
        return step === 4;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        setOpen(false)
        navigate('/')
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    const videoUplaod = async () => {
        setLoad(true)
        let form2Data = new FormData();
        form2Data.append('files', video, video.name);
        console.log(form2Data);
        let res = await uploadImg(form2Data);
        console.log('---Uploaded PDF', res.data.urls);
        let res2 = await updateMe({ videoIntro: res.data.urls[0], videoVisibility: yes })
        localStorage.setItem('ybUser', JSON.stringify(res2.data))
        setUser(res2.data)
        setActiveStep(activeStep + 1)
        setVideo(null)
        setLoad(false)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography sx={{ fontSize: '12px' }} variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label}  {...stepProps}>
                            <StepLabel sx={{ fontSize: '12px' }} {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <React.Fragment>
                {
                    activeStep === 0 ? <ModalOneContent setActiveStep={setActiveStep} activeStep={activeStep} />
                        : activeStep === 1 ? <ModalVideoContent setActiveStep={setActiveStep} activeStep={activeStep} video={video} setVideo={setVideo} yes={yes} setYes={setYes} />
                            : activeStep === 2 ? <ModalTwoContent setActiveStep={setActiveStep} activeStep={activeStep} />
                                : activeStep === 3 ? <ModalIntro /> : <ModalThreeContent />
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    {
                        activeStep !== 0 ? <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={() => {
                                deactivate();
                                localStorage.clear();
                                setUser({});
                                setAccount('')
                                setActiveStep(0);
                            }}
                            sx={{ mr: 1 }}
                        >
                            Disconnect wallet
                        </Button> : ""
                    }
                   {activeStep === 0 && <Button onClick={handleSkip}>
                        {activeStep === 0 && 'Back'}
                    </Button>}
                    {activeStep === 0 && <OnboardingButton />}
                    {
                        activeStep === 0 && <Button onClick={() => setOpen2(true)} sx={{...btn_connect, width:'auto', marginLeft:'2%'}}>New to MetaMask?</Button>
                    }
                    <Box sx={{ flex: '1 1 auto' }} />

                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        {isStepOptional(activeStep) && 'Skip'}
                    </Button>

                    {
                        activeStep === 1 && load ? <CircularProgress size={30} sx={circularprog} /> : <Button onClick={() => videoUplaod()} disabled={!video} >{activeStep === 1 && 'Upload'}</Button>
                    }
                    {
                        activeStep === 3 && <Button sx={btn} onClick={() => setActiveStep(activeStep + 1)} >Next</Button>
                    }
                    {activeStep === steps.length - 1 && <Button onClick={() => {
                        setEdit(true)
                        setOpen(false)
                        navigate('/profile')
                    }}>
                        {activeStep === steps.length - 1 ? 'Complete Your Profile' : ''}
                    </Button>}
                </Box>
            </React.Fragment>
<ModalInModal open={open2} setOpen={setOpen2} />
        </Box>
    );
}
