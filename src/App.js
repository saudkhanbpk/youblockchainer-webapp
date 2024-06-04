import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import SideDrawer from './components/sidebar/SideDrawer';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import Forwarder from './abis/Forwarder.json';
import AskGPT from './abis/AskGPT.json';
import { contractAddress, forwarderAddress } from './Constants';
import { useAuth } from '@arcana/auth-react';
import { getPendingScripts } from './services/agreement';
import { ethers } from 'ethers';

function App() {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [userBrand, setUserBrand] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [edit, setEdit] = useState(false);
  const [forwarderC, setForwarderC] = useState(null);
  const [mainContract, setMainContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [pendingScripts, setPendingScripts] = useState(0);

  const auth = useAuth();

  const initializeWeb3 = async () => {
    try {
      // let provider = window.ethereum;
      // await auth.connect();
      let provider = window.web3;
      // console.log(provider)
      const web3 = new Web3(provider);

      setWeb3(web3);
      setWeb3Provider(provider);

      // const accounts = await window.ethereum.request({
      //   method: 'eth_requestAccounts',
      // });
      // console.log('---EthAccounts:-', accounts[0]);
      let contract1 = new web3.eth.Contract(Forwarder, forwarderAddress);
      setForwarderC(contract1);

      let contract2 = new web3.eth.Contract(AskGPT, contractAddress);
      console.log(await contract2.methods.marketFee().call());
      setMainContract(contract2);

      // let cd = await API.get(ENDPOINTS.GET_LATEST_CONTRACTADDRESS);
      // setContractAddress(cd.contractAddress);
      // console.log(cd);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingScripts = async () => {
    if (account && user && user.walletAddress && mainContract) {
      const p = await getPendingScripts(mainContract, user.walletAddress);
      console.log(p);
      setPendingScripts(p);
    }
  };

  const context = {
    user,
    setUser,
    account,
    setAccount,
    token,
    setToken,
    userBrand,
    setUserBrand,
    open,
    setOpen,
    open2,
    setOpen2,
    edit,
    setEdit,
    initializeWeb3,
    forwarderC,
    setForwarderC,
    mainContract,
    setMainContract,
    web3,
    setWeb3,
    web3Provider,
    setWeb3Provider,
    auth,
    pendingScripts,
    fetchPendingScripts,
  };

  useEffect(() => {
    if (account && user && user.walletAddress && mainContract) {
      fetchPendingScripts();
    }
  }, [user, account, mainContract]);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem('ybUser'))?.email &&
      JSON.parse(localStorage.getItem('ybUser'))?.videoIntro
    ) {
      setUser(JSON.parse(localStorage.getItem('ybUser')));
      setToken(localStorage.getItem('ybToken'));
      setUserBrand(JSON.parse(localStorage.getItem('ybBrand')));
    } else {
      localStorage.setItem('ybUser', null);
      localStorage.setItem('ybToken', null);

      setUser(null);
      setToken(null);
    }
  }, [account]);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem('ybUser'))?.email &&
      JSON.parse(localStorage.getItem('ybUser'))?.videoIntro
    ) {
      setUser(JSON.parse(localStorage.getItem('ybUser')));
      setToken(localStorage.getItem('ybToken'));
      setUserBrand(JSON.parse(localStorage.getItem('ybBrand')));
    } else {
      localStorage.setItem('ybUser', null);
      localStorage.setItem('ybToken', null);

      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    if (!account) {
      setOpen(true);
    }
  }, [account]);

  return (
    <>
      <ybcontext.Provider value={context}>
        <ToastContainer
          position='bottom-left'
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
          // (isMobile || isTablet) ? <Box sx={{ padding: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
          //   <NTS message={"This website is only supported on laptops/desktops. Mobile Apps are coming soon"} />
          // </Box> : (browser.name.includes('chrome') || browser.name.includes('opera') || browser.name.includes('edge') || browser.name.includes('brave') || browser.name.includes('firefox')) ?
          <Router>
            <SideDrawer>
              <MainRouter />
            </SideDrawer>
          </Router>
          // : <Box sx={{ padding: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
          //   <NTS message={"Metamask is not supported in this browser, use Chrome, Firefox, Brave, Edge or Opera"} />
          // </Box>
        }
      </ybcontext.Provider>
    </>
  );
}

export default App;
