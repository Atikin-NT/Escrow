import { CreateToast } from "../frontend/Toasts.js";
import { updateHistory, getDealById } from "../sqlConnect/SQLRequests.js";
import { provider, escrowProvider } from "../web3/Web3Layer.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

const dealToHelp = async (dealID, account, status) => {
  let answerDealById = await getDealById(dealID);

// function funonload(){
//     if(MetaMaskWallet == null){
//         CreateToast(true, "Сначала нужно зарегистрироваться");
//     }
//     account = MetaMaskWallet[0];
//     fetch(`view/preloadProfilePage?account=${account}`, { headers })
//     .then((resp) => {
//         if (resp.status < 200 || resp.status >= 300)
//             throw new Error("connect error");
//         return resp.text();
//     })
//     .then((json) => {
//         console.log(json);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// }

// window.onload = funonload;
  fetch(`view/dealAdminView?dealid=${dealID}&account=${account}`, { headers }) 
  .then((resp) => {
      if (resp.status < 200 || resp.status >= 300)
          throw new Error("connect error");
      return resp.text();
  })
  .then(async (html) => {
      bodyInput.innerHTML = html;
      document.getElementById('buyer-right').addEventListener('click', async (evt) => {
        const tx = await escrowProvider.disapprove(answerDealById.txId);
        await tx.wait();
        updateHistory(account, 'dealsToHelp', dealToHelp)
      })
      document.getElementById('seller-right').addEventListener('click', async (evt) => {
        const tx = await escrowProvider.approve(answerDealById.txId);
        await tx.wait();
        updateHistory(account, 'dealsToHelp', dealToHelp)
      })
  })
  .catch((err) => {
      console.log(err);
  });
}

const initialize = async () => {
    const acc = await provider.listAccounts();
    if (acc != undefined) {
      await updateHistory(acc[0], 'dealsToHelp', dealToHelp);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
      await updateHistory(account, 'dealsToHelp', dealToHelp)
    })
}

window.addEventListener("DOMContentLoaded", initialize);
