import React, { useEffect, useState } from 'react';
import './Manager.css';

const Manager = ({ state }) => {

    const [account, setAccount] = useState("");
    const [cbalance, setCbalance] = useState(0);
    const [lwinner, setLWinner] = useState("No Winner");

    const setAccountListener = (provider)=>{
        provider.on("accountsChanged",(accounts)=>{
            setAccount(accounts[0]);
        })
    }

    useEffect(() => {
        const getAccount = async () => {
            const { web3 } = state;
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            setAccount(accounts[0]);
            setAccountListener(web3.givenProvider)
        }

        state.web3 && getAccount();

    }, [state, state.web3])


    const contractBalance = async () => {
        const { contract } = state;
        try {
            const balance = await contract.methods.getBalance().call({ from: account });
            console.log(balance);
            setCbalance(balance);
        }
        catch {
            setCbalance("You are not Manager");
        }
    }

    const winner = async () => {
        const { contract } = state;
        try {
            await contract.methods.selectWinner().send({ from: account });
            const lotteryWinner = contract.methods.winner().call();
            console.log("lotteryWinner",lotteryWinner);
            setLWinner(lotteryWinner);
        }
        catch (e) {
            if (e.message.includes("You are not manager")) {
                setLWinner("You are not manager");
            }
            if (e.message.includes("Participants are less than 3")) {
                setLWinner("Participants are less than 3");
            }
            else {
                setLWinner("No winner yet");
            }
        }
    }

    return (
        <ul className="list-group" id="list">
            <div className="center">
                <li className="list-group-item" aria-disabled="true">
                    <b>Connected account :</b> {account}
                </li>
                <li className="list-group-item">
                    <b> Winner : </b>
                    {lwinner}
                    <button className="button1" onClick={winner}>
                        Click For Winner
                    </button>
                </li>
                <li className="list-group-item">
                    <b>Balnace : </b> {cbalance} ETH
                    <button className="button1" onClick={contractBalance}>
                        Click For Balance
                    </button>
                </li>
            </div>
        </ul>
    )
}

export default Manager