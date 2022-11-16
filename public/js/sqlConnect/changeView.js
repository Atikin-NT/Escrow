import { MetaMaskWallet, escrowProvider } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory, getDealById, setTxId, deleteDeal } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

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
        const show = document.getElementById("show-account");
        show.textContent = account;
    }
}

let currentActiveCircle = -1;
async function changeProgressState(newState) {
    const progress = document.getElementById("progress");
    const circles = document.getElementsByClassName("circle");
    if (newState - currentActiveCircle == 1) {
        circles[currentActiveCircle + 1].classList.add("active");
        progress.classList.remove(`progress-${currentActiveCircle}`)
        progress.classList.add(`progress-${newState}`);
        currentActiveCircle++;
    } else if (currentActiveCircle - newState == 1) {
        circles[currentActiveCircle].classList.remove("active");
        progress.classList.remove(`progress-${currentActiveCircle}`);
        progress.classList.add(`progress-${newState}`);
        currentActiveCircle--;
    } else if (newState > currentActiveCircle) {
        progress.classList.remove(`progress-${currentActiveCircle}`);
        progress.classList.add(`progress-${newState}`);
        for (let i = currentActiveCircle + 1; i <= newState; i++) {
            // console.log(i);
            circles[i].classList.add("active");
            currentActiveCircle++;
        }
    } else if (newState < currentActiveCircle) {
        progress.classList.remove(`progress-${currentActiveCircle}`);
        for (let i = currentActiveCircle; i > newState; i--) {
            circles[i].classList.remove("active");
            currentActiveCircle--;
        }
        progress.classList.add(`progress-${newState}`);
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
        changeProgressState(-1);
        bodyInput.innerHTML = html;
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
        const buyerSwitch = document.getElementById("buyer-role");
        const sellerSwitch = document.getElementById("seller-role");
        const dealPartnerLabel = document.getElementById("deal-partner-label");
        buyerSwitch.addEventListener('click', (evt) => { //we are buyer
            dealPartnerLabel.innerHTML = "Seller address";
        });
    
        sellerSwitch.addEventListener('click', (evt) => { //we are seller
            dealPartnerLabel.innerHTML = "Buyer address";
        });
        updateHistory(account);
    })
    .catch((err) => {
        console.log(err);
    });
}

async function changeDealStatus(dealID, account, status){
    let answerDealById = await getDealById(dealID);
    if(answerDealById == -1) {
        throw "Deal Not Found";
    }

    let txId = "0";
    if(status != 0)
        txId = answerDealById.txId;
    try {
        let transaction = null;
        let current_value = -1;
        if(status != answerDealById.status){
            switch(status){
                case 1:
                    showLoader();
                    current_value = ethers.utils.parseEther(String(answerDealById.value));
                    transaction = await escrowProvider.create(answerDealById.buyer, answerDealById.seller, current_value, answerDealById.feeRole);
                    break;
                case 2:
                    showLoader();
                    current_value = ethers.utils.parseEther(String(answerDealById.value));
                    transaction = await escrowProvider.sendB(answerDealById.txId, {value: current_value});
                    break;
                case 3:
                    showLoader();
                    transaction = await escrowProvider.sendS(answerDealById.txId);
                    break;
                case 4:
                    showLoader();
                    transaction = await escrowProvider.approve(answerDealById.txId);
                    break;
                case -1:
                    showLoader();
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
            txId = tx.events[0].args.TxId;
            if(status == 1){
                console.log("set tx");
                await setTxId(dealID, txId);
            }
            if(status == -1){
                CreateToast(false, "Deal has been deleted");
                await deleteDeal(dealID);
                window.location.reload();
                return;
            }
            hiddenLoader();
        }
    } catch (err) {
        hiddenLoader();
        console.error(err);
        CreateToast(true, "Something went wrong :(");
        return;
    }

    fetch(`view/inProgressView?dealid=${dealID}&account=${account}&status=${status}`, { headers }) 
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then(async (html) => {
        await changeProgressState(status);
        bodyInput.innerHTML = html;

        const approveDealBtn = document.getElementById("next-deal-step");
        if(approveDealBtn != null){
            approveDealBtn.addEventListener('click', async (evt) => {
                await changeDealStatus(dealID, account, status+1);
            });
        }
        const cancelDealBtn = document.getElementById("cancel-deal");
        if(cancelDealBtn != null){
            cancelDealBtn.addEventListener('click', async (evt) => {
                await changeDealStatus(dealID, account, -1);
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
    .then(async (html) => {
        // console.log("set state 1");
        await changeProgressState(0);
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
        if(cancelDealBtn != null){
            cancelDealBtn.addEventListener('click', async (evt) => {
                CreateToast(false, "Deal has been deleted");
                await deleteDeal(dealID);
                window.location.reload();
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