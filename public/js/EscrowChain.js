//MetaMask connect

function switchToBtn(divAddress) {
    try {
        document.getElementById("show-account").remove();
    } catch {};
    
    const btn = document.createElement("button");
    btn.id = "connectButton";
    btn.className = "btn btn-primary btn-lg";
    btn.style = "margin-left: 1rem";
    btn.innerText = "Connect Metamask";
    divAddress.appendChild(btn);
}

function switchToAcc(divAddress) {
    try {
        document.getElementById("connectButton").remove();
    } catch {};

    const span = document.createElement("span");
    span.id = "show-account";
    span.style = "font-size: 1rem";
    divAddress.appendChild(span);
}

function connect(account, divAddress) {
    if(account === null) {
        switchToBtn(divAddress);
        return document.getElementById('connectButton');
    }   else {
        switchToAcc(divAddress);
        // handleNewAccounts(account);
        return document.getElementById('show-account');
    }
}


let MetaMaskWallet = null;
let provider = null;
let escrowProvider = null;
let buyerWallet = null;
let sellerWallet = null;
const divAddress = document.getElementById("address");
const btnOrAcc = connect(MetaMaskWallet, divAddress);
console.log(MetaMaskWallet);

const toastBodyAllertSucces = document.getElementsByClassName('alert alert-success');

// Create Tarnsaction
const createTransactionBuyer = document.getElementById('create-buyer');
const createTransactionSeller = document.getElementById('create-seller');
const createTransactionValue = document.getElementById('create-value');
const createTransactionSendButton = document.getElementById('create-btn');
const createTransactionStatus = document.getElementById('create-status');

// Check Deal
const checkDealBuyer = document.getElementById('deals-buyer');
const checkDealSeller = document.getElementById('deals-seller');
const checkDealCheckButton = document.getElementById('deals-btn');
const checkDealOutput = document.getElementById('deals-output');

// Send Money For Subject
const sendBSeller = document.getElementById('sendB-seller');
const sendBValue = document.getElementById('sendB-value');
const sendBButton = document.getElementById('sendB-btn');
const sendBStatus = document.getElementById('sendB-status');

// Send Subject
const sendSBuyer = document.getElementById('sendS-buyer');
const sendSButton = document.getElementById('sendS-btn');
const sendSStatus = document.getElementById('sendS-status');

// Cancel Tarnsaction
const cancelTransactionBuyer = document.getElementById('cancel-buyer');
const cancelTransactionSeller = document.getElementById('cancel-seller');
const cancelTransactionButton = document.getElementById('cancel-btn');
const cancelTransactionStatus = document.getElementById('cancels-status');

// Approve Tarnsaction
const approveTransactionSeller = document.getElementById('approve-seller');
const approveTransactionButton = document.getElementById('approve-btn');
const approveTransactionStatus = document.getElementById('approve-status');

// Disapprove Tarnsaction
const disapproveTransactionSeller = document.getElementById('disapprove-seller');
const disapproveTransactionButton = document.getElementById('disapprove-btn');
const disapproveTransactionStatus = document.getElementById('disapprove-status');

// Withdraw 
const withdrawTarget = document.getElementById('withdraw-target');
const withdrawButton = document.getElementById('withdraw-btn');
const withdrawStatus = document.getElementById('withdraw-status');


import { updateHistory, createDeal } from "./SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");
//Get History
const updateHistoryBtn = document.getElementById("answerCreate-btn");

//Frontend DOM
import { BuyerSellerSwitch } from "./FrontendDOM.js";
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");

import { CreateToast } from "./Toasts.js";

