import { MetaMaskWallet, escrowProvider } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory, getDealById, setTxId, deleteDeal } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");
let bodyTitle = document.getElementById("title");

function showLoader() {
    const loader = document.getElementById("load-section");
    if (loader == null) console.error(`Element "Loader" is not found.`);
    else {
        try {
            loader.classList.remove("end-animation");
        } catch {};
        loader.classList.add("start-animation")
        loader.classList.add("op-1");
        loader.classList.remove("op-0");
    }
    
}
function hiddenLoader() {
    const loader = document.getElementById("load-section");
    if (loader == null) {
        console.error(`Element "Loader" is not found.`)
    } else {
        loader.classList.remove("start-animation")
        loader.classList.add("end-animation");
        loader.classList.add("op-0");
        loader.classList.remove("op-1");
        
    }
}


function showCurrentDeal(dealID, account, status){
    if(status == 0){
        approveByPartner(dealID, account);
        return;
    }
    changeDealStatus(dealID, account, status);
}

const updateConnectionBtn = (account) => {
    const button = document.getElementById("connectButton");
    if (button !== null && account != null) {
        button.remove();
        const showLoader = document.getElementById("showLoader-account");
        showLoader.textContent = account;
    }
}

let currentActiveCircle = 0;

async function changeProgressState(state) {
    // console.log(currentActiveCircle, state);
    const progress = document.getElementById("progress");
    const circles = document.getElementsByClassName("circle");

    if (state - currentActiveCircle == 1) {
        circles[currentActiveCircle + 1].classList.add("active");
        progress.classList.remove(`progress-${currentActiveCircle}`)
        progress.classList.add(`progress-${state}`);
        currentActiveCircle++;
    } else if (currentActiveCircle - state == 1) {
        circles[currentActiveCircle].classList.remove("active");
        progress.classList.remove(`progress-${currentActiveCircle}`);
        progress.classList.add(`progress-${state}`);
        currentActiveCircle--;
    } else if (state > currentActiveCircle) {
        progress.classList.remove(`progress-${currentActiveCircle}`);
        progress.classList.add(`progress-${state}`);
        for (let i = currentActiveCircle + 1; i <= state; i++) {
            console.log(i);
            circles[i].classList.add("active");
            currentActiveCircle++;
        }
    } else if (state < currentActiveCircle) {
        progress.classList.remove(`progress-${currentActiveCircle}`);
        for (let i = currentActiveCircle; i > state; i--) {
            circles[i].classList.remove("active");
            currentActiveCircle--;
        }
        progress.classList.add(`progress-${state}`);
    }
    // console.log(currentActiveCircle);
}

function changeDeal(dealID, account){
    fetch(`view/changeDealView?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        console.log(resp);
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        // console.log("set state 0");
        changeProgressState(0);
        bodyInput.innerHTML = html;
        // bodyTitle.innerHTML = "Change Form";
        updateConnectionBtn(account);
        const changeDealFormClick = document.getElementById("create-deal-btn");
        changeDealFormClick.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            if(MetaMaskWallet == null){
                CreateToast(true, "Login error");
                evt.stopImmediatePropagation();
            }
            try {
                const createID = await updateDeal(MetaMaskWallet[0], dealID);
                approveByPartner(createID, MetaMaskWallet[0]);
            } catch (error) {
                CreateToast(true, error);
            }
        });
        updateHistory(account);
    })
    .catch((err) => {
        console.log(err);
    });
}



async function changeDealStatus(dealID, account, status){
    showLoader();
    let answerDealById = await getDealById(dealID);
    if(answerDealById == -1) {
        hiddenLoader();
        throw "Deal Not Found";
    }

    let txId = "0";
    if(status != 0)
        txId = answerDealById.txId;
    console.log("Change Deal----------");
    try {
        let transaction = null;
        let current_value = -1;
        console.log(transaction, txId, status);
        if(status != answerDealById.status){
            switch(status){
                case 1:
                    current_value = ethers.utils.hexlify(BigInt(answerDealById.value * Math.pow(10, answerDealById.unit * 9)));
                    transaction = await escrowProvider.create(answerDealById.buyer, answerDealById.seller, current_value, answerDealById.feeRole);
                    console.log(transaction, txId);
                    break;
                case 2:
                    current_value = ethers.utils.hexlify(BigInt(answerDealById.value * Math.pow(10, answerDealById.unit * 9)));
                    transaction = await escrowProvider.sendB(answerDealById.txId, {value: current_value});
                    break;
                case 3:
                    transaction = await escrowProvider.sendS(answerDealById.txId);
                    break;
                case 4:
                    transaction = await escrowProvider.approve(answerDealById.txId);
                    break;
                case -1:
                    if(answerDealById.status != 3){
                        transaction = await escrowProvider.cancel(answerDealById.txId);
                    }
                    else{
                        transaction = await escrowProvider.disapprove(answerDealById.txId);
                    }
                    break;
                default:
                    console.log("Unknown error");
                    break;
            }
            const tx = await transaction.wait();
            console.log(tx);
            txId = tx.events[0].args.TxId;
            if(status == 1){
                console.log("set tx");
                setTxId(dealID, txId);
            }
            if(status == -1){
                CreateToast(false, "Deal has been deleted");
                deleteDeal(dealID);
                window.location.reload();
                return;
            }
        }
    } catch (err) {
        hiddenLoader();
        console.error(err);
        CreateToast(true, "Something went wrong :(");
        return;
    }
    console.log("End Change Deal----------")

    fetch(`view/inProgressView?dealid=${dealID}&account=${account}&status=${status}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        changeProgressState(status);
        bodyInput.innerHTML = html;

        const approveDealBtn = document.getElementById("next-deal-step");
        if(approveDealBtn != null){
            approveDealBtn.addEventListener('click', (evt) => {
                changeDealStatus(dealID, account, status+1);
            });
        }
        const cancelDealBtn = document.getElementById("cancel-deal");
        if(cancelDealBtn != null){
            cancelDealBtn.addEventListener('click', (evt) => {
                changeDealStatus(dealID, account, -1);
            });
        }
        updateHistory(account);
    })
    .catch((err) => {
        console.log(err);
    });
}
//0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
function approveByPartner(dealID, account){
    // IDEA: сделать проверку по паре (id пользователя в сделке / txid сделки)
    fetch(`view/approveByPartner?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        // console.log("set state 1");
        changeProgressState(1);
        bodyInput.innerHTML = html;
        const changeBtn = document.getElementById("change-deal-step");
        if(changeBtn != null){
            changeBtn.addEventListener('click', (evt) => {
                changeDeal(dealID, account);
            });
        }

        const approveDealBtn = document.getElementById("next-deal-step");
        if(approveDealBtn != null){
            approveDealBtn.addEventListener('click', (evt) => {
                changeDealStatus(dealID, account, 1);
            });
        }

        const cancelDealBtn = document.getElementById("cancel-deal");
        console.log(cancelDealBtn);
        if(cancelDealBtn != null){
            cancelDealBtn.addEventListener('click', (evt) => {
                CreateToast(false, "Deal has been deleted");
                deleteDeal(dealID);
            });
        }

        updateHistory(account);
    })
    .catch((err) => {
        console.log(err);
    });
}

export { 
    approveByPartner, 
    changeDeal,
    showCurrentDeal,
};

/*
TODO: на бд добавить доп поле для проверки ключа (автор сделки и ее txid)

TODO: добавить error html, если бд не смогла сделать какой-то запрос
*/