import httpcommon from "../httpcommon"

export const videoGet = async() => {
    let res = await httpcommon.get(`/admin/`)
    return res
}