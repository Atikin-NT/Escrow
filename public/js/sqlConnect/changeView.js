import { MetaMaskWallet, escrowProvider } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory, getDealById, setTxId } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");
let bodyTitle = document.getElementById("title");

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
        const show = document.getElementById("show-account");
        show.textContent = account;
    }
}

let currentActiveCircle = 0;

async function changeProgressState(state) {
    console.log(currentActiveCircle);
    const progress = document.getElementById("progress");
    const circles = document.getElementsByClassName("circle");

    if (state - currentActiveCircle == 1) {
        currentActiveCircle++;
        circles[currentActiveCircle].classList.add("active");
        progress.classList.add(`progress-${state}`);
    } else if (currentActiveCircle - state) {
        circles[currentActiveCircle].classList.remove("active");
        progress.classList.add(`progress-${state}`);
        currentActiveCircle--;
    }

    console.log(currentActiveCircle);

    // for (let i = 0; i < 5; i++) {
    //     i <= state ? circles[i].classList.add("active") : circles[i].classList.remove("active");
    // }

    // progress.classList.remove(progress.classList[0]);
    // progress.classList.add(`progress-${state}`);
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
        changeProgressState(0);
        bodyInput.innerHTML = html;
        bodyTitle.innerHTML = "Change Form";
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
    let answerDealById = await getDealById(dealID);
    if(answerDealById == -1)
        throw "Deal Not Found";

    let txId = "0";
    if(status != 0)
        txId = answerDealById.txId;
    console.log("Change Deal----------");
    try {
        let transaction = null;
        console.log(transaction, txId, status);
        if(status != answerDealById.status){
            switch(status){
                case 1:
                    transaction = await escrowProvider.create(answerDealById.buyer, answerDealById.seller, parseInt(answerDealById.value));
                    console.log(transaction, txId);
                    break;
                case 2:
                    transaction = await escrowProvider.sendB(answerDealById.txId, {value: answerDealById.value});
                    break;
                case 3:
                    transaction = await escrowProvider.sendS(answerDealById.txId);
                    break;
                case 4:
                    transaction = await escrowProvider.approve(answerDealById.txId);
                    break;
                default:
                    console.log("Unknown error");
            }
            const tx = await transaction.wait();
            txId = tx.events[0].args.TxId;
            console.log(txId);
            if(status == 1){
                console.log("set tx");
                setTxId(dealID, txId);
            }
        }
        //TODO: Toast ok
    } catch (err) {
        console.error(err);
        //TODO: Toast error
    }
    console.log("End Change Deal----------")

    fetch(`view/inProgressView?dealid=${dealID}&account=${account}&status=${status}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        changeProgressState(1);
        bodyInput.innerHTML = html;

        const approveDealBtn = document.getElementById("next-deal-step");
        if(approveDealBtn != null){
            approveDealBtn.addEventListener('click', (evt) => {
                changeDealStatus(dealID, account, status+1);
            });
        }
        updateHistory(account);
    })
    .catch((err) => {
        console.log(err);
    });
}

function approveByPartner(dealID, account){
    // IDEA: сделать проверку по паре (id пользователя в сделке / txid сделки)
    fetch(`view/approveByPartner?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        changeProgressState(1);
        bodyInput.innerHTML = html;
        const changeBtn = document.getElementById("change-deal-step");
        changeBtn.addEventListener('click', (evt) => {
            changeDeal(dealID, account);
        });

        const approveDealBtn = document.getElementById("next-deal-step");
        approveDealBtn.addEventListener('click', (evt) => {
            changeDealStatus(dealID, account, 1);
        });
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