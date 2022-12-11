import { MetaMaskWallet, escrowProvider } from "../web3/Web3Layer.js";
import { CreateToast } from "../frontend/Toasts.js";
import { updateDeal, updateHistory, getDealById, setTxHash, deleteDeal, updateEthUsd, ETHtoUSD } from "./SQLRequests.js";

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

const sellerReceive = async () => {
    const value = Number(document.getElementById("transaction-amount").value) * 0.98;
    const index = document.getElementById("ether-unit").selectedIndex ?? 1;
    const res = index == 0 ? await ETHtoUSD(value) : value;
    CreateToast(false, `Seller will receive ${res} USD`);
}

async function showCurrentDeal(dealID, account, status){
    const answerDealById = await getDealById(dealID); //not need here if status == 0
    const sellerGet = answerDealById.value - answerDealById.fee
    if (status == 0)
        await approveByPartner(dealID, account);
    else {
        if (answerDealById == -1) throw "Deal Not Found";
        if (status != answerDealById.status) await blockChainCall(status, dealID, answerDealById);
        await changeDealStatusView(dealID, account, status);
    }
    updateHistory(account);
    updateEthUsd();
    CreateToast(false, `Seller will receive ${await ETHtoUSD(sellerGet)} USD`);
}

const updateConnectionBtn = (account) => {
    const button = document.getElementById("connectButton");
    if (button !== null && account != null) {
        button.remove();
        const show = document.getElementById("show-account");
        show.textContent = account;
    } else if (button == null && account == null) {
        console.log(button);
        const btn = document.createElement("button");
        btn.id = "connectButton";
        btn.type = "button";
        btn.classList.add("btn", "btn-pimary");
        btn.textContent = "Connect";

        document.getElementById("spanConnectButton").append("btn");
        console.log(btn);
    }
}

let currentActiveCircle = -1;
async function changeProgressState(newState) {
    const progress = document.getElementById("progress");
    const circles = document.getElementsByClassName("circle");
    if(progress != null && circles != null){
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
}

function changeDeal(dealID, account){
    fetch(`view/changeDealView?dealid=${dealID}&account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then(async (html) => {
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
                showCurrentDeal(createID, MetaMaskWallet[0], 0);
            } catch (error) {
                CreateToast(true, error);
            }
        });
        const buyerSwitch = document.getElementById("buyer-role");
        const sellerSwitch = document.getElementById("seller-role");
        const dealPartnerLabel = document.getElementById("deal-partner-label");
        const transactionAmount = document.getElementById("transaction-amount");
        const unit = document.getElementById("ether-unit");
        buyerSwitch.addEventListener('click', (evt) => { //we are buyer
            dealPartnerLabel.innerHTML = "Seller address";
        });
    
        sellerSwitch.addEventListener('click', (evt) => { //we are seller
            dealPartnerLabel.innerHTML = "Buyer address";
        });

        transactionAmount?.addEventListener('change', sellerReceive)
        unit?.addEventListener('change', sellerReceive)
    })
    .catch((err) => {
        console.log(err);
    });
}

async function blockChainCall(status, dealID, answerDealById) {
    try {
        let transaction = "0";
        let current_value = -1;
        switch(status){
            case 1:
                showLoader();
                current_value = ethers.utils.parseEther(String(answerDealById.value));
                transaction = await escrowProvider.create(answerDealById.buyer, answerDealById.seller, current_value, answerDealById.feeRole);
                await setTxHash(dealID, transaction.hash);
                await transaction.wait();
                break;
            case 2:
                showLoader();
                current_value = ethers.utils.parseEther(String(answerDealById.value));
                transaction = await escrowProvider.sendB(answerDealById.txId, {value: current_value});
                await transaction.wait()
                break;
            case 3:
                showLoader();
                transaction = await escrowProvider.sendS(answerDealById.txId);
                await transaction.wait()
                break;
            case 4:
                showLoader();
                transaction = await escrowProvider.approve(answerDealById.txId);
                await transaction.wait()
                break;
            case -1:
                showLoader();
                if(answerDealById.status != 3){
                    await escrowProvider.cancel(answerDealById.txId);
                    CreateToast(false, "Deal has been deleted");
                    await deleteDeal(dealID);
                    window.location.reload();
                    return;
                }
                else{
                    transaction = await escrowProvider.askArbitrator(answerDealById.txId, '0xf952924197d795ee179aa06bf83aab3f604372de', {value: ethers.utils.parseEther('0.02')});
                    await transaction.wait()
                }
                break;
            default:
                console.log("Unknown error");
                break;
        }
        hiddenLoader();
    } catch (err) {
        hiddenLoader();
        CreateToast(true, "Something went wrong :(");
    }
}

async function changeDealStatusView(dealID, account, status) {
    try {
        const resp = await fetch(`view/inProgressView?dealid=${dealID}&account=${account}&status=${status}`, { headers });
        if (resp.status < 200 || resp.status >= 300) throw new Error("connect error");
    
        if (status == -1) status = 3;
        await changeProgressState(status);

        const html = await resp.text();
        bodyInput.innerHTML = html;
    } catch (err) {
        console.log(err);
    }

    const approveDealBtn = document.getElementById("next-deal-step");
    approveDealBtn?.addEventListener('click', (evt) => {
        showCurrentDeal(dealID, account, status+1);
    });
    const cancelDealBtn = document.getElementById("cancel-deal");
    cancelDealBtn?.addEventListener('click', (evt) => {
        showCurrentDeal(dealID, account, -1);
    });
}

async function approveByPartner(dealID, account){
    try {
        const resp = await fetch(`view/approveByPartner?dealid=${dealID}&account=${account}`, { headers });
        if (resp.status < 200 || resp.status >= 300) throw new Error("connect error");

        await changeProgressState(0);

        const html = await resp.text();
        bodyInput.innerHTML = html;
    } catch (err) {
        console.log(err);
    }

    const changeBtn = document.getElementById("change-deal-step");
    changeBtn?.addEventListener('click', (evt) => {
        changeDeal(dealID, account);
        updateHistory(account);
    });

    const approveDealBtn = document.getElementById("next-deal-step");
    approveDealBtn?.addEventListener('click', (evt) => {
        showCurrentDeal(dealID, account, 1);
    });

    const cancelDealBtn = document.getElementById("cancel-deal");
    cancelDealBtn?.addEventListener('click', async (evt) => {
        CreateToast(false, "Deal has been deleted");
        await deleteDeal(dealID);
        window.location.reload();
    });
}

export {
    showCurrentDeal,
    updateConnectionBtn,
    sellerReceive
};