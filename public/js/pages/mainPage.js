import { createDeal } from "../sqlConnect/SQLRequests.js";
//Create Deal
const createDealFormClick = document.getElementById("create-deal-btn");

//Calculete fee
const feeContainer = document.getElementById("fee-container");

//Role Switch
const buyerSwitch = document.getElementById("buyer-role");
const sellerSwitch = document.getElementById("seller-role");
const dealPartnerLabel = document.getElementById("deal-partner-label");

//Deal Properties
const partnerWallet = document.getElementById("deal-partner");
const transactionAmount = document.getElementById("transaction-amount");

//Toast Element
import { CreateToast } from "../frontend/Toasts.js";
const toastTrigger = document.getElementById("liveToastBtn");

//Main logic
import { MetaMaskWallet, escrowProvider, provider } from "../web3/Web3Layer.js";
import { approveByPartner } from "../sqlConnect/changeView.js";

createDealFormClick.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if(MetaMaskWallet == null){
        CreateToast(true, "Login error");
        evt.stopImmediatePropagation();
    }
    try {
        const createID = await createDeal(MetaMaskWallet[0]); // TODO: при создании надо возращать текущую сделку
        approveByPartner(createID, MetaMaskWallet[0]);
    } catch (error) {
        CreateToast(true, error);
    }
});

buyerSwitch.addEventListener('click', (evt) => { //we are buyer
    dealPartnerLabel.innerHTML = "Seller address";
});

sellerSwitch.addEventListener('click', (evt) => { //we are seller
    dealPartnerLabel.innerHTML = "Buyer address";
});

const p = document.getElementById("fee-p");
transactionAmount.oninput = () => {
    setTimeout(async function () {
        const FAST_GAS_FEED = new ethers.Contract(
            '0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C', 
            ['function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'], provider);
        let res = await FAST_GAS_FEED.latestRoundData();
        const gasFeedValue = res.answer; // wei/gas
        console.log('FAST_GAS_FEED', gasFeedValue);
    
        const ETH_USD = new ethers.Contract(
            '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', 
            ['function latestRoundData() public view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'], provider);
        res = await ETH_USD.latestRoundData();
        const ethUsdFeedValue = res.answer; // usd/eth * 1e8
        console.log('ETH_USD', ethUsdFeedValue); 
        try {
            const gas = await escrowProvider.estimateGas.create(
                MetaMaskWallet[0], partnerWallet.value, transactionAmount.value
                );
            // const gasPrice = await provider.getGasPrice();
            const inWei = gas.mul(gasFeedValue); // [gas] * [wei/gas] = [wei]
            /**
             * [wei] * [usd/eth * 1e8] / [1e8] = [(wei/eth) * usd]
             * [(wei/eth) * usd] / [1e18] = [(wei/[eth * 1e18]) * usd] = [(wei/wei) * usd] = [usd]
             * [wei] * [usd/eth * 1e8] / [1e26] = [usd]
             * 
             * 1e3 < gas < 1e6 
             * 1e8 < gasFeedValue < 1e11 
             * 1e10 < ethUsdFeedValue < 1e13
             * 1e21 < gas * gasFeedValue * ethUsdFeedValue < 1e30
             * 1 < gas * gasFeedValue * ethUsdFeedValue / 1e21 < 1e9 < Number.MAX_SAFE_INTEGER = 9007199254740991
             */
            const maxAccurate = inWei.mul(ethUsdFeedValue).div(ethers.BigNumber.from(1e11)).div(ethers.BigNumber.from(1e10))
            const inUsd = maxAccurate.toNumber()/1e5;
            console.log(inUsd)
            p.innerText = inWei;
            CreateToast(false, `Fee will be ${inWei} wei \n ${inUsd} usd`)
        } catch (err) {
            CreateToast(true, err);
        }
    }, 1000);

};