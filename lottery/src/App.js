import './App.css';
import Lottery from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";
import React, { useState, useEffect } from "react";
import Manager from './components/Manager';
import Players from './components/Players';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Intro from './components/Intro';

function App() {

  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const [contractAddress, setContractAddress] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        console.log(networkId)

        const deployedNetwork = Lottery.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          Lottery.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContractAddress(deployedNetwork.address);
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <>
      <BrowserRouter>

        <nav className="navbar navbar-expand-lg navbar">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link navtext" aria-current="page">
                    Lottery System
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/manager"
                    className="nav-link navtext"
                    aria-current="page"
                  >
                    Manger
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/players" className="nav-link navtext">
                    Player
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={<Intro key="intro" />} />
          <Route exact path="/players" element={<Players state={state} address={contractAddress} key="players" />} />
          <Route exact path="/manager" element={<Manager state={state} key="manager" />} />
        </Routes>

      </BrowserRouter>

    </>

  );
}

export default App;
