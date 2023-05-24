import Web3 from "web3";
// import UserServices from "./UserServices";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import axios from "axios";

export const fetchAccount = async (user, setUser, account, setAccount, token, setToken, setUserBrand) => {
    const web3 = window.web3
    let use, tokenAcc, userBrand
    // console.log(web3, web3.eth.sign)
    try {
        // console.log(user, account, "fetchdata")
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        try {
            const signature = await web3.eth.personal.sign(
                `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${accounts[0]}\n\nHash:\n${Web3.utils.keccak256(
                    accounts[0],
                )}`,
                accounts[0],
            );
            if (signature) {
                // console.log(signature)
                // const res2 = await UserServices.getUserById(signature);
                await fetch(`http://13.51.252.66/api/v1/user/login?signature=${signature}&address=${accounts[0]}`)
                    .then(r => {
                        return r.json()
                    })
                    .then(async result => {
                        console.log(signature);
                        console.log(result)
                        use = result.user
                        tokenAcc = result.token
                        localStorage.setItem("ybUser", JSON.stringify(result.user))
                        localStorage.setItem("ybToken", result.token)
                        // await BrandServices.getUserBrand(result.user.walletAddress)
                        //     .then((res) => {
                        //         userBrand = res.data
                        //         // console.log(res.data ? res.data[0] : null, 'userBrand')
                        //         localStorage.setItem("ybBrand", JSON.stringify(res.data ? res.data[0] : null))
                        //         setUserBrand(res.data)
                        //     }).catch((e) => {
                        //         console.log(e)
                        //     })
                        setUser(result.user)
                        setToken(result.token)
                    })
                    .catch((e) => console.log(e))
                // setUser(res2.data.user)
                // console.log(res2.headers)
            }
            // console.log(signature);
            return { account: accounts[0], user: use, token: tokenAcc, brand: userBrand };
        } catch (error) {
            console.log(error)
        }
        // console.log(user)
    } catch (err) {
        console.log(err.message)
    }
}

const provider = new WalletConnectProvider({
    rpc: {
        80001: 'https://rpc-mumbai.matic.today',
    },
}
);

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

