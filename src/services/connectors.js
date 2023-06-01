import Web3 from "web3";
// import UserServices from "./UserServices";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getUserBrand } from "./brandsApi";
// import axios from "axios";

export const fetchAccount = async (
    user,
    setUser,
    account,
    setAccount,
    token,
    setToken,
    setUserBrand
) => {
    try {
        const web3 = window.web3;

        // Add Polygon testnet (Mumbai) chain
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x13881',
                    chainName: 'Polygon Testnet',
                    nativeCurrency: {
                        name: 'Matic',
                        symbol: 'MATIC',
                        decimals: 18,
                    },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                    iconUrls: ['https://polygon.technology/images/mumbai_logo.png'],
                },
            ],
        });

        // Switch to Polygon testnet (Mumbai) chain
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
        });

        // Request MetaMask accounts
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);

        // Sign message and fetch user data
        const signature = await web3.eth.personal.sign(
            `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${accounts[0]}\n\nHash:\n${Web3.utils.keccak256(
                accounts[0]
            )}`,
            accounts[0]
        );

        const response = await fetch(
            `http://app.myreeldream.ai/api/v1/user/login?signature=${signature}&address=${accounts[0]}`
        );

        const result = await response.json();

        if (response.ok) {
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



export const connectMetaMask = async (user, setUser, account, setAccount, token, setToken, setUserBrand) => {

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        fetchAccount(user, setUser, account, setAccount, token, setToken, setUserBrand);
        window.ethereum.on('accountsChanged', async function () {
            await fetchAccount(user, setUser, account, setAccount, token, setToken, setUserBrand);
        })
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider.enable());
        fetchAccount(user, setUser, account, setAccount, token, setToken, setUserBrand);
        window.ethereum.on('accountsChanged', function () {
            fetchAccount(user, setUser, account, setAccount, token, setToken, setUserBrand);
        })
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
}

