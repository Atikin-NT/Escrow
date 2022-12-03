import { CreateToast } from "../frontend/Toasts.js";
import { updateHistory, getDealById } from "../sqlConnect/SQLRequests.js";
import { provider, escrowProvider } from "../web3/Web3Layer.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

function set_statistic_info(data){
    data = JSON.parse(data);
    const done_deals = document.getElementById("done_deals");
    const total_amount = document.getElementById("total_amount");
    const garant_count = document.getElementById("garant_count");
    const total_deals_count = document.getElementById("total_deals_count");
    const summary = document.getElementById("summary");
    const fee_total_amount = document.getElementById("fee_total_amount");
    const sol_amount = document.getElementById("sol_amount");

    done_deals.innerText = data.dealsDoneCount;
    total_amount.innerText = data.totalAmount;
    garant_count.innerText = data.adminHelpDealCount;
    total_deals_count.innerText = data.dealsCount;
    summary.innerText = data.dealsDoneCount;
    fee_total_amount.innerText = data.feeTotalAmount;
    sol_amount.innerText = data.sol_amount;
}

const dealToHelp = async (dealID, account, status) => {
  let answerDealById = await getDealById(dealID);
  console.log(`view/dealAdminView?dealid=${dealID}&account=${account}`);
  fetch(`view/dealAdminView?dealid=${dealID}&account=${account}`, { headers }) 
  .then((resp) => {
      if (resp.status < 200 || resp.status >= 300)
          throw new Error("connect error");
      return resp.text();
  })
  .then(async (html) => {
    console.log(html);
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
    let metaMaskAcc = acc[0];
    if (acc != undefined) {  //IDEA: а зачем тут проверка, можно свести к одному?
      await updateHistory(acc[0], null, dealToHelp);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
        metaMaskAcc = account;
      await updateHistory(account, null, dealToHelp);
    })

    console.log(`fetch/preloadAdminPage?account=${metaMaskAcc}`);
    fetch(`fetch/preloadAdminPage?account=${metaMaskAcc}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then(async (json) => {
        set_statistic_info(json);
    })
    .catch((err) => {
        console.log(err);
    });

    const withdraw = document.getElementById("withdraw-eth");
    withdraw.addEventListener('click', async (evt) => {
        transaction = await escrowProvider.withdraw(metaMaskAcc);
        await transaction.wait();
    });


}

window.addEventListener("DOMContentLoaded", initialize);