const initialize = async () => {
    //Created check function to see if the MetaMask extension is installed
    const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    try {
        createTransactionSendButton.onclick = async () => {
            const buyer = createTransactionBuyer.value;
            const seller = createTransactionSeller.value;
            const value = createTransactionValue.value;
            try{
                const gas = await escrowProvider.daiContract.estimateGas.create(buyer, seller, value);
                console.log(String(gas));
                const transaction = await escrowProvider.create(buyer, seller, value);
                const tx = await transaction.wait();
                console.log(tx);
                TxId = tx.events[0].args.TxId;
                createTransactionStatus.innerHTML = `Ok`;
                await Check();
            } catch (err){
                console.error(err);
                createTransactionStatus.innerHTML = `Error: ${err.data.message}`;
            } finally {
                checkDealBuyer.value = buyer;
                checkDealSeller.value = seller;
            }
        }
    } catch {
        console.log("Create transaction button not found");
    }

    async function Check() {
        const buyer = checkDealBuyer.value;
        const seller = checkDealSeller.value;
        try{
            // const TxId = await getTxId();
            const deal = await escrowProvider.deals(TxId);
            checkDealOutput.innerHTML = deal;
            sendBValue.value = deal.value;
        } catch (err){
            console.error(err);
            checkDealOutput.innerHTML = `Error: ${err.data.message}`;
        } finally {
            sendBSeller.value = seller;
            sendSBuyer.value = buyer;

            cancelTransactionBuyer.value = buyer;
            cancelTransactionSeller.value = seller;

            approveTransactionSeller.value = seller;

            disapproveTransactionSeller.value = seller;
        }
    }

    try {
        checkDealCheckButton.onclick = Check;
    } catch {
        console.log("Check deal button not found");
    }
    
    try {
        sendBButton.onclick = async () => {
            const seller = sendBSeller.value;
            const value = sendBValue.value;
            try{
                tx = {
                    value: value
                };
                // const TxId = await getTxId();
                const transaction = await escrowProvider.sendB(TxId, tx=tx);
                const tx = await transaction.wait();
                sendBStatus.innerHTML = `Ok`;
                await Check();
            } catch (err){
                console.error(err);
                sendBStatus.innerHTML = `Error: ${err.data.message}`;
            }
        }
        
    
        sendSButton.onclick = async () => {
            const buyer = sendSBuyer.value;
            try{
                // const TxId = await getTxId();
                const transaction = await escrowProvider.sendS(TxId);
                const tx = await transaction.wait();
                sendSStatus.innerHTML = `Ok`;
                await Check();
            } catch (err){
                console.error(err);
                sendSStatus.innerHTML = `Error: ${err.data.message}`;
            }
        }
    } catch {
        console.log("sendBButton/sendSButton not found");
    }

    try {
        cancelTransactionButton.onclick = async () => {
            const buyer = cancelTransactionBuyer.value;
            const seller = cancelTransactionSeller.value;
            try{
                // const TxId = await getTxId();
                const transaction = await escrowProvider.cancel(TxId);
                const tx = await transaction.wait();
                await Check();
            } catch (err){
                console.error(err);
            }
        }
    } catch {
        console.log("Cancel transaction button not found");
    }

    try {
        approveTransactionButton.onclick = async () => {
            const seller = approveTransactionSeller.value;
            try{
                // const TxId = await getTxId();
                const transaction = await escrowProvider.approve(TxId);
                const tx = await transaction.wait();
                approveTransactionStatus.innerHTML = `Ok`;
                await Check();
            } catch (err){
                console.error(err);
                approveTransactionStatus.innerHTML = `Error: ${err.data.message}`;
            }
        }
    } catch {
        console.log("Approve transaction button not found");
    }

    try {
        disapproveTransactionButton.onclick = async () => {
            const seller = disapproveTransactionSeller.value;
            try{
                // const TxId = await getTxId();
                const transaction = await escrowProvider.disapprove(TxId);
                const tx = await transaction.wait();
                disapproveTransactionStatus.innerHTML = `Ok`;
                await Check();
            } catch (err){
                console.error(err);
                disapproveTransactionStatus.innerHTML = `Error: ${err.data.message}`;
            }
        }
    } catch {
        console.log("Disapprove transaction button not found");
    }

    try {
        withdrawButton.onclick = async () => {
            const target = withdrawTarget.value;
            try{
                const transaction = await escrowProvider.withdraw(target);
                const tx = await transaction.wait();
                withdrawStatus.innerHTML = `Ok`;
            } catch (err){
                console.error(err);
                withdrawStatus.innerHTML = `Error: ${err.data.message}`;
            }
        }
    } catch {
        console.log("Withdraw button not found");
    }

    async function handleNewAccounts (newAccounts) {
        // accounts = newAccounts;
        MetaMaskWallet = newAccounts;
        btnOrAcc.innerHTML = MetaMaskWallet || 'Not able to get accounts';
        const signer = provider.getSigner();
        const balance = await signer.getBalance();
        // getBalanceResult.innerHTML = String(balance) || '';
        escrowProvider = new EscrowProvider(signer);
        buyerWallet = MetaMaskWallet[0];
        sellerWallet = partnerWallet.value;
      }
    const onClickConnect = async () => {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
    };

    if (isMetaMaskInstalled()) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        ethereum.autoRefreshOnNetworkChange = false;
        ethereum.on('accountsChanged', handleNewAccounts);
        try {
            const newAccounts = await provider.listAccounts();
            if (newAccounts.length > 0) {
                switchToAcc(divAddress);
                handleNewAccounts(newAccounts);
            }
        } catch (err) {
            console.error('Error on init when getting accounts', err);
        }

        btnOrAcc.onclick = onClickConnect;
        btnOrAcc.disabled = false;
    } else {
        btnOrAcc.innerText = 'Please install MetaMask';
        btnOrAcc.disabled = true;
    }

    updateHistoryBtn.addEventListener('click', (evt) => {
        if(MetaMaskWallet == null) return;
        updateHistory(MetaMaskWallet[0]);
    });

    const partnerWallet = document.getElementById("deal-parner");
    const toastTrigger = document.getElementById("liveToastBtn");
    const transactionAmount = document.getElementById("transaction-amount");
    toastTrigger.addEventListener("click", async () => {
        const gas = await escrowProvider.daiContract.estimateGas.create(
            MetaMaskWallet[0], partnerWallet.value, transactionAmount.value
            );
        const gasPrice = await provider.getGasPrice();
        CreateToast(false, `Fee will be ${gasPrice.mul(ethers.BigNumber.from(gas))} wei`)
  });

    createDealFormClick.addEventListener('submit', (evt) => {
        evt.preventDefault();
        if(MetaMaskWallet == null){ // TODO: проверка на логин по метамаску
            CreateToast(true, "Login error");
            return;
        }
        try {
            createDeal(MetaMaskWallet[0]);
        } catch (error) {
            CreateToast(true, error);
        }
    });

    buyerSwitch.addEventListener('click', (evt) => { //we are buyer
        BuyerSellerSwitch(0);
        sellerSwitch.value = false;
        evt.target.value = true;
    });

    sellerSwitch.addEventListener('click', (evt) => { //we are seller
        BuyerSellerSwitch(1);
        buyerSwitch.value = false;
        evt.target.value = true;
    });
};

window.addEventListener('DOMContentLoaded', initialize);

const getTxId = () => {
    return new Promise( (res , rej) => {
        setTimeout( () => {
            const TxId = "0x177a73f8f29cb1d4dddb2fd58ae343b12393f256400cfb69167ab5151fc59d73";
            res(TxId);
        }, 2000);
    })
}