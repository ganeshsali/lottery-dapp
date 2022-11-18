// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {

    address public manager;
    address payable[] public participants;
    address payable public winner;
    
    constructor() {
        manager = msg.sender;
    }

    receive() external payable {
        require(msg.value == 1 ether, "Please pay 1 ether only");
        participants.push(payable(msg.sender));
        emit participate(msg.sender,msg.value);
    }

    function getBalance() public view returns(uint) {
        require(msg.sender == manager, "You are not manager");
        return address(this).balance;
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,participants.length)));
    }

    function selectWinner() public {
        require(msg.sender == manager, "You are not manager");
        require(participants.length >= 3, "Participants are less than 3");
        uint r = random();
        uint index = r % participants.length;

        winner = participants[index];
        uint balance = getBalance();

        winner.transfer(balance);

        emit winnerAnnounce(winner,balance,participants);

        participants = new address payable[](0);
    }

    function allPlayes() public view returns(address payable[] memory){
        return participants;
    }

    event winnerAnnounce(address winner, uint amount, address payable[] participants);
    event participate(address participant, uint amount);
}