import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ModalOneContent from './ModalOneContent';
import ModalTwoContent from './ModalTwoContent';
import ModalThreeContent from './ModalThreeContent';
import { useNavigate } from 'react-router';

const steps = ["Don't Have an Organisation?", 'Fill Details and Create'];

export default function HorizontalLinearStepper({ open, setOpen }) {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const isStepOptional = (step) => {
        // return step === 2;
    };
    // console.log(activeStep)
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleSkip = () => {
        setOpen(false)
        navigate('/')
    };

    useEffect(() => {
        localStorage.getItem("ybBrand") !== 'undefined' && JSON.parse(localStorage.getItem("ybBrand")) ? setOpen(false) : setOpen(true)
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <>
                {
                    activeStep === 0 ? <ModalOneContent setActiveStep={setActiveStep} activeStep={activeStep} /> : activeStep === 1 ? <ModalTwoContent setActiveStep={setActiveStep} activeStep={activeStep} open={open} setOpen={setOpen} /> : <ModalThreeContent />
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    {activeStep === 0 && <Button onClick={handleSkip}>
                        Back
                    </Button>}
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                            Skip
                        </Button>
                    )}


                    {activeStep === 0 ? <Button onClick={() => setActiveStep(activeStep + 1)}>
                        Create organisation
                    </Button> : ''}
                </Box>
            </>
        </Box>
    );
}
