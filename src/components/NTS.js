import React from 'react'
import giphy2 from '../images/nts.gif'
import { btn_connect, ptag } from '../theme/CssMy'
import { Button } from '@mui/material'

export default function NTS() {
    return (
        <>
            <img src={giphy2} style={{ width: '200px' }} />
            <p style={{...ptag, margin:'0', padding:'0', textAlign:'center', marginBottom:'5%', fontSize:'20px', fontWeight:'bold'}}>This website is only supported on laptops/desktops. Mobile Apps are coming soon</p>
            <Button onClick={() => window.open('https://myreeldream.ai/', '_blank')} sx={{...btn_connect, width:'auto'}}>Go back to the landing page</Button>
        </>
    )
}
