import { MetaMaskWallet, escrowProvider } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory, getDealById, setTxId, deleteDeal } from "./SQLRequests.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

function showLoader() {
    const loader = document.getElementById("load-section");
    const boxes = document.getElementById("boxesSection");
    if (loader == null && boxes == null) console.error(`Element "Loader or Box" is not found.`);
    else {
        try {
            loader.classList.remove("end-animation-bg");
            boxes.classList.remove("end-animation-op");
        } catch {};
        loader.classList.add("start-animation-bg");
        boxes.classList.add("start-animation-op")
        loader.classList.add("bg-1");
        boxes.classList.add("op-1");
        loader.classList.remove("bg-0");
        boxes.classList.remove("op-0");
    }
    
}
function hiddenLoader() {
    const loader = document.getElementById("load-section");
    const boxes = document.getElementById("boxesSection");
    if (loader == null && boxes == null) {
        console.error(`Element "Loader or Box" is not found.`);
    } else {
        loader.classList.remove("start-animation-bg");
        boxes.classList.remove("start-animation-op");
        loader.classList.add("end-animation-bg");
        boxes.classList.add("end-animation-op");
        loader.classList.add("bg-0");
        boxes.classList.add("op-0");
        loader.classList.remove("bg-1");
        boxes.classList.remove("op-1");
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
}

function changeDeal(dealID, account){
    fetch(`view/changeDealView?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
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
        let current_value = -1;
        if(status != answerDealById.status){
            switch(status){
                case 1:
                    showLoader();
                    current_value = ethers.utils.parseEther(String(answerDealById.value));
                    let transaction = await escrowProvider.create(answerDealById.buyer, answerDealById.seller, current_value, answerDealById.feeRole);
                    const tx = await transaction.wait();
                    txId = tx.events[0].args.TxId;
                    await setTxId(dealID, txId);
                    break;
                case 2:
                    showLoader();
                    current_value = ethers.utils.parseEther(String(answerDealById.value));
                    await escrowProvider.sendB(answerDealById.txId, {value: current_value});
                    break;
                case 3:
                    showLoader();
                    await escrowProvider.sendS(answerDealById.txId);
                    break;
                case 4:
                    showLoader();
                    await escrowProvider.approve(answerDealById.txId);
                    break;
                case -1:
                    showLoader();
                    if(answerDealById.status != 3){
                        await escrowProvider.cancel(answerDealById.txId);
                    }
                    else{
                        await escrowProvider.disapprove(answerDealById.txId);
                    }
                    CreateToast(false, "Deal has been deleted");
                    await deleteDeal(dealID);
                    window.location.reload();
                    return;
                    break;
                default:
                    console.log("Unknown error");
                    break;
            }
            hiddenLoader();
        }
    } catch (err) {
        hiddenLoader();
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
    fetch(`view/approveByPartner?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then(async (html) => {
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