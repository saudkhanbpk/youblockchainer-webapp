import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useContext } from 'react';
import { ybcontext } from '../../context/MainContext';
import { connectMetaMask } from '../../services/connectors';
import { Button } from '@mui/material';
import { btn_connect } from '../../theme/CssMy';

const ONBOARD_TEXT = 'Install MetaMask';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

export function OnboardingButton() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();
  const { user, setUser, account, setAccount, token, setToken, setUserBrand, initializeWeb3 } = useContext(ybcontext)

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
        connectMetaMask(user, setUser, account, setAccount, token, setToken, setUserBrand, initializeWeb3);
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    // function handleNewAccounts(newAccounts) {
    //   connectAndNavigate(newAccounts);
    // }
    
    // if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    //   window.ethereum
    //     .request({ method: 'eth_requestAccounts' })
    //     .then(handleNewAccounts);
    //   window.ethereum.on('accountsChanged', handleNewAccounts);
    //   return () => {
    //     window.ethereum.removeListener('accountsChanged', handleNewAccounts);
    //   };
    // }
  }, []);

  const connectAndNavigate = (newAccounts) => {
    connectMetaMask(user, setUser, account, setAccount, token, setToken, setUserBrand, initializeWeb3);
    // window.location.href = 'https://app.myreeldream.ai';
  };

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(connectAndNavigate);
    } else {
      onboarding.current.startOnboarding(() => {
        onboarding.startOnboarding();
      });
    }
  };

  return (
    <Button sx={btn_connect} disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </Button>
  );
}
