import { CreateToast } from "../frontend/Toasts.js";
import { showCurrentDeal } from "../sqlConnect/changeView.js";

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

async function createDeal(account){
  updateElementsID();
  // console.log("create");
  const value = parseInt(transactionAmount.value);
  if(!ethers.utils.isAddress(partnerWallet.value) || !ethers.utils.isAddress(account) || partnerWallet.value == account)
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
  // console.log(typeof(value));
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
  });

  let res = -1;

  await fetch("/fetch/createDeal", { method: "post", body, headers })
    .then(async(resp) => {
      // console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then(async(json) => {
      // console.log(json);
      if(json.code != 0)
        CreateToast(true, json.msg)
      else{
        CreateToast(false, json.msg);
        res = json.list[0];
      }
    })
    .catch(async(err) => {
      console.log(err);
      CreateToast(true, err);
  });
  return res;
}

function updateHistory(account){
  updateElementsID();
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
      for(let i = json.list.length - 1; i > json.list.length - 6; i--){
        let element = json.list[i];
        let li = document.createElement("li");
        li.addEventListener('click', (evt) => {
            showCurrentDeal(element.id, account, element.status);
        })
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
        if(i%2 == 1) li.classList.add('bg-light');

        let div = document.createElement("div");
        div.className = "history-div";

        let h6 = document.createElement("h6");
        h6.classList.add("text-container", "my-0");

        let role = "buyer";
        if(account == element.seller) {h6.innerHTML = element.buyer; role = "seller"; }
        else h6.innerHTML = element.seller;
        div.appendChild(h6);

        let small = document.createElement("small");
        small.className = 'text-muted';
        small.innerHTML = `id: ${element.id}, role: ${role}, status: ${element.status}`;
        div.appendChild(small);

        const unitList = ["Wei", "Gwei", "Ether"];
        let span = document.createElement("span");
        span.className = 'text-muted';
        span.innerHTML = `${element.value} ${unitList[element.unit]}`;
        
        li.appendChild(div);
        li.appendChild(span);
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

async function updateDeal(account, id){
  updateElementsID();
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
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
    id: id,
  });
  let res = -1;

  await fetch("/fetch/updateDeal", { method: "post", body, headers })
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
      else{
        CreateToast(false, json.msg);
        res = json.list[0];
      }
    })
    .catch((err) => {
      console.log(err);
      CreateToast(true, err);
  });
  return res;
}

export { updateHistory, createDeal, updateDeal };