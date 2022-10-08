import { updateHistory } from "./SQLRequests.js";
const updateHistoryBtn = document.getElementById("answerCreate-btn");

import { MetaMaskWallet } from "./Web3Layer.js"


updateHistoryBtn.addEventListener('click', (evt) => {
    if(MetaMaskWallet == null) evt.stopImmediatePropagation();
    updateHistory(MetaMaskWallet[0]);
});