import { ENDPOINTS } from '../api/apiRoutes'
import httpcommon from '../httpcommon';

export const askGPT = async prompt => {
    try {
        return await httpcommon.post(ENDPOINTS.ASK_GPT, { prompt });
    } catch (error) {
        console.log('Ask GPT Error:- ', error.message);
        return '';
    }
};