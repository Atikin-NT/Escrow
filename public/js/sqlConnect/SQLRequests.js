import { CreateToast } from "../frontend/Toasts.js";
import { showCurrentDeal } from "../sqlConnect/changeView.js";
import { escrowProvider, getFeeData } from "../web3/Web3Layer.js";

let buyerSwitch = document.getElementById("buyer-role");
let partnerWallet = document.getElementById("deal-partner");
let transactionAmount = document.getElementById("transaction-amount");
let etherUnit = document.getElementById("ether-unit");
let historyList = document.getElementById("history-list");
let fee = document.getElementById("fee-p");
let feeRoleBuyer = document.getElementById("fee-role-buyer");
let feeDiscount = document.getElementById("discount");

const headers = { "Content-Type": "application/json" };

function updateElementsID(){
  buyerSwitch = document.getElementById("buyer-role");
  partnerWallet = document.getElementById("deal-partner");
  transactionAmount = document.getElementById("transaction-amount");
  etherUnit = document.getElementById("ether-unit");
  historyList = document.getElementById("history-list");
  fee = document.getElementById("fee-p");
  feeRoleBuyer = document.getElementById("fee-role-buyer");
  feeDiscount = document.getElementById("discount");
}

async function createDeal(account){
  updateElementsID();
  let value = parseInt(transactionAmount.value);
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
  if(ethUnit == "USD"){
    const inUSD = value;
    let gasInWei, ethUsd;
    [gasInWei, ethUsd] = await getFeeData();
    value = inUSD * 1e8 / ethUsd.toNumber();
    unit = 2; //in ETH
  }
    
  let buyer = partnerWallet.value;
  let seller = account;
  let sellerIsAdmin = 1;
  if(buyerSwitch.checked == true){
    buyer = account;
    seller = partnerWallet.value;
    sellerIsAdmin = 0;
  }

  //0x70997970C51812dc3A010C7d01b50e0d17dc79C8

  let feeAmount = value * 0.02;
  let feeRole = 2; // 0 - 50/50   1 - buyer   2 - seller
  if(feeRoleBuyer.checked == true){
    feeRole = 1;
  }
  if(feeDiscount.checked == true){
    feeRole = 0;
  }
  
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
    sellerIsAdmin: sellerIsAdmin,
    fee: feeAmount,
    feeRole: feeRole,
  });

  let res = -1;

  await fetch("/fetch/createDeal", { method: "post", body, headers })
    .then(async(resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then(async(json) => {
      console.log(json);
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

function shortWallet(wallet, n, m) {
  if (n === undefined && m === undefined) {
    n = wallet.length;
    m = 0;
  }
  const newWallet = wallet.slice(0, n) + "..." + wallet.slice(wallet.length - m, wallet.length);
  return newWallet;
}

function updateHistory(account, count = 5){
  account = String(account).toLowerCase();
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
      for(let i = json.list.length - 1; i >= 0 && i > json.list.length - count; i--){
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
        if(account == element.seller) {h6.innerHTML = shortWallet(element.buyer, 4, 5); role = "seller"; }
        else h6.innerHTML = shortWallet(element.seller, 4, 5);
        div.appendChild(h6);

        let small = document.createElement("small");
        small.className = 'text-muted';
        small.innerHTML = `id: ${element.id}, role: ${role}, status: ${element.status + 1}`;
        div.appendChild(small);

        const unitList = ["Wei", "Gwei", "Eth", "USD"];
        let span = document.createElement("span");
        span.className = 'text-muted';
        span.innerHTML = `${element.value} ${unitList[element.unit]}`;
        
        li.appendChild(div);
        li.appendChild(span);
        historyList.appendChild(li);
      }
      if(json.code != 0)
        CreateToast(true, json.msg);
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
  let sellerIsAdmin = 1;
  if(buyerSwitch.checked == true){
    buyer = account;
    seller = partnerWallet.value;
    sellerIsAdmin = 0;
  }

  let feeAmount = value * 0.02;
  let feeRole = 2; // 0 - 50/50   1 - buyer   2 - seller
  if(feeRoleBuyer.checked == true){
    feeRole = 1;
  }
  if(feeDiscount.checked == true){
    feeRole = 0;
  }
  
  const body = JSON.stringify({
    buyer: buyer,
    seller: seller,
    value: value,
    unit: unit,
    id: id,
    sellerIsAdmin: sellerIsAdmin,
    fee: feeAmount,
    feeRole: feeRole,
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

async function getDealById(id){
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
  });
  let res = -1;

  await fetch("/fetch/getDealById", { method: "post", body, headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      if(json.code == 0)
        res = json.list[0];
    })
    .catch((err) => {
      console.log(err);
  });
  return res;
} 

async function setTxId(id, txId){
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
    txId: txId,
  });
  let res = -1;

  await fetch("/fetch/updateTxId", { method: "post", body, headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      if(json.code == 0)
        res = 0
    })
    .catch((err) => {
      console.log(err);
  });
  return res;
}

async function deleteDeal(id){
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
  });
  let res = -1;

  await fetch("/fetch/deleteDeal", { method: "post", body, headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      if(json.code == 0)
        res = 0
    })
    .catch((err) => {
      console.log(err);
  });
  return res;
}

export { updateHistory, createDeal, updateDeal, getDealById, setTxId, deleteDeal };