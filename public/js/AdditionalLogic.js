// [-] Create -> SendM -> SendS -> Approve

/*
[+] Create
[-] Send Money
[-] Send Sub
[-] Approve
*/

const createDealContainer = document.getElementById("create-container");
const sendMoneyContainer = document.getElementById("send-money-container");
const sendSubContainer = document.getElementById("send-subject-container");
const approveContainer = document.getElementById("approve-transaction-container");

const buyerSwitch = document.getElementById("buyer-role-send-money");
const sellerSwitch = document.getElementById("seller-role-send-money");


const sellerAddress = document.getElementById("deal-seller");
const buyerAddress = document.getElementById("deal-buyer");

const transactionAmount = document.getElementById("transaction-amount-tmp");
const etherUnit = document.getElementById("unit-send-money");
const fee = document.getElementById("fee-send-money");

function setDataByClass(){
    
}

function setData(dealData, account){
    if(account == dealData.seller){
        sellerSwitch.checked = true;
    }
    else{
        buyerSwitch.checked = true;
    }
    sellerAddress.value = dealData.seller;
    buyerAddress.value = dealData.buyer;
    transactionAmount.value = dealData.value;
    etherUnit.value = "Wei";
    fee.innerHTML = dealData.value;
}

function createDealDisplay(dealData, account){
    createDealContainer.style.display = "block";
    sendMoneyContainer.style.display = "none";
    sendSubContainer.style.display = "none";
    approveContainer.style.display = "none";
    setData(dealData, account);
}

function sendMoneyDisplay(dealData, account){
    createDealContainer.style.display = "none";
    sendMoneyContainer.style.display = "block";
    sendSubContainer.style.display = "none";
    approveContainer.style.display = "none";
    setData(dealData, account);
}

function sendSubDisplay(dealData){
    createDealContainer.style.display = "none";
    sendMoneyContainer.style.display = "none";
    sendSubContainer.style.display = "block";
    approveContainer.style.display = "none";
    setData(dealData, account);
}

function approveDisplay(dealData){
    createDealContainer.style.display = "none";
    sendMoneyContainer.style.display = "none";
    sendSubContainer.style.display = "none";
    approveContainer.style.display = "block";
    setData(dealData, account);
}

export {
    createDealDisplay, 
    sendMoneyDisplay, 
    sendSubDisplay, 
    approveDisplay
};