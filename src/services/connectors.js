import Web3 from 'web3';
// import UserServices from "./UserServices";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getUserBrand } from './brandsApi';
// import axios from "axios";
import { baseUrl } from '../Constants';
import { ethers } from 'ethers';

export const fetchAccount = async (
  user,
  setUser,
  account,
  setAccount,
  token,
  setToken,
  setUserBrand,
  initializeWeb3
) => {
  try {
    const web3 = window.web3;

    // Add Polygon testnet (Mumbai) chain
    // await window.ethereum.request({
    //     method: 'wallet_addEthereumChain',
    //     params: [
    //         {
    //             chainId: '0x14a33',
    //             chainName: 'Base Goerli Testnet',
    //             nativeCurrency: {
    //                 name: 'Ether',
    //                 symbol: 'ETH',
    //                 decimals: 18,
    //             },
    //             rpcUrls: ['https://goerli.base.org'],
    //             blockExplorerUrls: ['https://goerli.etherscan.io/'],
    //         },
    //     ],
    // });

    // Switch to Polygon testnet (Mumbai) chain
    // await window.ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{ chainId: '0x14a33' }],
    // });

    // Request MetaMask accounts
    const accounts = await web3.request({
      method: 'eth_requestAccounts',
    });
    console.log(accounts);
    setAccount(accounts[0]);

    // Sign message and fetch user data
    // const signature = await web3.eth.personal.sign(
    //     `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${accounts[0]}\n\nHash:\n${Web3.utils.keccak256(
    //         accounts[0]
    //     )}`,
    //     accounts[0]
    // );
    // const message = `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${
    //     accounts[0]
    //   }\n\nHash:\n${Web3.utils.keccak256(accounts[0])}`;
    // const message = `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${accounts[0]}\n\nHash:\n${ethers.utils.keccak256(
    // accounts[0]
    // )}`;
    // const signature = await web3.request({
    //   method: 'eth_sign',
    //   params: [
    //     accounts[0],
    //     message,
    //   ],
    //   from: accounts[0]
    // });
    const response = await fetch(
      `${baseUrl}/user/login?address=${accounts[0]}`
    );

    const result = await response.json();

    if (response.ok) {
      initializeWeb3();

      const { user, token } = result;

      localStorage.setItem('ybUser', JSON.stringify(user));
      localStorage.setItem('ybToken', token);

      const brandResponse = await getUserBrand(user._id);
      const userBrand = brandResponse.data;
      localStorage.setItem(
        'ybBrand',
        JSON.stringify(userBrand.length ? userBrand[0] : null)
      );

      setUser(user);
      setToken(token);
      setUserBrand(userBrand.length ? userBrand[0] : null);
    }
  } catch (error) {
    console.log(error);
  }
};

export const connectMetaMask = async (
  user,
  setUser,
  account,
  setAccount,
  token,
  setToken,
  setUserBrand,
  initializeWeb3
) => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    fetchAccount(
      user,
      setUser,
      account,
      setAccount,
      token,
      setToken,
      setUserBrand,
      initializeWeb3
    );
    window.ethereum.on('accountsChanged', async function () {
      await fetchAccount(
        user,
        setUser,
        account,
        setAccount,
        token,
        setToken,
        setUserBrand,
        initializeWeb3
      );
    });
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider.enable());
    fetchAccount(
      user,
      setUser,
      account,
      setAccount,
      token,
      setToken,
      setUserBrand,
      initializeWeb3
    );
    window.ethereum.on('accountsChanged', function () {
      fetchAccount(
        user,
        setUser,
        account,
        setAccount,
        token,
        setToken,
        setUserBrand,
        initializeWeb3
      );
    });
  } else {
    window.alert(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
  }
};

export const connectArcana = async (
  user,
  setUser,
  account,
  setAccount,
  token,
  setToken,
  setUserBrand,
  initializeWeb3,
  auth
) => {
  await auth.connect();

  let provider = auth.provider;
  // window.web3 = new Web3(provider)
  window.web3 = provider;
  fetchAccount(
    user,
    setUser,
    account,
    setAccount,
    token,
    setToken,
    setUserBrand,
    initializeWeb3
  );
  provider.on('accountsChanged', async function () {
    await fetchAccount(
      user,
      setUser,
      account,
      setAccount,
      token,
      setToken,
      setUserBrand,
      initializeWeb3
    );
  });
};
