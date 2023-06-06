import { Typography } from '@mui/material'
import React from 'react'
import VideoRecorder from 'react-video-recorder'
import { ptag } from '../../theme/CssMy'
import shorthash from 'shorthash';


export default function ModalVideoContent({ video, setVideo }) {
    return (
        <div style={{ height: '400px' }}>
            <VideoRecorder
                // chunkSize={250}
                constraints={{
                    audio: true,
                    video: true
                }}
                videoControlsList="nodownload"
                showReplayControls
                onRecordingComplete={(videoBlob) => {
                    const pdfFile = new File([videoBlob], `Video_${shorthash.unique((JSON.parse(localStorage.getItem('ybUser')).walletAddress))}`);
                    console.log(pdfFile)
                    setVideo(pdfFile)
                }}
                countdownTime={3000}
                dataAvailableTimeout={500}
                isFlipped
                renderDisconnectedView={() => <div style={{ color: 'black', marginBottom: '2%', padding: '0 15%' }} ><>
                    <Typography variant='h6' sx={{ textAlign: 'center' }}>Welcome to our website!</Typography>
                    <p style={{ ...ptag, textAlign: 'center' }}>To complete your registration successfully, we kindly
                        request that you provide us with a video interview. This interview will help other
                        user to get to know you better and understand your skills and qualifications.</p>
                </></div>}
            />
        </div>
    )
}
