import { createDeal } from "../sqlConnect/SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");

//Calculete fee
const feeContainer = document.getElementById("fee-container");

//Role Switch
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");
const dealPartnerLabel = document.getElementById("deal-partner-label");

//Deal Properties
const partnerWallet = document.getElementById("deal-partner");
const transactionAmount = document.getElementById("transaction-amount");

//Toast Element
import { CreateToast } from "../frontend/Toasts.js";
const toastTrigger = document.getElementById("liveToastBtn");

//Main logic
import { MetaMaskWallet, escrowProvider, provider } from "../web3/Web3Layer.js";
import { approveByPartner } from "../sqlConnect/changeView.js";

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

buyerSwitch.addEventListener('click', (evt) => { //we are buyer
    dealPartnerLabel.innerHTML = "Seller address";
});

sellerSwitch.addEventListener('click', (evt) => { //we are seller
    dealPartnerLabel.innerHTML = "Buyer address";
});



let tmp = 0;
const p = document.getElementById("fee-p");
transactionAmount.oninput = () => {
    setTimeout(function () {
        tmp = tmp + 1;
        p.innerText = tmp;
    }, 1000);
    
};

// toastTrigger.addEventListener("click", async () => {
//     try {
//         const gas = await escrowProvider.estimateGas.create(
//             MetaMaskWallet[0], partnerWallet.value, transactionAmount.value
//             );
//         const gasPrice = await provider.getGasPrice();
//         CreateToast(false, `Fee will be ${gasPrice.mul(ethers.BigNumber.from(gas))} wei`)
//     } catch (err) {
//         CreateToast(true, err);
//     }
// });
