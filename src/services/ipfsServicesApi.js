import httpcommon from "../httpcommon";


export const uploadImg = (data) => {
    console.log(data)
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
        console.log(data)
        let urls = await httpcommon.post(`/ipfs/img`, data, {
            headers: {
                Authorization: localStorage.getItem('ybToken'),
                "Content-type": "multipart/form-data"
            }
        });
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
