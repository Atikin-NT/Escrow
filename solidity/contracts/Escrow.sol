// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.9 <0.9.0;

// Author: @avezorgen
contract Escrow {
    struct props {
        uint value;
        bool confBuyer;
        bool confSeller;
    }
    mapping(address => mapping(address => props)) public deals;
    address public owner;
    uint public hold;

    constructor() {
        owner = msg.sender;
    }

    function create(address buyer, address seller, uint value) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission ");
        require(value != 0, "Can't provide deal with 0 value");
        require(deals[buyer][seller].value == 0, "Deal already exists");
        deals[buyer][seller].value = value;
    }

    function sendB(address seller) external payable {
        require(msg.value != 0, "Value can't be zero");
        require(deals[msg.sender][seller].confBuyer == false, "Money was already sent");
        require(msg.value == deals[msg.sender][seller].value, "Wrong money value");
        deals[msg.sender][seller].confBuyer = true;
    }

    function sendS(address buyer) external {
        require(deals[buyer][msg.sender].confBuyer == true, "Money was not sent");
        require(deals[buyer][msg.sender].confSeller == false, "Subject was already sent");
        deals[buyer][msg.sender].confSeller = true;
    }

    function cancel(address buyer, address seller) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission");
        require(deals[buyer][seller].value != 0, "Deal does not exist");
        require(deals[buyer][seller].confSeller == false, "Seller already sent");
        if (deals[buyer][seller].confBuyer) {
            if (msg.sender == seller) {
                //seller отменил сделку, когда buyer уже отправил деньги
            }
            payable(buyer).transfer(deals[buyer][seller].value);
        }
        delete deals[buyer][seller];
    }

    function approve(address seller) external {
        require(deals[msg.sender][seller].confSeller == true, "Seller did not confirm the transaction");
        uint fee = deals[msg.sender][seller].value / 1000 * 25;
        hold += fee;
        payable(seller).transfer(deals[msg.sender][seller].value - fee);
        delete deals[msg.sender][seller];
    }

    function disapprove(address seller) external {
        require(deals[msg.sender][seller].confSeller == true, "Seller did not confirm the transaction");
        payable(msg.sender).transfer(deals[msg.sender][seller].value); //buyer отправлял и seller отправлял
        delete deals[msg.sender][seller];
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