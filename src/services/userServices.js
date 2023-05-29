import httpcommon from "../httpcommon"

export const updateMe = (data, token) => {
    return httpcommon.put(`/user/me`, data, {
        headers: {
            Authorization: token
        }
    });
};

export const getUsers = () => {
    return httpcommon.get(`/user/users?expert=yes`)
}