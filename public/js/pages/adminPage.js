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

const thisUpdateHistory = async (account, sort = false) => updateHistory(account, 'dealsToHelp', dealToHelp, 10, sort);

const solveViewRes = async (dealID, account) => {
  try {
    const resp = await fetch(`view/dealAdminView?dealid=${dealID}&account=${account}`, { headers });
    const html = await resp.text();
    bodyInput.innerHTML = html;
  }
  catch (err) { console.log(err); }
  CreateToast(false, "Конфликт разрешен");
  await thisUpdateHistory(account);
}

const dealToHelp = async (dealID, account) => {
  let answerDealById = await getDealById(dealID);
  try {
    const resp = await fetch(`view/dealAdminView?dealid=${dealID}&account=${account}`, { headers });
    const html = await resp.text();
    bodyInput.innerHTML = html;
  }
  catch (err) { console.log(err); }

  const buyerbtn = document.getElementById('buyer-right');
  const sellerbtn = document.getElementById('seller-right');
  buyerbtn?.addEventListener('click', async (evt) => {
    const tx = await escrowProvider.disapprove(answerDealById.txId);
    await tx.wait();
    await solveViewRes(dealID, account);
  })
  sellerbtn?.addEventListener('click', async (evt) => {
    const tx = await escrowProvider.approve(answerDealById.txId);
    await tx.wait();
    await solveViewRes(dealID, account);
  })
}

let sort = false
const initialize = async () => {
    const acc = await provider.listAccounts();
    let metaMaskAcc = acc[0];
    if (acc != undefined) {  //IDEA: а зачем тут проверка, можно свести к одному?
      await thisUpdateHistory(metaMaskAcc);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
      metaMaskAcc = account[0];
      await thisUpdateHistory(metaMaskAcc);
    })

    try {
      const resp = await fetch(`fetch/preloadAdminPage?account=${metaMaskAcc}`, { headers });
      const json = await resp.json();
      set_statistic_info(json.list[0]);
    } catch (err) { console.log(err); }

    const withdraw = document.getElementById("withdraw-eth");
    withdraw.addEventListener('click', async (evt) => {
        transaction = await escrowProvider.withdraw(metaMaskAcc);
        await transaction.wait();
    });

    document.getElementById("sortList").onchange = await function() {
      sort = !sort;
      thisUpdateHistory(metaMaskAcc, sort);
    }
}

window.addEventListener("DOMContentLoaded", initialize);
