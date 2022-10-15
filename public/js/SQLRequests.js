import { CreateToast } from "./Toasts.js";

let buyerSwitch = document.getElementById("buyer-role");
let partnerWallet = document.getElementById("deal-partner");
let transactionAmount = document.getElementById("transaction-amount");
let etherUnit = document.getElementById("ether-unit");
let historyList = document.getElementById("history-list");

const headers = { "Content-Type": "application/json" };

function updateElementsID(){
  buyerSwitch = document.getElementById("buyer-role");
  partnerWallet = document.getElementById("deal-partner");
  transactionAmount = document.getElementById("transaction-amount");
  etherUnit = document.getElementById("ether-unit");
  historyList = document.getElementById("history-list");
}

function createDeal(account){
  updateElementsID();
  console.log("create");
  const value = parseInt(transactionAmount.value);
  if(!ethers.utils.isAddress(partnerWallet.value) || partnerWallet.value == account)
    throw "invalid partner address";
  if(value <= 0)
    throw "invalid value";
  let unit = 0;
  const ethUnit = etherUnit.options[etherUnit.selectedIndex].value;
  if(ethUnit == "Wei")
    unit = 0;
  if(ethUnit == "Gwei")
    unit = 1;
  if(ethUnit == "Ether")
    unit = 2;
    
  let buyer = partnerWallet.value;
  let seller = account;
  if(buyerSwitch.checked == true){
    buyer = account;
    seller = partnerWallet.value;
  }
  console.log(typeof(value));
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
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
      return json.list[0];
    })
    .catch((err) => {
      console.log(err);
      CreateToast(true, err);
    });
}

function updateHistory(account){
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

function updateDeal(account, id){
  updateElementsID();
  console.log("update");
  const value = parseInt(transactionAmount.value);
  if(!ethers.utils.isAddress(partnerWallet.value) || partnerWallet.value == account)
    throw "invalid partner address";
  if(value <= 0)
    throw "invalid value";
  let unit = 0;
  const ethUnit = etherUnit.options[etherUnit.selectedIndex].value;
  if(ethUnit == "Wei")
    unit = 0;
  if(ethUnit == "Gwei")
    unit = 1;
  if(ethUnit == "Ether")
    unit = 2;
    
  let buyer = partnerWallet.value;
  let seller = account;
  if(buyerSwitch.checked == true){
    buyer = account;
    seller = partnerWallet.value;
  }
  console.log(typeof(value));
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
    id: id,
  });

  fetch("/fetch/updateDeal", { method: "post", body, headers })
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
      // return json.list[0];
    })
    .catch((err) => {
      console.log(err);
      CreateToast(true, err);
    });
}

export { updateHistory, createDeal, updateDeal };