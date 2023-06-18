import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import Loading from './components/loader/Loading';
import SideDrawer from './components/sidebar/SideDrawer';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import Forwarder from './abis/Forwarder.json';
import AskGPT from './abis/AskGPT.json';
import { contractAddress, forwarderAddress } from './Constants';
import { isMobile, isTablet } from 'react-device-detect';
import NTS from './components/NTS';
import { Box } from '@mui/material';

function App() {
  const [user, setUser] = useState(null)
  const [account, setAccount] = useState(null)
  const [token, setToken] = useState(null)
  const [userBrand, setUserBrand] = useState(null)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [forwarderC, setForwarderC] = useState(null);
  const [mainContract, setMainContract] = useState(null);
const [web3, setWeb3] = useState(null)
const [web3Provider, setWeb3Provider] = useState(null)
  

  const initializeWeb3 = async () => {
    try {
        
        let provider = window.ethereum;
        const web3 = new Web3(provider);

        setWeb3(web3);
        setWeb3Provider(provider);
        console.log('---Created Web3');
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
      console.log('---EthAccounts:-', accounts[0]);
      let contract1 = new web3.eth.Contract(Forwarder, forwarderAddress);
      setForwarderC(contract1);
      console.log('---Forwarder Instance Created', contract1);

      let contract2 = new web3.eth.Contract(AskGPT, contractAddress);
      console.log(await contract2.methods.marketFee().call());
      setMainContract(contract2);
      console.log('---MainContract Instance Created', contract2);

      // let cd = await API.get(ENDPOINTS.GET_LATEST_CONTRACTADDRESS);
      // setContractAddress(cd.contractAddress);
      // console.log(cd);
    } catch (error) {
      console.log(error);
    }
  };
  const context = {
    user, setUser,
    account, setAccount,
    token, setToken,
    userBrand, setUserBrand,
    open, setOpen,
    edit, setEdit,
    initializeWeb3,
    forwarderC, setForwarderC,
    mainContract, setMainContract,
    web3, setWeb3,
    web3Provider, setWeb3Provider
  }
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('ybUser'))?.email && JSON.parse(localStorage.getItem('ybUser'))?.videoIntro) {
      setUser(JSON.parse(localStorage.getItem("ybUser")))
      setToken(localStorage.getItem("ybToken"))
      setUserBrand(JSON.parse(localStorage.getItem("ybBrand")))
    } else {
      localStorage.setItem('ybUser', null)
      localStorage.setItem('ybToken', null)

      setUser(null)
      setToken(null)
    }
  }, [account])

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('ybUser'))?.email && JSON.parse(localStorage.getItem('ybUser'))?.videoIntro) {
      setUser(JSON.parse(localStorage.getItem("ybUser")))
      setToken(localStorage.getItem("ybToken"))
      setUserBrand(JSON.parse(localStorage.getItem("ybBrand")))
    } else {
      localStorage.setItem('ybUser', null)
      localStorage.setItem('ybToken', null)

      setUser(null)
      setToken(null)
    }
  }, [])

  return (
    <>
      <ybcontext.Provider value={context}>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {
          (isMobile || isTablet) ? <Box sx={{padding:'10%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'75vh'}}>
<NTS/>
          </Box> : <Router>
          <SideDrawer>
            <MainRouter />
          </SideDrawer>
        </Router>
        }
      </ybcontext.Provider>
    </>
  );
}

export default App;
