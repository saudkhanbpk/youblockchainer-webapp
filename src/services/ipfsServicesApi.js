import httpcommon from "../httpcommon";


export const uploadImg = (data) => {
    return httpcommon.post(`/ipfs/img`, data, {
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    });
};

export const uploadPics = async imgs => {
    try {
        let data = new FormData();
        imgs.forEach(element => {
            data.append('files', element);
        });
        let urls = await httpcommon.post(`/ipfs/img`, data);
        // console.log(urls);
        return urls.urls;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const uploadJson = (data) => {
    return httpcommon.post(`/ipfs/json`, data, {
        headers: {
            Authorization: localStorage.getItem('ybToken')
        }
    });
};
