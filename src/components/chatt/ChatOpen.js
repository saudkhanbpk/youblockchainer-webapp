import { CardContent, CardMedia } from '@mui/material'
import React from 'react'
import { card, df_jc_ac, df_jc_ac_fdc, ptag } from '../../theme/CssMy'
import chatop from '../../images/chatOpen.png'
import { Icon } from '@iconify/react'

export default function ChatOpen() {
    return (
        <>
            <CardContent sx={{ ...card, ...df_jc_ac_fdc, height: '98%', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
                <CardMedia component='img' image={chatop} sx={{ width: '50vh', height: '50vh' }} />
                <div style={df_jc_ac}>
                    <Icon style={{ color: '#6A707F' }} icon="ic:round-lock" />
                    <p style={ptag}>End-to-end encrypted</p>
                </div>
            </CardContent>
        </>
    )
}
