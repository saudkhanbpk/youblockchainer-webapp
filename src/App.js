import './App.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ybcontext } from './context/MainContext';
import MainRouter from './router/MainRouter';
import SideDrawer from './components/sidebar/SideDrawer';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import Forwarder from './abis/Forwarder.json';
import AskGPT from './abis/AskGPT.json';
import { contractAddress, forwarderAddress } from './Constants';
import { useAuth } from '@arcana/auth-react';
import { getPendingScripts } from './services/agreement';
import { ethers } from 'ethers';
import { connectArcana } from './services/connectors';

function App() {
  const [user, setUser] = useState(null);
  console.log("🚀 ~ App ~ user:", user)
  const [account, setAccount] = useState(null);
  console.log("🚀 ~ App ~ account:", account)
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
  const [creditCardType, setCreditCardType] = useState(false)
  // const [messages, setMessages] = useState([]);

  const handleMainLoading=useRef(true)
  console.log("🚀 ~ App ~ handleMainLoading:", handleMainLoading)

  // chat component states 
  const [msgInputValue, setMsgInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [contentType, setContentType] = useState(null);
  const [genre, setGenre] = useState(null);
  const [temporality, setTemporality] = useState(null);
  const [hasPitchIdea, setHasPitchIdea] = useState(null);
  const [hasSynopsis, setHasSynopsis] = useState(null);
  const [enableTF, setEnableTF] = useState(false);
  const [disableTF, setDisableTF] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const [finalScript, setFinalScript] = useState('');
  const [saveLoad, setSaveLoad] = useState(false);
  const [download, setDownload] = useState(false);
  const [showIdeas, setShowIdeas] = useState([]);
  const [showSynopsis, setShowSynopsis] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [ideasType, setIdeasType] = useState(false);
  const [synopsisType, setSynopsisType] = useState(false);


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
      setPendingScripts(p);
    }
  };
  const fetchPendingScriptswithCredit=()=>{
     if(account && user?.creditPayment==true && user?.creditPaymentId?.scriptCount> 0){
    setPendingScripts(user?.creditPaymentId?.scriptCount);
    setCreditCardType(true)
   }
  }

  const resetChatState = () => {
    setMsgInputValue('');
    setMessages([]);
    setContentType(null);
    setGenre(null);
    setTemporality(null);
    setHasPitchIdea(null);
    setHasSynopsis(null);
    setEnableTF(false);
    setDisableTF(false);
    setCurrent(undefined);
    setFinalScript('');
    setSaveLoad(false);
    setDownload(false);
    setShowIdeas([]);
    setShowSynopsis([]);
    setGenerating(false);
    setIdeasType(false);
    setSynopsisType(false);
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
    setCreditCardType,
    fetchPendingScriptswithCredit,
    creditCardType,
    msgInputValue, setMsgInputValue,
  messages, setMessages,
  contentType, setContentType,
  genre, setGenre,
  temporality, setTemporality,
  hasPitchIdea, setHasPitchIdea,
  hasSynopsis, setHasSynopsis,
  enableTF, setEnableTF,
  disableTF, setDisableTF,
  current, setCurrent,
  finalScript, setFinalScript,
  saveLoad, setSaveLoad,
  download, setDownload,
  showIdeas, setShowIdeas,
  showSynopsis, setShowSynopsis,
  generating, setGenerating,
  ideasType, setIdeasType,
  synopsisType, setSynopsisType,
  resetChatState,
  handleMainLoading
  };

  


  useEffect(() => {
    if(account && user?.creditPayment==true && user?.creditPaymentId?.scriptCount> 0){
        fetchPendingScriptswithCredit()
    }else
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

  const handleOpenLogin = async() => {
    try {
      var elements = document.getElementsByClassName(
        'MuiBox-root css-lqhh04'
      );
      
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.removeAttribute('tabIndex');
      }
      
      // handleMainLoading.current=false
      connectArcana(
        user,
        setUser,
        account,
        setAccount,
        token,
        setToken,
        setUserBrand,
        initializeWeb3,
        auth,
        handleMainLoading,
        setOpen
      );
    } catch (e) {
      handleMainLoading.current=false
      console.log(e);
    }
  
  }

  useEffect(() => {
  const url = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    if(params?.redirectfromlandingforlogin=='true'){
      handleOpenLogin()
    } else if  (!account) {
    setOpen(true);
    handleMainLoading.current=false
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
        
        {/* { (isMobile || isTablet) ? (
          <Box sx={{ padding: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
            <NTS message={"This website is only supported on laptops/desktops. Mobile Apps are coming soon"} />
          </Box>
        ) : (
          (browser.name.includes('chrome') || browser.name.includes('opera') || browser.name.includes('edge') || browser.name.includes('brave') || browser.name.includes('firefox')) ? ( */}
            {!handleMainLoading.current ? (
              <Router>
                <SideDrawer>
                  <MainRouter />
                </SideDrawer>
              </Router>
            ): <h1 className='text-center'>Loading ..</h1>}
          {/* ) : (
            <Box sx={{ padding: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
              <NTS message={"Metamask is not supported in this browser, use Chrome, Firefox, Brave, Edge or Opera"} />
            </Box>
          ) 
        )} */}
      </ybcontext.Provider>
    </>
  );
  
}

export default App;
