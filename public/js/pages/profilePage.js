import { updateHistory } from "../sqlConnect/SQLRequests.js";
const updateHistoryBtn = document.getElementById("answerCreate-btn");

import { MetaMaskWallet } from "../web3/Web3Layer.js"


updateHistoryBtn.addEventListener('click', (evt) => {
    if(MetaMaskWallet == null) evt.stopImmediatePropagation();
    updateHistory(MetaMaskWallet[0]);
});