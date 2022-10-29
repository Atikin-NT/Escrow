import { MetaMaskWallet } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };

function showCurrentDeal(dealID, account, status){
    switch(status){
        case 0:
            approveByPartner(dealID, account);
            break;
        case 1:
            inProgress(dealID, account);
            break;
        default:
            alert("Cant`t find");
    }
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
        document.body.innerHTML = html;
        const changeDealFormClick = document.getElementById("create-deal-btn");
        changeDealFormClick.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            if(MetaMaskWallet == null){
                CreateToast(true, "Login error");
                evt.stopImmediatePropagation();
            }
            try {
                const createID = await updateDeal(MetaMaskWallet[0], dealID); // TODO: при создании надо возращать текущую сделку
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

function inProgress(dealID, account){
    fetch(`view/inProgressView?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((html) => {
        document.body.innerHTML = html;
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
        document.body.innerHTML = html;
        const changeBtn = document.getElementById("change-deal-step");
        changeBtn.addEventListener('click', (evt) => {
            changeDeal(dealID, account);
        });

        const approveDealBtn = document.getElementById("next-deal-step");
        approveDealBtn.addEventListener('click', (evt) => {
            inProgress(dealID, account);
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