import httpcommon from "../httpcommon"

export const getBrands = () => {
    let res = httpcommon.get(`/brand/brands/search`)
    return res
}

export const getBrandById = (id) => {
    let res = httpcommon.get(`/brand/${id}`)
    return res
}

export const newBrand = (data) => {
    return httpcommon.post(`/brand/`, data, {
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    });
};

export const getUserBrand = async (add) => {
    try {
        return await httpcommon.get(`/brand/user/${add}`)
    }
    catch (e) {
        console.log(e);
        return false
    }
}