// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// Author: @avezorgen
contract Escrow is AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    uint public hold;
    uint public arbitratorReward;
    uint8 public FP;

    struct details {
        address buyer;
        address seller;
        address arbitrator;
        uint value;
        uint Bfee;
        uint8 status;
    }

    mapping(bytes32 => details) public deals;

    //buyerConf | sellerConf    = uint8 status
    //     0    |       0       = 0  
    //       created            = 1
    //     1    |       0       = 2
    //     1    |       1       = 3


    event Created(address indexed buyer, address indexed seller, bytes32 indexed TxId);
    event BuyerConfim(bytes32 indexed TxId);
    event SellerConfim(bytes32 indexed TxId);
    event Finished(bytes32 indexed TxId);
    event Conflict(bytes32 indexed TxId);
    event ArbitratorAsked(bytes32 indexed TxId, address indexed arbitrator);

    modifier onlyPerson(address pers) {
        require(msg.sender == pers, "Don't have permission");
        _;
    }

    function initialize(
        uint256 _arbitratorReward,
        uint8 _feePercent,
        address _owner
    ) public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _grantRole(ADMIN_ROLE, _owner);
        _grantRole(ARBITRATOR_ROLE, _owner);
        _setRoleAdmin(ARBITRATOR_ROLE, ADMIN_ROLE);
        setAReward(_arbitratorReward);
        setFeePercent(_feePercent);
        hold = 0;
    }

    function getFee(uint value) internal view returns(uint fee){
        fee = value / 1e2 * FP;
    }

    function create(address buyer, address seller, uint value, uint8 feeStyle) external {
        require(msg.sender == buyer || msg.sender == seller, "Don't have permission");
        require(value != 0, "Can't provide deal with 0 value");
        bytes32 TxId = keccak256(abi.encode(buyer, seller, block.timestamp));
        require(deals[TxId].value == 0, "Deal already exists");
        require(feeStyle <= 2, "Wrong feeStyle");
        uint Bfee = 0;
        if (feeStyle == 0) Bfee = getFee(value);
        else if (feeStyle == 1) Bfee = getFee(value) / 2;
        deals[TxId] = details(buyer, seller, address(0), value - Bfee, Bfee, 1);
        emit Created(buyer, seller, TxId);
    }

    function sendB(bytes32 TxId) external payable onlyPerson(deals[TxId].buyer) {
        require(msg.value == deals[TxId].value + deals[TxId].Bfee, "Wrong money value");
        require(deals[TxId].status == 1, "Money was already sent");
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
                emit Conflict(TxId);
            }
            payable(deals[TxId].buyer).transfer(deals[TxId].value + deals[TxId].Bfee);
        }
        delete deals[TxId];
        emit Finished(TxId);
    }

    function approve(bytes32 TxId) external {
        require(msg.sender == deals[TxId].buyer || msg.sender == deals[TxId].arbitrator, "Don't have permission");
        require(deals[TxId].status == 3, "Seller did not confirm the transaction");
        uint InpValue = deals[TxId].value + deals[TxId].Bfee;
        uint fee = getFee(InpValue);
        hold += fee;
        payable(deals[TxId].seller).transfer(InpValue - fee);
        delete deals[TxId];
        emit Finished(TxId);
    }

    function disapprove(bytes32 TxId) external onlyPerson(deals[TxId].arbitrator) {
        require(deals[TxId].status == 3, "Seller did not confirm the transaction");
        hold += deals[TxId].Bfee;
        payable(deals[TxId].buyer).transfer(deals[TxId].value);
        delete deals[TxId];
        emit Finished(TxId);
    }

    function askArbitrator(bytes32 TxId, address arbitrator) external payable  {
        require(msg.value == arbitratorReward, "Not enough payments");
        require(msg.sender == deals[TxId].buyer || msg.sender == deals[TxId].seller, "Don't have permission");
        require(hasRole(ARBITRATOR_ROLE, arbitrator));
        require(deals[TxId].status == 3, "Seller did not confirm the transaction");
        deals[TxId].arbitrator = arbitrator;
        hold += msg.value;
        emit ArbitratorAsked(TxId, arbitrator);
    }

    function withdraw(address target) external {
        require(hasRole(ADMIN_ROLE, msg.sender));
        payable(target).transfer(hold);
        hold = 0;
    }

    function setFeePercent(uint8 newFP) public {
        require(hasRole(ADMIN_ROLE, msg.sender));
        require(newFP < 100);
        FP = newFP;
    }

    function setAReward(uint newReward) public {
        require(hasRole(ADMIN_ROLE, msg.sender));
        arbitratorReward = newReward;
    }
    
    receive() external payable {
        hold += msg.value;
    }
}