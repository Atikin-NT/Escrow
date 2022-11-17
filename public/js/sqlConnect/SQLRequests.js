import { CreateToast } from "../frontend/Toasts.js";
import { showCurrentDeal } from "../sqlConnect/changeView.js";
import { escrowProvider, getFeeData } from "../web3/Web3Layer.js";

let buyerSwitch = document.getElementById("buyer-role");
let partnerWallet = document.getElementById("deal-partner");
let transactionAmount = document.getElementById("transaction-amount");
let etherUnit = document.getElementById("ether-unit");
let historyList = document.getElementById("history-list");
let feeRoleBuyer = document.getElementById("fee-role-buyer");
let feeDiscount = document.getElementById("discount");

const headers = { "Content-Type": "application/json" };

function updateElementsID(){
  buyerSwitch = document.getElementById("buyer-role");
  partnerWallet = document.getElementById("deal-partner");
  transactionAmount = document.getElementById("transaction-amount");
  etherUnit = document.getElementById("ether-unit");
  historyList = document.getElementById("history-list");
  feeRoleBuyer = document.getElementById("fee-role-buyer");
  feeDiscount = document.getElementById("discount");
}

const getBody = async (account) => {
  let value = Number(transactionAmount.value);
  if(!ethers.utils.isAddress(partnerWallet.value) || !ethers.utils.isAddress(account) || partnerWallet.value == account)
    throw "invalid partner address";
  if(value <= 0)
    throw "invalid value";
  const ethUnit = etherUnit.options[etherUnit.selectedIndex].value;
  if(ethUnit == "USD"){
    const inUSD = value;
    let [gasInWei, ethUsd] = await getFeeData();
    value = inUSD * 1e8 / ethUsd.toNumber();
  }

  let buyer = partnerWallet.value;
  let seller = account;
  let sellerIsAdmin = 1;
  if(buyerSwitch.checked == true){
    buyer = account;
    seller = partnerWallet.value;
    sellerIsAdmin = 0;
  }

  let feeAmount = value * 0.02;
  let feeRole = 2; // 1 - 50/50   0 - buyer   2 - seller
  if(feeRoleBuyer.checked == true){
    feeRole = 0;
  }
  if(feeDiscount.checked == true){
    feeRole = 1;
  }

  return {
    buyer: buyer,
    seller: seller,
    value: value,
    sellerIsAdmin: sellerIsAdmin,
    fee: feeAmount,
    feeRole: feeRole,
  };
}

const getRes = async (url, body, jsonCall, failurCall) => {
  let res = -1;
  try {
    const resp = await fetch(url, { method: "post", body, headers });
    if (resp.status < 200 || resp.status >= 300)
      throw new Error("connect error");

    const json = await resp.json();
    res = jsonCall(json);
  } catch (err) {
    failurCall(err);
  }
  return res;
}

const createDeal = async (account) => {
  updateElementsID();
  let body = await getBody(account);
  body = JSON.stringify(body);

  const jsonCall = (json) => {
    let res = -1;
    if (json.code != 0)
      CreateToast(true, json.msg);
    else{
      CreateToast(false, json.msg);
      res = json.list[0];
    }
    return res;
  }
  const res = await getRes("/fetch/createDeal", body, jsonCall, (err) => {
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
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
      }
      for(let i = json.list.length - 1; i >= 0 && i > json.list.length - count; i--){
        const element = json.list[i];
        let li = document.createElement("li");
        li.className = "historyLi"
        li.addEventListener('click', (evt) => {
            showCurrentDeal(element.id, account, element.status);
        })
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
        // if(i%2 == 1) li.classList.add('bg-light');

        let div = document.createElement("div");
        div.className = "history-div";
        if (element.status == 4) div.classList.add("txt-success");

        let h6 = document.createElement("h6");
        h6.classList.add("text-container", "my-0");

        let role = "buyer";
        if(account == element.seller) {h6.innerHTML = shortWallet(element.buyer, 4, 5); role = "seller"; }
        else h6.innerHTML = shortWallet(element.seller, 4, 5);
        div.appendChild(h6);

        let small = document.createElement("small");
        small.classList.add("txt", element.status == 4 ? "txt-succsess" : "txt-muted");
        small.innerHTML = `id: ${element.id}, role: ${role}, status: ${element.status + 1}`;
        div.appendChild(small);

        let span = document.createElement("span");
        span.classList.add("txt", element.status == 4 ? "txt-success" : "txt-muted");
        // if (element.status == 4) span.className = "txt-success";
        // else span.className = 'text-muted';
        span.innerHTML = `${element.value} Ether`;
        
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

const updateDeal = async (account, id) => {
  updateElementsID();
  let body = await getBody(account); body.id = id;
  body = JSON.stringify(body);

  const jsonCall = (json) => {
    let res = -1;
    if (json.code != 0)
      CreateToast(true, json.msg);
    else{
      CreateToast(false, json.msg);
      res = json.list[0];
    }
    return res;
  }
  const res = await getRes("/fetch/updateDeal", body, jsonCall, (err) => {
    console.log(err);
    CreateToast(true, err);
  });
  return res;
}

const getDealById = async(id) => {
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
  });
  const jsonCall = (json) => {
    let res = -1;
    if(json.code == 0)
      res = json.list[0];
    return res;
  }
  const res = await getRes("/fetch/getDealById", body, jsonCall, (err) => { console.log(err);});
  return res;
} 

const setTxId = async (id, txId) => {
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
    txId: txId,
  });

  const jsonCall = (json) => {
    let res = -1;
    if(json.code == 0)
      res = 0
    return res;
  }
  const res = getRes("/fetch/updateTxId", body, jsonCall, (err) => { console.log(err);});
  return res;
}

const deleteDeal = async (id) => {
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
  });

  const jsonCall = (json) => {
    let res = -1;
    if(json.code == 0)
      res = 0
    return res;
  }

  const res = getRes("/fetch/deleteDeal", body, jsonCall, (err) => { console.log(err);});
  return res;
}

export { updateHistory, createDeal, updateDeal, getDealById, setTxId, deleteDeal };