import moment from 'moment';
import { contractAddress } from '../Constants';
import httpcommon from '../httpcommon';
import { ethers } from 'ethers';

export const uploadJSON = async (data) => {
  try {
    let res = await httpcommon.post(`/ipfs/json`, data, {
      headers: {
        Authorization: localStorage.getItem('ybToken'),
      },
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
  contract1,
  setDetails,
  add
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
    let res = await executeMetaTx(data, contractAddress, contract1);
    if (!res) throw Error('Meta Tx Failed :(');
    else {
      console.log('---Meta Tx successful');
      console.log(JSON.stringify(res));
      console.log('To DB: ', {
        name: nameofAgreement,
        startsAt,
        user1: me._id,
        user2: expert._id,
      });
      let apiRes = (
        await httpcommon.post(
          `/user/agreement/`,
          {
            name: nameofAgreement,
            startsAt,
            user1: me._id,
            user2: expert._id,
            agreementUri: uri,
          },
          {
            headers: {
              Authorization: localStorage.getItem('ybToken'),
            },
          }
        )
      ).data;
      let user = JSON.parse(localStorage.getItem('ybUser'));
      let newagree = [...user.agreements, apiRes];
      user.agreements = newagree;
      localStorage.setItem('ybUser', JSON.stringify(user));
      console.log('---Agreement Created in DB', apiRes);
      add &&
        setDetails({ ...expert, agreements: [...expert?.agreements, apiRes] });
      return user;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getUserAgreementsFromContract = async (contract, address) => {
  try {
    let agreements = await contract.methods.getUserAgreements(address).call();
    return agreements;
  } catch (error) {
    console.log('Agreement fetch from contract Failed:- ', error.message);
  }
};

export const getScriptPrice = async (contract) => {
  try {
    let price = await contract.methods.pricePerScript().call();
    return price;
  } catch (error) {
    console.log('Price fetch from contract Failed:- ', error.message);
  }
};

export const getPendingScripts = async (contract, walletAddress) => {
  try {
    let num = await contract.methods.getPendingScripts(walletAddress).call();
    return num;
  } catch (error) {
    console.log('Pending scripts fetch from contract Failed:- ', error.message);
  }
};

export const getPackages = async (contract) => {
  try {
    let packs = await contract.methods.getPackages().call();
    return packs;
  } catch (error) {
    console.log('Packages fetch from contract Failed:- ', error.message);
  }
};

export const addMilestone = async (
  name,
  amount,
  description,
  executeMetaTx,
  agreementContract,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods
      .addMilestone(name, amount, description)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Adding milestone Error:- ', error.message);
    return false;
  }
};

export const updateMilestone = async (
  id,
  name,
  amount,
  description,
  executeMetaTx,
  agreementContract,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods
      .updateMilestone(id, name, amount, description)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Adding milestone Error:- ', error.message);
    return false;
  }
};

export const deleteMilestone = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods.removeMilestone(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const fundMilestone = async (
  id,
  agreementContract,
  walletAddress,
  value
) => {
  try {
    console.log(value);
    let hash = await agreementContract.methods.fundMilestone(id).send({
      from: walletAddress,
      value,
    });
    console.log(hash);
    return true;
  } catch (error) {
    //   notifyEVMError(error);
    console.log('Error in funding:- ', error);
    return false;
  }
};

export const purchaseScript = async (
  agreementContract,
  num,
  value,
  walletAddress
) => {
  try {
    let hash = await agreementContract.methods.buyScripts(num).send({
      from: walletAddress,
      value: ethers.utils.parseEther(JSON.stringify(value)),
    });
    console.log(hash);
    return true;
  } catch (error) {
    console.log('Error in purchasing:- ', error);
    return false;
  }
};

export const subscribe = async (
  agreementContract,
  packageId,
  price,
  walletAddress
) => {
  try {
    let hash = await agreementContract.methods.buyScripts(packageId).send({
      from: walletAddress,
      value: price,
    });
    console.log(hash);
    return true;
  } catch (error) {
    console.log('Error in purchasing:- ', error);
    return false;
  }
};

export const raiseRefundRequest = async (
  milestoneId,
  amount,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods
      .requestRefund(milestoneId, amount)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in refunding milestone:- ', error.message);
    return false;
  }
};

export const updateRefundRequest = async (
  requestId,
  amount,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods
      .updateRequest(requestId, amount)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const grantRefundRequest = async (
  requestId,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods
      .grantRefund(requestId)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const payMilestone = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods.approveMilestone(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const requestPayment = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods.requestPayment(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const updateAgreement = async (id, body, contractAddress) => {
  try {
    let apiRes = await httpcommon.put(`/user/agreement/${id}`, body, {
      headers: {
        Authorization: localStorage.getItem('ybToken'),
      },
    });
    let user = JSON.parse(localStorage.getItem('ybUser'));
    let agreements = JSON.parse(localStorage.getItem('ybUser')).agreements;
    let index = user.agreements.findIndex((agg) => agg._id === id);
    agreements[index] = apiRes.data;
    localStorage.setItem(
      'ybUser',
      JSON.stringify({ ...user, agreements: [...agreements] })
    );
    // if (setAgreement) setAgreement({...apiRes, contractAddress});
    return true;
  } catch (error) {
    console.log('Agreement updation error:- ', error.message);
    return false;
  }
};

export const endContract = async (
  agreementContract,
  executeMetaTx,
  agreementAddr,
  agreementId,
  contract1FC
) => {
  try {
    let data = await agreementContract.methods.endContract().encodeABI();
    let current = moment().unix();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr, contract1FC);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    if (await updateAgreement(agreementId, { endsAt: current }, agreementAddr))
      return true;
    return false;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};
