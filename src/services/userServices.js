import httpcommon from "../httpcommon"

export const updateMe = (data, token) => {
    return httpcommon.put(`/user/me`, data, {
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    });
};

export const getUsers = () => {
    return httpcommon.get(`/user/users?expert=yes`)
}

export const getExpertById = (id) => {
    let res = httpcommon.get(`/user/users/${id}`)
    return res
}

export const getMyAgreements = async id => {
    try {
      let res = await httpcommon.get(`/user/agreements/${id}`,{
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    });
      return res;
    } catch (error) {
      console.log('Error in getting My Agreement:-', error.message);
      return [];
    }
  };