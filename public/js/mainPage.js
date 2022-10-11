import { updateHistory, createDeal } from "./SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");
//Get History
const updateHistoryBtn = document.getElementById("answerCreate-btn");

//Role Switch
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");
const dealPartnerLabel = document.getElementById("deal-partner-label");

//Deal Properties
const partnerWallet = document.getElementById("deal-partner");
const transactionAmount = document.getElementById("transaction-amount");

//Send Money
const sendMoneyNext = document.getElementById("send-money-next");
const sendMoneyPrevious = document.getElementById("send-money-previous");

import { CreateToast } from "./Toasts.js";
//Toast Element
const toastTrigger = document.getElementById("liveToastBtn");

import { MetaMaskWallet, escrowProvider, provider } from "./Web3Layer.js"
import {createDealDisplay, sendMoneyDisplay, sendSubDisplay, approveDisplay } from "./AdditionalLogic.js";

createDealFormClick.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if(MetaMaskWallet == null){
        CreateToast(true, "Login error");
        evt.stopImmediatePropagation();
    }
    try {
        // createDeal(MetaMaskWallet[0]); // TODO: при создании надо возращать текущую сделку
        let deal = {
            "id": 74,
            "buyer": "0xdc64d9dd89fb9e38536096c2ba0010e0b12432c5",
            "seller": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
            "value": 10000,
            "status": 0
        };
        sendMoneyDisplay(deal, MetaMaskWallet[0]);
    } catch (error) {
        CreateToast(true, error);
    }
});

sendMoneyNext.addEventListener('click', (evt) => {
    let deal = {
        "id": 74,
        "buyer": "0xdc64d9dd89fb9e38536096c2ba0010e0b12432c5",
        "seller": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "value": 10000,
        "status": 0
    };
    sendSubDisplay(deal, MetaMaskWallet[0]);
});

sendMoneyPrevious.addEventListener('click', (evt) => {
    let deal = {
        "id": 74,
        "buyer": "0xdc64d9dd89fb9e38536096c2ba0010e0b12432c5",
        "seller": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "value": 10000,
        "status": 0
    };
    createDealDisplay(deal, MetaMaskWallet[0]);
});

updateHistoryBtn.addEventListener('click', (evt) => {
    if(MetaMaskWallet == null) evt.stopImmediatePropagation();
    updateHistory(MetaMaskWallet[0]);
});

buyerSwitch.addEventListener('click', (evt) => { //we are buyer
    dealPartnerLabel.innerHTML = "Seller address";
});

sellerSwitch.addEventListener('click', (evt) => { //we are seller
    dealPartnerLabel.innerHTML = "Buyer address";
});

toastTrigger.addEventListener("click", async () => {
    const gas = await escrowProvider.estimateGas.create(
        MetaMaskWallet[0], partnerWallet.value, transactionAmount.value
        );
    const gasPrice = await provider.getGasPrice();
    CreateToast(false, `Fee will be ${gasPrice.mul(ethers.BigNumber.from(gas))} wei`)
});