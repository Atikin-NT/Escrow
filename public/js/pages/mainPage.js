import { createDeal, updateHistory, updateEthUsd } from "../sqlConnect/SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");
const transactionAmount = document.getElementById("transaction-amount");
const unit = document.getElementById("ether-unit");

//Role Switch
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");
const dealPartnerLabel = document.getElementById("deal-partner-label");

//Toast Element
import { CreateToast } from "../frontend/Toasts.js";

//Main logic
import { MetaMaskWallet, provider } from "../web3/Web3Layer.js";
import { showCurrentDeal, sellerReceive } from "../sqlConnect/changeView.js";


const initialize = async () => {
    createDealFormClick.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        if(MetaMaskWallet == null){
            CreateToast(true, "Login error");
            evt.stopImmediatePropagation();
        }
        try {
            const createID = await createDeal(MetaMaskWallet[0]);
            showCurrentDeal(createID, MetaMaskWallet[0], 0);
        } catch (error) {
            CreateToast(true, error);
        }
    });

    buyerSwitch.addEventListener('click', (evt) => { //we are buyer
        dealPartnerLabel.innerHTML = "Seller address";
    });

    sellerSwitch.addEventListener('click', (evt) => { //we are seller
        dealPartnerLabel.innerHTML = "Buyer address";
    });

    transactionAmount?.addEventListener('change', sellerReceive)
    unit?.addEventListener('change', sellerReceive);

    const acc = await provider.listAccounts();
    if (acc[0] != undefined) {
      await updateHistory(acc[0]);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
      await updateHistory(account[0])
    })
    updateEthUsd();
}

window.addEventListener("DOMContentLoaded", initialize);