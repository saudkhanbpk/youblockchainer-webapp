import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { base } from '../Constants';
import { getAllChats } from './ChatApi';
import { useParams } from 'react-router';
import { backendtoChatScope } from './helper';

export const useWebSockets = ({ roomId, enabled, sender, expert }) => {
    const [messages, setMessages] = useState([]);
    const input = 'Input Chat Message';
    const output = 'Output Chat Message';
    const joinRoom = 'Join Room';
    const user = JSON.parse(sessionStorage.getItem('ybUser'))
    const params = useParams()
    const id = params.id
    console.log(roomId, enabled, sender)
    const socket = io(base);
    // socket.on('connect', () => {
    //     socket.emit(joinRoom, roomId);
    //     socket.on(output, msg => {
    //         setMessages(prev => [...prev, backendtoChatScope(msg, user._id)]);
    //     });
    // });


    socket.on('disconnect', () => {
        console.log('Socket Disconnected from server');
        socket.connect();
    });

    socket.io.on('error', console.log);
    // socket.io.on('ping', () => {
    //     console.log('---Chat Pinging');
    // });

    const send = (type, messages) => {
        if (!messages || messages.trim() === '') {
            return;
        }
        console.log(socket.connected)
        socket.emit(input, {
            //chatMessage: messages[0].text,
            chatMessage: messages,
            sender,
            type,
            roomId,
        });
    };

    const fetchFromDevice = async () => {
        try {
            let res = sessionStorage.getItem(roomId);
            // console.log(res, 'res')
            if (res === undefined) {
                return [];
            }
            return JSON.parse(res);
        } catch (error) {
            console.log(error);
        }
    };

    const getPreviousChats = async () => {
        try {
            setMessages(await fetchFromDevice());

            let prior = await getAllChats(id);
            console.log(prior, 'hey')
            prior = prior
                .map(i => backendtoChatScope(i, user._id, user, expert))
                // .sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
            setMessages(prior);
            // sessionStorage.setItem('roomId', roomId);
            sessionStorage.setItem(roomId, JSON.stringify(prior));
        } catch (e) {
            console.log('Error in getting previous chats:- ', e.message);
        }
    };

    useEffect(() => {
        getPreviousChats();
        return () => socket.disconnect();
    }, [roomId]);

    useEffect(() => {
        console.log('rendered', roomId)
    }, [])

    useEffect(() => {
        if (!enabled) {
            return;
        }
        socket.emit(joinRoom, roomId);
        console.log(socket.emit(joinRoom, roomId))
        socket.on(output, msg => {
            setMessages(prev => [...prev, backendtoChatScope(msg, user._id, user, expert)]);
        });
    }, [enabled, roomId]);
    console.log(messages)
    return {
        send,
        messages,
        status: socket.connected,
    };
};