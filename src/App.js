import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Header from './components/header';
import Home from './components/home';
import Sell from './components/sell';
import About from './components/about';
import Source from './components/source';
import Footer from './components/footer';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContext } from './AppContext';
import AgoraContract from './contracts/Agora.json';
import MerchandiseContract from './contracts/Merchandise.json';
import MuiAlert from '@mui/material/Alert';
import { USE_NETWORK, RPC_PROVIDERS } from "./config/chains";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import UniversalProvider from "@walletconnect/universal-provider";
import { WalletConnectModal } from "@walletconnect/modal";

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [agoraContract, setAgoraContract] = useState(null);
  const [merchandiseContract, setMerchandiseContract] = useState(null);
  const [localDataList, setLocalData] = useState([]);
  const [ethereumProvider, setEthereumProvider] = useState();

  const connectWallet = async (walletType, callback, handleWalletState) => {
    let web3;
    let web3Provider;
    let accounts;
    switch (walletType) {
      case 'metamask':
        // Modern dapp browsers...
        if (window.ethereum) {
          web3Provider = window.ethereum;
          try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
            if (error.code === 4001) {
              console.error("User denied account access")
            }
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
          web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
          callback("Wallet not detected. Connect or install wallet and retry");
          console.error("Wallet not detected");
          return;
        }
        break;
      case 'coinbase':
        web3Provider = getCoinbaseProvider();
        try {
          accounts = await web3Provider.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          if (error.code === 4001) {
            console.error("User denied account access");
          }
        }
        break;
      case 'walletconnect':
        // Using EthereumProvider
        if (!ethereumProvider) {
          throw new ReferenceError("WalletConnect Client is not initialized.");
        }
        web3Provider = ethereumProvider;

        // Listening QRcode show event
        web3Provider.on("display_uri", async (uri) => {
          console.log("QR Code Modal open");
          handleWalletState(false);
        });
        try {
          handleWalletState(true, true);
          await web3Provider.connect();
          accounts = await web3Provider.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          console.error("walletConnect ERR:", error);
          // Reopen wallet choose window if no accounts
          handleWalletState(true);
        }
        break;
      case 'walletconnect2':
        // Using UniversalProvider
        web3Provider = await getWalletConnectProvider2();
        const session = await web3Provider.connect({
          namespaces: {
            eip155: {
              methods: [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
              ],
              chains: [`eip155:${USE_NETWORK}`],
              events: ["chainChanged", "accountsChanged"],
              rpcMap: {
                [USE_NETWORK]:
                  `https://rpc.walletconnect.com?chainId=eip155:${USE_NETWORK}&projectId=${process.env.REACT_APP_PROJECT_ID}`
              },
            },
          },
        });
        accounts = await web3Provider.enable();
        console.log("accounts", accounts);
        break;
      default:
        console.error("Missing wallet type");
    }
    // Returned if accounts is null
    if (!accounts) {
      console.error('No accounts');
      return;
    }
    //Set web3 instance
    web3 = new Web3(web3Provider);
    setWeb3(web3);

    //Set Provider
    setProvider(web3.eth.currentProvider);
    // Set User's account
    !accounts ?
      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error);
        }
        console.log('Legacy mode', accounts);
        setCurrentAccount(accounts[0]);
      }) :
      setCurrentAccount(accounts[0]);
    // Set contract instance
    await registerContract(web3);

  }

  const getCoinbaseProvider = () => {
    const APP_NAME = 'Agora';
    const APP_LOGO_URL = 'https://app.agorasea.top/favicon.ico';
    const DEFAULT_ETH_JSONRPC_URL = RPC_PROVIDERS[USE_NETWORK];
    const DEFAULT_CHAIN_ID = USE_NETWORK;

    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false
    });
    return coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
  }

  const getWalletConnectProvider = async () => {
    const provider = await EthereumProvider.init({
      projectId: process.env.REACT_APP_PROJECT_ID,
      chains: [1],
      optionalChains: [5],
      showQrModal: true,
      methods: ["eth_requestAccounts", "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData",], // REQUIRED ethereum methods
      events: ["chainChanged", "accountsChanged"], // REQUIRED ethereum events
    });
    setEthereumProvider(provider);
    return provider;
  }

  const getWalletConnectProvider2 = async () => {
    const provider = await UniversalProvider.init({
      projectId: process.env.REACT_APP_PROJECT_ID,
      logger: "debug",
      relayUrl: "wss://relay.walletconnect.com",
    });
    // Register open QR modal
    const web3Modal = new WalletConnectModal({
      projectId: process.env.REACT_APP_PROJECT_ID || "",
    });
    provider.on("display_uri", async (uri) => {
      console.log("EVENT", "QR Code Modal open");
      web3Modal?.openModal({ uri });
    });
    return provider;
  }

  const registerContract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    if (!AgoraContract.networks[networkId]) {
      alert("Can't support current chain.");
      console.error("Wrong chainId");
      return;
    }
    // Agora contract
    const agoraContract = new web3.eth.Contract(
      AgoraContract.abi,
      AgoraContract.networks[networkId].address
    );
    setAgoraContract(agoraContract);

    // Merchandise contract
    const merchandiseContract = new web3.eth.Contract(
      MerchandiseContract.abi,
      MerchandiseContract.networks[networkId].address
    )
    setMerchandiseContract(merchandiseContract);

    return { agoraContract, merchandiseContract };
  }

  const getData = () => {
    fetch("./data/goods.json").then((res) => res.json()).then((data) => {
      setLocalData(data);
    });
  }

  useEffect(() => {
    //connectWallet();
    getData();
  }, []);

  useEffect(() => {
    getWalletConnectProvider();
  }, []);

  return (
    <AppContext.Provider value={{ currentAccount, connectWallet, web3, agoraContract, merchandiseContract }}>
      <Container maxWidth="xl" fixed>
        <Router>
          <MuiAlert severity="warning">Welcome to Agora, a blockchain-based e-commerce shopping
            platform, currently under development and is running on Goerli Testnet.</MuiAlert>
          <Header provider={provider} />

          <Routes>
            <Route path="/" element={<Home dataList={localDataList} />} />
            <Route path="/sell" element={<Sell dataList={localDataList} />} />
            <Route path='/about' element={<About />} />
            <Route path="/source" element={<Source />} />
          </Routes>

          <Footer />
        </Router>
      </Container>
    </AppContext.Provider>
  );
}

export default App;
