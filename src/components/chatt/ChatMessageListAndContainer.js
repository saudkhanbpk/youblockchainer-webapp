import { Avatar, ChatContainer, Conversation, ConversationHeader, ConversationList, Message, MessageInput, MessageList, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';
import { Box, Grid, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { createRoom, getAllRooms, getRoom, searchUsers } from '../../services/ChatApi';
import userImg from '../../images/user.png'
import { df_jc_ac, ptag, textField } from '../../theme/CssMy';
import { Icon } from '@iconify/react';
import FuzzySearch from 'fuzzy-search';
import { useNavigate, useParams } from 'react-router';
import ChatSideMessages from './ChatSideMessages';
import ChatOpen from './ChatOpen';

export default function ChatMessageListAndContainer() {
    const params = useParams()
    const navigate = useNavigate()
    const id = params.id
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([])
    const [allRooms, setAllRooms] = useState([])
    const [chat, setChat] = useState(null)
    const token = localStorage.getItem('ybToken')
    const [search, setSearch] = useState('')
    const [imgLoad, setImgLoad] = useState(false)
    const [creator, setCreator] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const searchUsersAsync = async () => {
            try {
                setSearchLoading(true);
                const results = await searchUsers(search);
                setSearchResults(results.data);
                setSearchLoading(false);
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchLoading(false);
            }
        };

        if (search.trim() !== '') {
            searchUsersAsync();
        } else {
            setSearchResults([]);
        }
    }, [search]);


    useEffect(() => {
        const func = async () => {
            const id = params.id
            let res = await getAllRooms(localStorage.getItem('ybToken'))
            console.log(res)
            setRooms(res.data)
            setAllRooms(res.data)
        }
        func()
    }, [])

    const searcher = new FuzzySearch(allRooms, ['p2.username'], {
        caseSensitive: false,
    });

    useEffect(() => {
        const func = async () => {
            const id = params.id
            let res = await getRoom(id)
            setChat(res.data)
            console.log(res)
        }
        func()
    }, [id])

    useEffect(() => {
        const res = searcher.search(search)
        setRooms(res)
        console.log(res)
    }, [search])

    useEffect(() => {
        chat?.p1?._id === (JSON.parse(localStorage.getItem('ybUser')))._id && setCreator(true)
    }, [id])

    return <Grid container sx={{ height: '82vh', width: '100%' }}>
        <Grid item md={3} sx={{ backgroundColor: 'white', padding: '1%', borderRadius: '10px 0 0 10px' }}>
            {/* <ConversationList>
                <TextField size='small' sx={textField} value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user' InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon icon="ic:round-search" width={22} height={22} /></InputAdornment>,
                }} />
                {
                    rooms.map((room, index) => {
                        console.log(room, creator, creator ? room.p2.profileImage ? room.p2.profileImage : userImg : room.p1.profileImage ? room.p1.profileImage : userImg)
                        return <Conversation style={id === room._id ? { backgroundColor: '#F6F6F6', borderRadius: '10px' } : { width: '100%' }} key={index} onClick={() => navigate(`/chat/${room._id}`)}>
                            <Conversation.Content>
                                <Box sx={imgLoad ? { display: 'flex', height: '100%', alignItems: 'center' } : { display: 'none' }}>
                                    <Avatar src={JSON.parse(localStorage.getItem('ybUser'))._id === room.p1._id ? room.p2.profileImage ? room.p2.profileImage : userImg : room.p1.profileImage ? room.p1.profileImage : userImg} onLoad={() => setImgLoad(true)} style={{ marginRight: '5%' }} name={room.p2.username} />
                                    <Box>
                                        <strong style={{ fontFamily: 'Poppins' }}>
                                            {JSON.parse(localStorage.getItem('ybUser'))._id === room.p1._id ? room.p2.username : room.p1.username}
                                        </strong>
                                        <p style={ptag}>{JSON.parse(localStorage.getItem(room._id))?.[0] ? JSON.parse(localStorage.getItem(room._id))?.[0]?.direction === 'outgoing' ?
                                            `You : ${JSON.parse(localStorage.getItem(room._id))?.[JSON.parse(localStorage.getItem(room._id)).length - 1].message}` :
                                            `${JSON.parse(localStorage.getItem('ybUser'))._id === room.p1._id ? room.p2.username : room.p1.username} : ${JSON.parse(localStorage.getItem(room._id))?.[JSON.parse(localStorage.getItem(room._id)).length - 1]?.message}` : 'Say Hi'}</p>
                                    </Box>
                                </Box>
                                {!imgLoad && <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <Skeleton animation="wave" variant="circular" width={45} height={45} />
                                    <Box sx={{ width: '75%', marginLeft: '5%' }}>
                                        <Typography component="div" variant='h6' sx={{ width: '100%' }}>
                                            <Skeleton />
                                        </Typography>
                                        <Typography component="div" variant='caption' sx={{ width: '100%' }}>
                                            <Skeleton />
                                        </Typography>
                                    </Box>
                                </Box>
                                }
                            </Conversation.Content>
                        </Conversation>
                    })
                }

            </ConversationList> */}
            <ConversationList>
                <TextField size='small' sx={textField} value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user' InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon icon="ic:round-search" width={22} height={22} /></InputAdornment>,
                }} />
                {
                    searchLoading ? (
                        <Skeleton animation="wave" variant="circular" width={45} height={45} />
                    ) : (
                        searchResults.map((user, index) => (
                            <Conversation key={index} >
                                <Conversation.Content>
                                    <Avatar src={user.profileImage ? user.profileImage : userImg} style={{ marginRight: '5%' }} name={user.username} />
                                    <Box>
                                        <strong style={{ fontFamily: 'Poppins' }}>{user.username}</strong>
                                        <p style={ptag}>{/* Display last message or placeholder */}</p>
                                    </Box>
                                </Conversation.Content>
                            </Conversation>
                        ))
                    )
                }
                {
                    // Render all rooms if search results are empty and not loading
                    !searchLoading && searchResults.length === 0 && rooms.map((room, index) => (
                        <Conversation key={index} onClick={() => navigate(`/chat/${room._id}`)}>
                            {/* Render Conversation content as before */}
                        </Conversation>
                    ))
                }
            </ConversationList>

        </Grid>
        <Grid item md={9} sx={{ borderRadius: '0 10px 10px 0' }}>
            {id && chat ? <ChatSideMessages chat={chat} messages2={messages} setMessages={setMessages} creator={JSON.parse(localStorage.getItem('ybUser'))._id === chat?.p1._id} /> : <ChatOpen />}
        </Grid>
    </Grid >
}
