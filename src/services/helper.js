import httpcommon from '../httpcommon'
import { ENDPOINTS } from '../api/apiRoutes'
import Web3 from 'web3'


export const backendtoChatScope = (message, userId, user, expert) => {
    // console.log(userId, message.sender._id, 'hey')
    let temp = {
        message: message.chatMessage,
        direction: userId === message.sender._id ? 'outgoing' : 'incoming',
        image: userId === message.sender._id ? user.profileImage : expert.profileImage,
        time: new Date(message.createdAt)
    }
    return temp
}

export const executeMetaTx = async (data, targetAddress, user, contract1) => {
    try {
        let provider = window.ethereum;
        const web3 = new Web3(provider);
        let from = (JSON.parse(localStorage.getItem('ybUser'))).walletAddress;
        console.log('---Caller Wallet:- ', from);
        const nonce = await contract1.methods.getNonce(from).call();
        console.log('---Got Nonce from Forwarder');
        const tx = {
            from,
            to: targetAddress, // Target contract address (AskGPT or Agreement subcontract)
            value: 0,
            nonce,
            data,
        };
        const digest = await contract1.methods
            .getDigest(tx.from, tx.to, tx.value, tx.nonce, tx.data)
            .call();
        console.log('---Got digest from Forwarder:- ', digest);
        await web3.eth.personal.sign(digest, from).then(async (signature) => {
            console.log('---Transaction Signed');
            await httpcommon.post(`/user/metatx`, {
                tx,
                signature,
            }, {
                headers: {
                    Authorization: localStorage.getItem('ybToken')
                }
            }).then((res) => {
                console.log('---Meta Tx Status :- ', res);
                if (res.data.success) return res.data.data;
                return res.data.success;

            }).catch((e) => console.log(e))

        }).catch((e) => console.log(e))
    } catch (error) {
        console.log('Meta Tx creation error:- ', error.message);
        //notifyEVMError(error)
    }
};