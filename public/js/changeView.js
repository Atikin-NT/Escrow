import { MetaMaskWallet } from "./Web3Layer.js";
import { CreateToast } from "./Toasts.js";
import { updateDeal } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };

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
        const changeDealFormClick = document.getElementById("change-deal-btn");
        changeDealFormClick.addEventListener('submit', (evt) => {
            evt.preventDefault();
            if(MetaMaskWallet == null){
                CreateToast(true, "Login error");
                evt.stopImmediatePropagation();
            }
            try {
                const createID = updateDeal(MetaMaskWallet[0], 74); // TODO: при создании надо возращать текущую сделку
                approveByPartner(74, MetaMaskWallet[0]);
            } catch (error) {
                CreateToast(true, error);
            }
        });
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
        const cahngeBtn = document.getElementById("change-deal-step");
        cahngeBtn.addEventListener('click', (evt) => {
            changeDeal(74, account);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

export { 
    approveByPartner, 
    changeDeal 
};

/*
TODO: на бд добавить доп поле для проверки ключа (автор сделки и ее txid)

TODO: добавить error html, если бд не смогла сделать какой-то запрос
*/