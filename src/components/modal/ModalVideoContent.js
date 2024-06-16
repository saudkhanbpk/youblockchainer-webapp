import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'
import VideoRecorder from 'react-video-recorder'
import { df_jfs_ac, ptag } from '../../theme/CssMy'
import shorthash from 'shorthash';
import { updateMe } from '../../services/userServices';


export default function ModalVideoContent({ video, setVideo, yes, setYes }) {


    return (<>

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
                    <p style={{ ...ptag, textAlign: 'center',fontWeight:'bold' }}>Record a 30 sec video selfie to participate in auditions</p>
                </></div>}
            />
        </div>
        <Box sx={{ ...df_jfs_ac }}>
            <Checkbox
                checked={yes}
                onChange={() => setYes(!yes)}
            />
            <p style={ptag}>Make your introduction video visible on your profile page</p>
        </Box>
    </>
    )
}
