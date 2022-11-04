import { updateHistory, createDeal } from "../sqlConnect/SQLRequests.js";
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

//Deals steps
const nextStepBtn = document.getElementById("next-deal-step");

//Toast Element
import { CreateToast } from "../frontend/Toasts.js";
const toastTrigger = document.getElementById("liveToastBtn");

//Fee payment
const feeSection = document.getElementById("fee-container");

//Main logic
import { MetaMaskWallet, escrowProvider, provider } from "../web3/Web3Layer.js";
import { approveByPartner, changeDeal } from "../sqlConnect/changeView.js";

createDealFormClick.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if(MetaMaskWallet == null){
        CreateToast(true, "Login error");
        evt.stopImmediatePropagation();
    }
    try {
        const createID = await createDeal(MetaMaskWallet[0]); // TODO: при создании надо возращать текущую сделку
        approveByPartner(createID, MetaMaskWallet[0]);
    } catch (error) {
        CreateToast(true, error);
    }
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
    try {
        const gas = await escrowProvider.estimateGas.create(
            MetaMaskWallet[0], partnerWallet.value, transactionAmount.value
            );
        const gasPrice = await provider.getGasPrice();
        CreateToast(false, `Fee will be ${gasPrice.mul(ethers.BigNumber.from(gas))} wei`)
    } catch (err) {
        CreateToast(true, err);
    }
});
