import { CreateToast } from "../frontend/Toasts.js";
import { showCurrentDeal } from "../sqlConnect/changeView.js";
import { getFeeData } from "../web3/Web3Layer.js";
const myStorage = window.localStorage;

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
  let method = (body) ? "post" : "get";
  let res = -1;
  try {
    const resp = await fetch(url, { method: method, body, headers });
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

const genList = (list, account, listener, sort) => {
  historyList.innerHTML = '';
  let tmpArr = [];

  for (let i = 0; i < list.length; i++) { 
    const element = list[i];
    const li = document.createElement("li");
    li.className = "historyLi"
    li.addEventListener('click', (evt) => { listener(element.id, account, element.status); });
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
  
    const div = document.createElement("div");
    div.className = "history-div";
    //----\
    if (element.status == 4) div.classList.add("text-success");
    else if (element.arbitrator != null) div.classList.add("text-danger");
    //----/
    
    const h6 = document.createElement("h6");
    h6.classList.add("text-container", "my-0");
  
    let role = "buyer";
    if (account == element.seller) {h6.innerHTML = shortWallet(element.buyer, 4, 5); role = "seller"; }
    else h6.innerHTML = shortWallet(element.seller, 4, 5);
    div.appendChild(h6);
  
    const small = document.createElement("small");
    //----\
    small.classList.add("txt");
    if (element.status == 4) small.classList.add("text-success");
    else if (element.arbitrator != null) small.classList.add("text-danger");
    else small.classList.add("txt-muted");
    //----/
    small.innerHTML = `id: ${element.id}, role: ${role}, status: ${element.status + 1}`;
    div.appendChild(small);
  
    const span = document.createElement("span");
    //----\
    span.classList.add("txt");
    if (element.status == 4) span.classList.add("text-success");
    else if (element.arbitrator != null) span.classList.add("text-danger");
    else span.classList.add("txt-muted");
    //----/
    span.innerHTML = `${element.value} Ether`;
    
    li.appendChild(div);
    li.appendChild(span);

    if (sort && element.arbitrator == null) {
      tmpArr.push(li);
    }else {
      historyList.appendChild(li); 
    }
  }
  if (sort) {
    while (tmpArr.length != 0) {
      historyList.appendChild(tmpArr.shift());
    }
  }
}

async function updateHistory(account, fetchMethod = 'getDeals', listener = showCurrentDeal, count = 5, sort){
  account = account.toLowerCase();
  updateElementsID();
  try {
    const resp = await fetch(`/fetch/${fetchMethod}?account=${account}&limit=${count}`, { headers })
    if (resp.status < 200 || resp.status >= 300) throw new Error("connect error");

    const json = await resp.json();
    console.log(json);
    genList(json.list, account, listener, sort);

    if(json.code != 0)
      CreateToast(true, json.msg);
  } catch (err) {
    console.log(err);
    CreateToast(true, err);
  }
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
  
  const jsonCall = (json) => {
    let res = -1;
    if(json.code == 0)
      res = json.list[0];
    return res;
  }
  const res = await getRes(`/fetch/getDealById?id=${id}`, null, jsonCall, (err) => { console.log(err);});
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
  const res = await getRes("/fetch/updateTxId", body, jsonCall, (err) => { console.log(err);});
  return res;
}

const setTxHash = async (id, txHash) => {
  if(id <= 0)
    throw "invalid value";
  
  const body = JSON.stringify({
    id: id,
    txHash: txHash,
  });

  const jsonCall = (json) => {
    let res = -1;
    if(json.code == 0)
      res = 0
    return res;
  }
  const res = await getRes("/fetch/updateTxHash", body, jsonCall, (err) => { console.log(err);});
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

  const res = await getRes("/fetch/deleteDeal", body, jsonCall, (err) => { console.log(err);});
  return res;
}

const updateEthUsd = async () => {
  const [gasInWei, ethUsd] = await getFeeData();
  myStorage.setItem("ethUsd", ethUsd.toString());
}

const ETHtoUSD = async (eth) => { 
  if (!myStorage.getItem('ethUsd')) await updateEthUsd();
  const ethUsd = Number(myStorage.getItem('ethUsd'));
  return ethUsd * eth / 1e8; 
}

export { updateHistory, createDeal, updateDeal, getDealById, setTxId, setTxHash, deleteDeal, updateEthUsd, ETHtoUSD };