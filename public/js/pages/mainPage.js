import { createDeal, updateHistory } from "../sqlConnect/SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");

//Role Switch
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");
const dealPartnerLabel = document.getElementById("deal-partner-label");

//Toast Element
import { CreateToast } from "../frontend/Toasts.js";

//Main logic
import { MetaMaskWallet, provider } from "../web3/Web3Layer.js";
import { approveByPartner } from "../sqlConnect/changeView.js";


const initialize = async () => {
    createDealFormClick.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        if(MetaMaskWallet == null){
            CreateToast(true, "Login error");
            evt.stopImmediatePropagation();
        }
        try {
            const createID = await createDeal(MetaMaskWallet[0]);
            approveByPartner(createID, MetaMaskWallet[0]);
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
    const acc = await provider.listAccounts();
    if (acc[0] != undefined) {
      await updateHistory(acc[0]);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
      await updateHistory(account[0])
    })
}

window.addEventListener("DOMContentLoaded", initialize);