import { ENDPOINTS } from '../api/apiRoutes'
import httpcommon from '../httpcommon';

export const askGPT = async prompt => {
    try {
        return (await httpcommon.post(ENDPOINTS.ASK_GPT, { prompt }, {
            headers: {
                Authorization: localStorage.getItem('ybToken')
            }
        })).data;
    } catch (error) {
        console.log('Ask GPT Error:- ', error.message);
        return '';
    }
};

export const getAllRooms = async (token) => {
    try {
        let res = await httpcommon.get(`/chat`, {
            headers: {
                Authorization: token
            }
        }
        );
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createRoom = async (id, token) => {
    try {
        let res = await httpcommon.post(ENDPOINTS.ROOM_ACTIONS, { receiver: id }, {
            headers: {
                Authorization: localStorage.getItem('ybToken')
            }
        }
        );
        //console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getRoom = async (id) => {
    let res = await httpcommon.get(`/chat/rooms/${id}`, {
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    })
    return res
}

export const getAllChats = async (id, token) => {
    try {
        let res = (await httpcommon.get(`/chat/room/${id}`, {
            headers: {
                Authorization: localStorage.getItem('ybToken')
            }
        }
        )).data;
        //console.log('Chats:- ', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};
