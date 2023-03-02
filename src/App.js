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

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [agoraContract, setAgoraContract] = useState(null);
  const [merchandiseContract, setMerchandiseContract] = useState(null);
  const [localDataList, setLocalData] = useState([]);

  const connectWallet = async () => {
    let web3;
    let web3Provider;
    let accounts;
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
  }, [])

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
