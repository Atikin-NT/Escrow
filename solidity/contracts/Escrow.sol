// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.9 <0.9.0;

// Author: @avezorgen
contract Escrow {
    mapping(bytes32 => details) public deals;
    struct details {
        address buyer;
        address seller;
        uint value;
        uint8 status;
    }

    //buyerConf | sellerConf    = uint8 status
    //     0    |       0       = 0  
    //     1    |       0       = 2
    //     1    |       1       = 3

    address public owner;
    uint public hold;

    event Created(address buyer, address seller,  bytes32 TxId);
    event BuyerConfim(bytes32 TxId);
    event SellerConfim(bytes32 TxId);
    event Finished(bytes32 TxId);

    modifier onlyPerson(address pers) {
        require(msg.sender == pers, "Don't have permission");
        _;
    }

    function getTxId(address buyer, address seller, uint timestamp) internal pure returns (bytes32 TxId) {
        TxId = keccak256(abi.encode( buyer, seller, timestamp ));
    }

    constructor() {
        owner = msg.sender;
    }

    function create(address buyer, address seller, uint value) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission");
        require(value != 0, "Can't provide deal with 0 value");
        bytes32 TxId = getTxId(buyer, seller, block.timestamp);
        require(deals[TxId].value == 0, "Deal already exists");
        deals[TxId].buyer = buyer;
        deals[TxId].seller = seller;
        deals[TxId].value = value;
        emit Created(buyer, seller, TxId);
    }

    function sendB(bytes32 TxId) external payable onlyPerson(deals[TxId].buyer) {
        require(msg.value == deals[TxId].value, "Wrong money value");
        require(deals[TxId].status == 0, "Money was already sent");
        deals[TxId].status = 2;
        emit BuyerConfim(TxId);
    }

    function sendS(bytes32 TxId) external onlyPerson(deals[TxId].seller) {
        require(deals[TxId].status == 2, "Money was not sent or Subject was already sent");
        deals[TxId].status = 3;
        emit SellerConfim(TxId);
    }

    function cancel(bytes32 TxId) external {
        require(msg.sender == deals[TxId].buyer || msg.sender == deals[TxId].seller, "Don't have permission");
        require(deals[TxId].status != 3, "Can't be cancelled already");
        if (deals[TxId].status == 2) {
            if (msg.sender == deals[TxId].seller) {
                //seller отменил сделку, когда buyer уже отправил деньги
            }
            payable(deals[TxId].buyer).transfer(deals[TxId].value);
        }
        delete deals[TxId];
        emit Finished(TxId);
    }

    function approve(bytes32 TxId) external onlyPerson(deals[TxId].buyer) {
        require(deals[TxId].status == 3, "Seller did not confirm the transaction");
        uint fee = deals[TxId].value / 1000 * 25;
        hold += fee;
        payable(deals[TxId].seller).transfer(deals[TxId].value - fee);
        delete deals[TxId];
        emit Finished(TxId);
    }

    function disapprove(bytes32 TxId) external onlyPerson(deals[TxId].buyer) {
        require(deals[TxId].status == 3, "Seller did not confirm the transaction");
        payable(msg.sender).transfer(deals[TxId].value); //buyer отправлял и seller отправлял
        delete deals[TxId];
        emit Finished(TxId);
    }

    function withdraw(address target) external onlyPerson(owner) {
        uint rest = hold / 100 * 2;
        payable(target).transfer(hold - rest);
        hold = rest;
    }
    
    receive() external payable {
        hold += msg.value;
    }
}