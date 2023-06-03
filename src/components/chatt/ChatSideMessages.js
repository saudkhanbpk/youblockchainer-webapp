import { ChatContainer, ConversationHeader, Message, MessageInput, MessageList } from '@chatscope/chat-ui-kit-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import userImg from '../../images/user.png'
import { useWebSockets } from '../../services/useWebSocket';
import { ybcontext } from '../../context/MainContext';
import { useParams } from 'react-router';
import { bold_name, btn_hire, df_jc_ac, df_jfs_ac, df_jfs_ac_fdc, ptag } from '../../theme/CssMy';
import moment from 'moment';
import { Avatar, Button, Typography } from '@mui/material';
import AgreementModal from '../agreement/AgreementModal';


export default function ChatSideMessages({ chat, messages2, setMessages }) {
    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [msgInputValue, setMsgInputValue] = useState("");
    const { user } = useContext(ybcontext)
    const params = useParams()
    const id = params.id
    const { messages, send, status } = useWebSockets({
        roomId: id,
        enabled: chat ? true : false,
        sender: (JSON.parse(localStorage.getItem('ybUser')))._id,
        expert: chat?.p2
    });

    const handleSend = message => {
        // setMessages([...messages, {
        //     message,
        //     direction: 'outgoing'
        // }]);
        send('Text', message);
        console.log('onsendcalled')
        setMsgInputValue("");
        inputRef.current.focus();
    };


    return (
        <>
            {messages && <ChatContainer style={{ height: '78vh', paddingBottom: '2%', backgroundColor: 'transparent' }}>
                <ConversationHeader>
                    <ConversationHeader.Content userName={chat.p2.username} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ ...df_jfs_ac, width: '80%' }}>
                                <Avatar src={chat.p2.profileImage} />
                                <Typography sx={{ ...bold_name, marginLeft: '2%' }} variant='p'>{chat.p2.username}</Typography>
                            </div>
                            <Button onClick={() => setOpen(true)} sx={{ ...btn_hire, width: '20%' }}>Hire</Button>
                        </div>
                    </ConversationHeader.Content>
                </ConversationHeader>
                <MessageList scrollBehavior="smooth">
                    {messages.map((m, i) => <div style={{ display: 'flex', marginTop: '0.5%' }}>
                        {m.direction === 'incoming' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginRight: '1%', marginTop: '2%' }} />}
                        <Message key={i} model={m}  >
                            <Message.CustomContent >
                                {m.message}
                                {m.direction === 'outgoing' ? <p style={{ textAlign: 'right', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p> : <p style={{ textAlign: 'left', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p>}
                            </Message.CustomContent>
                        </Message>
                        {m.direction === 'outgoing' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginLeft: '1%', marginTop: '2%' }} />}
                    </div>)}
                </MessageList>
            </ChatContainer>}
            <MessageInput placeholder="Type message here" onSend={handleSend} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />

            <AgreementModal open={open} handleClose={handleClose} user={user} expert={chat?.p2} />
        </>
    )
}
