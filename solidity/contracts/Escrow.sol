// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.9 <0.9.0;

// Author: @avezorgen
contract Escrow {
    mapping(bytes32 => uint8) public deals;
    //active| confBuyer | confSeller    = uint8
    //  0   |      0    |       0       = 0  
    //  1   |      0    |       0       = 4
    //  1   |      1    |       0       = 6
    //  1   |      1    |       1       = 7

    address public owner;
    uint public hold;

    event Created(address buyer, address seller, uint value);
    event BuyerConfim(address buyer, address seller, uint value);
    event SellerConfim(address buyer, address seller, uint value);
    event Finished(address buyer, address seller, uint value);

    function getTxId(address buyer, address seller, uint value) internal pure returns (bytes32 TxId) {
        TxId = keccak256(abi.encode(
            buyer, seller, value
        ));
    }

    function getDeal(address buyer, address seller, uint value) external view returns (uint8 status) {
        bytes32 TxId = getTxId(buyer, seller, value);
        status = deals[TxId];
    }

    constructor() {
        owner = msg.sender;
    }

    function create(address buyer, address seller, uint value) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission");
        require(value != 0, "Can't provide deal with 0 value");
        bytes32 TxId = getTxId(buyer, seller, value);
        require(deals[TxId] == 0, "Deal already exists");
        deals[TxId] = 4;
        emit Created(buyer, seller, value);
    }

    function sendB(address seller) external payable {
        bytes32 TxId = getTxId(msg.sender, seller, msg.value);
        require(deals[TxId] == 4, "Deal does not exist or Money was already sent");
        deals[TxId] = 6;
        emit BuyerConfim(msg.sender, seller, msg.value);
    }

    function sendS(address buyer, uint value) external {
        bytes32 TxId = getTxId(buyer, msg.sender, value);
        require(deals[TxId] == 6, "Deal does not exist or Money was not sent or Subject was already sent");
        deals[TxId] = 7;
        emit SellerConfim(buyer, msg.sender, value);
    }

    function cancel(address buyer, address seller, uint value) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission");
        bytes32 TxId = getTxId(buyer, seller, value);
        require(deals[TxId] > 0, "Deal does not exist");
        require(deals[TxId] < 7, "Seller already sent");
        if (deals[TxId] == 6) {
            if (msg.sender == seller) {
                //seller отменил сделку, когда buyer уже отправил деньги
            }
            payable(buyer).transfer(value);
        }
        delete deals[TxId];
        emit Finished(buyer, seller, value);
    }

    function approve(address seller, uint value) external {
        bytes32 TxId = getTxId(msg.sender, seller, value);
        require(deals[TxId] == 7, "Seller did not confirm the transaction");
        uint fee = value / 1000 * 25;
        hold += fee;
        payable(seller).transfer(value - fee);
        delete deals[TxId];
        emit Finished(msg.sender, seller, value);
    }

    function disapprove(address seller, uint value) external {
        bytes32 TxId = getTxId(msg.sender, seller, value);
        require(deals[TxId] == 7, "Seller did not confirm the transaction");
        payable(msg.sender).transfer(value); //buyer отправлял и seller отправлял
        delete deals[TxId];
        emit Finished(msg.sender, seller, value);
    }

    function withdraw(address target) external {
        require(msg.sender == owner, "Caller is not owner");
        uint rest = hold / 100 * 2;
        payable(target).transfer(hold - rest);
        hold = rest;
    }
    
    receive() external payable {
        hold += msg.value;
    }
}