import { contractAddress } from "../Constants";
import httpcommon from "../httpcommon";

export const uploadJSON = async data => {
    try {
        let res = await httpcommon.post(`/ipfs/json`, data, {
            headers: {
                Authorization: localStorage.getItem('ybToken')
            }
        });
        return res.data.url;
    } catch (error) {
        console.log(error);
    }
};

//   export const getUserAgreementsFromContract = async (contract, address) => {
//     try {
//       let agreements = await contract.methods.getUserAgreements(address).call();
//       return agreements;
//     } catch (error) {
//       console.log('Agreemente fetch from contract Failed:- ', error.message);
//     }
//   };

export const createAgreement = async (
    me,
    expert,
    nameofAgreement,
    startsAt,
    createdAt,
    mainContract,
    executeMetaTx,
    web3,
    contract1
) => {
    try {
        let obj = {
            name: nameofAgreement,
            startsAt,
            createdAt,
            user1: me,
            user2: expert,
        };

        let uri = await uploadJSON(obj);
        console.log('---Obj uploaded on IPFS:- ', uri);
        //let contract = new web3.eth.Contract(AskGPT);
        const data = mainContract.methods
            .createAgreement(uri, startsAt, nameofAgreement, expert.walletAddress)
            .encodeABI();
        console.log('---Abi encoded');
        let res = await executeMetaTx(data, contractAddress, me, contract1);
        // if (!res) throw Error('Meta Tx Failed :(');
        console.log('---Meta Tx successful');
        console.log(JSON.stringify(res));
        console.log('To DB: ', {
            name: nameofAgreement,
            startsAt,
            user1: me._id,
            user2: expert._id,
        });
        let apiRes = await httpcommon.post(`/user/agreement/`, {
            name: nameofAgreement,
            startsAt,
            user1: me._id,
            user2: expert._id,
            agreementUri: uri,
        }, {
            headers: {
                Authorization: localStorage.getItem('ybToken')
            }
        });
        console.log('---Agreement Created in DB', apiRes);
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};