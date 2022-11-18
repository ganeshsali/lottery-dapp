import React, { useEffect, useState } from 'react'

const Players = ({ state, address }) => {

    const [account, setAccount] = useState("No Account Connected");
    const [registeredPlayers, setRegisteredPlayers] = useState([]);
    const [reload, setReload] = useState(false);

    const reloadEffect = () =>{
        setReload(!reload);
    }

    const setAccountListener = (provider)=>{
        provider.on("accountsChanged",(accounts)=>{
            setAccount(accounts[0]);
        })
    };

    useEffect(() => {
        const getAccount = async () => {
            const { web3 } = state;
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            setAccountListener(web3.givenProvider);
        }
        state.web3 && getAccount();
    }, [state, state.web3])

    useEffect(() => {
        const getPlayers = async () => {
            const { contract } = state;
            const players = await contract.methods.allPlayes().call();
            const registerdPlayers = await Promise.all(
                players.map((player) => {
                  return player;
                })
              );
            setRegisteredPlayers(registerdPlayers);
            reloadEffect();
        }
        state.web3 && getPlayers();
    }, [state, state.contract, reload])

    return (
        <>
      <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <b>Connected account :</b> {account}
          </li>
          <li className="list-group-item">
            <b>Please pay 1 ether on this contract address : </b> {address}
          </li>
          <li className="list-group-item">
            <b>Registerd Players </b>:
            <br />
            <br />
            {registeredPlayers.length !== 0 &&
              registeredPlayers.map((name) => <p key={name}>{name}</p>)}
          </li>
        </div>
      </ul>
    </>
    )


}

export default Players