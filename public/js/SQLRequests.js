import { CreateToast } from "./Toasts.js";

const buyerSwitch = document.getElementById("buyer-role");
const partnerWallet = document.getElementById("deal-parner");
const transactionAmount = document.getElementById("transaction-amount");
const etherUnit = document.getElementById("ether-unit");
const historyList = document.getElementById("history-list");


const headers = { "Content-Type": "application/json" };

const jsonSerialize = data => JSON.stringify(data, (key, value) =>
  typeof value === "bigint" ? `BIGINT::${value}` : value
);

function createDeal(account){
  console.log("create");
  if(!ethers.utils.isAddress(partnerWallet.value) || partnerWallet.value == account)
    throw "invalid partner address";
  if(transactionAmount.value <= 0)
    throw "invalid value";
  let pow = -1;
  const ethUnit = etherUnit.options[etherUnit.selectedIndex].value;
  if(ethUnit == "Wei")
    pow = 1;
  if(ethUnit == "Gwei")
    pow = 1000000000;
  if(ethUnit == "Ether")
    pow = 1000000000000000000n;

  //TODO: больше этого числа бд не сохраняет 1000000000000000000000 :(
  
  let buyer = partnerWallet.value;
  let seller = account;
  if(buyerSwitch.value == 'on'){
    buyer = account;
    seller = partnerWallet.value;
  }

  const body = jsonSerialize({
    buyer: buyer,
    seller: seller,
    value: BigInt(transactionAmount.value) * pow,
  });

  fetch("/fetch/createDeal", { method: "post", body, headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      if(json.code != 0)
        CreateToast(true, json.msg);
      else
        CreateToast(false, json.msg);
    })
    .catch((err) => {
      console.log(err);
      CreateToast(true, err);
    });
}

function updateHistory(account){
  const body = JSON.stringify({
    account: account,
  });
  const answerContainer = document.getElementById("answerCreate");
  fetch(`/fetch/getDeals?account=${account}`, { headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json)
      while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
      }
      for(let element of json.list){
        console.log(element)
        console.log(element.seller)
        var li = document.createElement("li");
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between');

        var div = document.createElement("div");
        if(element.status != 0) div.className = 'text-success';
        var h6 = document.createElement("h6");
        h6.className = 'my-0';
        h6.innerHTML = element.seller; //TODO: фильтрация с тем у кого сделка
        div.appendChild(h6);

        var small = document.createElement("small");
        small.className = 'text-muted';
        small.innerHTML = "pending";

        li.appendChild(div);
        li.appendChild(small);
        historyList.appendChild(li);
      }
      answerContainer.innerHTML = json.msg;
    })
    .catch((err) => {
      console.log(err);
      answerContainer.innerHTML = err;
    });
}

export { updateHistory, createDeal };