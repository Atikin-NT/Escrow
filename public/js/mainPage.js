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

//Toast Element
import { CreateToast } from "./Toasts.js";
const toastTrigger = document.getElementById("liveToastBtn");

//Fee payment
const feeSection = document.getElementById("fee-container");
const discountTrigger = document.getElementById("discount");

//Main logic
import { MetaMaskWallet, escrowProvider, provider } from "./Web3Layer.js";

createDealFormClick.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if(MetaMaskWallet == null){ // TODO: проверка на логин по метамаску
        CreateToast(true, "Login error");
        evt.stopImmediatePropagation();
    }
    try {
        createDeal(MetaMaskWallet[0]);
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

discountTrigger.addEventListener("click", (evt) => {
    if (discountTrigger.checked) {
        const buttonBuyer = document.createElement("button");
        const buttonSeller = document.createElement("button");

        buttonBuyer.type = "button";
        buttonBuyer.id = "primary-btn-buyer";
        buttonBuyer.className = "btn btn-secondary primary-btn";
        buttonBuyer.textContent = "Buyer";
        buttonBuyer.disabled = true;

        buttonSeller.type = "button";
        buttonSeller.id = "primary-btn-seller";
        buttonSeller.className = "btn btn-secondary primary-btn";
        buttonSeller.textContent = "Seller";
        buttonSeller.disabled = true;

        feeSection.appendChild(buttonBuyer);
        feeSection.appendChild(buttonSeller);
    } else {
        const prBtnBuyer = document.getElementById("primary-btn-buyer");
        const prBtnSeller = document.getElementById("primary-btn-seller");
        if ((prBtnBuyer & prBtnSeller) != null) {
            prBtnBuyer.remove();
            prBtnSeller.remove();
        }
        
    }


})