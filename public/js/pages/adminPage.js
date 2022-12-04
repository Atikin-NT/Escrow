import { CreateToast } from "../frontend/Toasts.js";
import { updateHistory, getDealById } from "../sqlConnect/SQLRequests.js";
import { provider, escrowProvider } from "../web3/Web3Layer.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

function set_statistic_info(data){
    const done_deals = document.getElementById("done_deals");
    const total_amount = document.getElementById("total_amount");
    const garant_count = document.getElementById("garant_count");
    const admin_count = document.getElementById("admin_count");
    const total_deals_count = document.getElementById("total_deals_count");
    const summary = document.getElementById("summary");
    const fee_total_amount = document.getElementById("fee_total_amount");
    const sol_amount = document.getElementById("sol_amount");

    done_deals.innerText = data.dealsDoneCount;
    total_amount.innerText = data.totalAmount;
    garant_count.innerText = data.adminHelpDealCount;
    admin_count.innerText = data.needYourHelp;
    total_deals_count.innerText = data.dealsCount;
    summary.innerText = data.openAmount;
    fee_total_amount.innerText = data.feeTotalAmount;
    sol_amount.innerText = data.sol_amount;
}

function solveDealByAdmin(dealID, account, priory){
  const body = JSON.stringify({
    dealID: dealID,
    account: account,
    priory: priory
  });
  fetch('/admin/solveDealByAdmin', { method: "post", body: body, headers: headers }) 
  .then((resp) => {
      if (resp.status < 200 || resp.status >= 300)
          throw new Error("connect error");
      return resp.json();
  })
  .then(async (json) => {
    console.log(json);
    if(json.code == 0)
      CreateToast(false, "Конфликт разрешен");
    else
      CreateToast(true, "Конфликт не разрешен");
  })
  .catch((err) => {
      console.log(err);
  });
}

const dealToHelp = async (dealID, account) => {
  let answerDealById = await getDealById(dealID);
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
        solveDealByAdmin(dealID, account, 0);
        updateHistory(account, 'dealsToHelp', dealToHelp)
      })
      document.getElementById('seller-right').addEventListener('click', async (evt) => {
        const tx = await escrowProvider.approve(answerDealById.txId);
        await tx.wait();
        solveDealByAdmin(dealID, account, 1);
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
      await updateHistory(metaMaskAcc, 'getDeals', dealToHelp);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
        metaMaskAcc = account;
      await updateHistory(account, 'getDeals', dealToHelp);
    })

    fetch(`fetch/preloadAdminPage?account=${metaMaskAcc}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.json();
    })
    .then(async (json) => {
        set_statistic_info(json.list[0]);
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
