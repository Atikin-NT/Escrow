import { MetaMaskWallet } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory } from "./SQLRequests.js";

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

async function changeProgressState(status) {
    const progress = document.getElementById("progress");
    // console.log(progress.classList[0]);
    progress.classList.remove(progress.classList[0]);
    progress.classList.add(`progress-${status+1}`);
}
const ds = parseInt(document.getElementById("deal-status"));
const status = 2;

function changeDeal(dealID, account){
    fetch(`view/changeDealView?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        console.log(resp);
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
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
        changeProgressState(status);
    })
    .catch((err) => {
        console.log(err);
    });
}

function changeDealStatus(dealID, account, status){
    fetch(`view/inProgressView?dealid=${dealID}&account=${account}&status=${status}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        console.log(html);
        bodyInput.innerHTML = html;
        bodyTitle.innerHTML = "In Progress";

        const approveDealBtn = document.getElementById("next-deal-step");
        approveDealBtn.addEventListener('click', (evt) => {
            changeDealStatus(dealID, account, status+1);
        });
        updateHistory(account);
        changeProgressState(status);
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
        bodyInput.innerHTML = html;
        // bodyTitle.innerHTML = "Wait For Confirmation";
        const changeBtn = document.getElementById("change-deal-step");
        changeBtn.addEventListener('click', (evt) => {
            changeDeal(dealID, account);
        });

        const approveDealBtn = document.getElementById("next-deal-step");
        approveDealBtn.addEventListener('click', (evt) => {
            changeDealStatus(dealID, account, 1);
        });
        updateHistory(account);
        changeProgressState(status);
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