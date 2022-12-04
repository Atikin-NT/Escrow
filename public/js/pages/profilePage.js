import { updateHistory } from "../sqlConnect/SQLRequests.js";
import { provider } from "../web3/Web3Layer.js";
import { showCurrentDeal } from "../sqlConnect/changeView.js";
const headers = { "Content-Type": "application/json" };

function set_statistic_info(data){
  const done_deals = document.getElementById("done_deals");
  const user_total_amount = document.getElementById("user_total_amount");
  const total_deals_count = document.getElementById("total_deals_count");
  const user_now_amount = document.getElementById("user_now_amount");


  done_deals.innerText = data.done_deals;
  user_total_amount.innerText = data.user_total_amount;
  total_deals_count.innerText = data.total_deals_count;
  user_now_amount.innerText = data.user_now_amount;
}

const initialize = async () => {
    const acc = await provider.listAccounts();
    let metaMaskAcc = acc[0];
    if (acc != undefined) {
      await updateHistory(metaMaskAcc, 'getDeals', showCurrentDeal, 10);
    }
    const {ethereum} = window;
    ethereum.on("accountsChanged", async (account) => {
      metaMaskAcc = account;
      await updateHistory(account, 'getDeals', showCurrentDeal, 10)
    })

    fetch(`fetch/preloadProfilePage?account=${metaMaskAcc}`, { headers })
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
}

window.addEventListener("DOMContentLoaded", initialize);
