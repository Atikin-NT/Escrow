//MetaMask connect
const onboardButton = document.getElementById('connectButton');
const getAccountsResult = document.getElementById('show-account');
const getBalanceResult = document.getElementById('show-balance');

// Create Tarnsaction
const createTransactionBuyer = document.getElementById('create-buyer');
const createTransactionSeller = document.getElementById('create-seller');
const createTransactionValue = document.getElementById('create-value');
const createTransactionSendButton = document.getElementById('create-btn');
const createTransactionStatus = document.getElementById('create-status');

// Check Deal
const checkDealBuyer = document.getElementById('deals-buyer');
const checkDealSeller = document.getElementById('deals-seller');
const checkDealCheckButton = document.getElementById('deals-btn');
const checkDealOutput = document.getElementById('deals-output');

// Send Money For Subject
const sendBSeller = document.getElementById('sendB-seller');
const sendBValue = document.getElementById('sendB-value');
const sendBButton = document.getElementById('sendB-btn');
const sendBStatus = document.getElementById('sendB-status');

// Send Subject
const sendSBuyer = document.getElementById('sendS-buyer');
const sendSButton = document.getElementById('sendS-btn');
const sendSStatus = document.getElementById('sendS-status');

// Cancel Tarnsaction
const cancelTransactionBuyer = document.getElementById('cancel-buyer');
const cancelTransactionSeller = document.getElementById('cancel-seller');
const cancelTransactionButton = document.getElementById('cancel-btn');
const cancelTransactionStatus = document.getElementById('cancels-status');

// Approve Tarnsaction
const approveTransactionSeller = document.getElementById('approve-seller');
const approveTransactionButton = document.getElementById('approve-btn');
const approveTransactionStatus = document.getElementById('approve-status');

// Disapprove Tarnsaction
const disapproveTransactionSeller = document.getElementById('disapprove-seller');
const disapproveTransactionButton = document.getElementById('disapprove-btn');
const disapproveTransactionStatus = document.getElementById('disapprove-status');

// Withdraw 
const withdrawTarget = document.getElementById('withdraw-target');
const withdrawButton = document.getElementById('withdraw-btn');
const withdrawStatus = document.getElementById('withdraw-status');

const initialize = async () => {
    //Created check function to see if the MetaMask extension is installed
    const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const updateButtons = (check) => {
        const value = String(check.value);
        const confBuyer = check.confBuyer;
        const confSeller = check.confSeller;
        if (value === '0' && confBuyer === false && confSeller === false) {
            createTransactionSendButton.disabled = false;
            sendBButton.disabled = true;
            sendSButton.disabled = true;
            cancelTransactionButton.disabled = true;
            approveTransactionButton.disabled = true;
            disapproveTransactionButton.disabled = true;
        } else if (value !== '0' && confBuyer === false && confSeller === false) {
            createTransactionSendButton.disabled = true;
            sendBButton.disabled = false;
            sendSButton.disabled = true;
            cancelTransactionButton.disabled = false;
            approveTransactionButton.disabled = true;
            disapproveTransactionButton.disabled = true;
        } else if (value !== '0' && confBuyer === true&& confSeller === false) {
            createTransactionSendButton.disabled = true;
            sendBButton.disabled = true;
            sendSButton.disabled = false;
            cancelTransactionButton.disabled = false;
            approveTransactionButton.disabled = true;
            disapproveTransactionButton.disabled = true;
        } else if (value !== '0' && confBuyer === true && confSeller === true) {
            createTransactionSendButton.disabled = true;
            sendBButton.disabled = true;
            sendSButton.disabled = false;
            cancelTransactionButton.disabled = true;
            approveTransactionButton.disabled = false;
            disapproveTransactionButton.disabled = false;
        }
    }

    createTransactionSendButton.onclick = async () => {
        const buyer = createTransactionBuyer.value;
        const seller = createTransactionSeller.value;
        const value = createTransactionValue.value;
        try{
            const gas = await escrowProvider.daiContract.estimateGas.create(buyer, seller, value);
            console.log(String(gas));
            const transaction = await escrowProvider.create(buyer, seller, value);
            const tx = await transaction.wait();
            console.log(tx);
            TxId = tx.events[0].args.TxId;
            createTransactionStatus.innerHTML = `Ok`;
            await Check();
        } catch (err){
            console.error(err);
            createTransactionStatus.innerHTML = `Error: ${err.data.message}`;
        } finally {
            checkDealBuyer.value = buyer;
            checkDealSeller.value = seller;
        }
    }

    async function Check() {
        const buyer = checkDealBuyer.value;
        const seller = checkDealSeller.value;
        try{
            // const TxId = await getTxId();
            const deal = await escrowProvider.deals(TxId);
            updateButtons(deal);
            checkDealOutput.innerHTML = deal;
            sendBValue.value = deal.value;
        } catch (err){
            console.error(err);
            checkDealOutput.innerHTML = `Error: ${err.data.message}`;
        } finally {
            sendBSeller.value = seller;
            sendSBuyer.value = buyer;

            cancelTransactionBuyer.value = buyer;
            cancelTransactionSeller.value = seller;

            approveTransactionSeller.value = seller;

            disapproveTransactionSeller.value = seller;
        }
    }

    checkDealCheckButton.onclick = Check;

    sendBButton.onclick = async () => {
        const seller = sendBSeller.value;
        const value = sendBValue.value;
        try{
            tx = {
                value: value
            };
            // const TxId = await getTxId();
            const transaction = await escrowProvider.sendB(TxId, tx=tx);
            const tx = await transaction.wait();
            sendBStatus.innerHTML = `Ok`;
            await Check();
        } catch (err){
            console.error(err);
            sendBStatus.innerHTML = `Error: ${err.data.message}`;
        }
    }
    sendSButton.onclick = async () => {
        const buyer = sendSBuyer.value;
        try{
            // const TxId = await getTxId();
            const transaction = await escrowProvider.sendS(TxId);
            const tx = await transaction.wait();
            sendSStatus.innerHTML = `Ok`;
            await Check();
        } catch (err){
            console.error(err);
            sendSStatus.innerHTML = `Error: ${err.data.message}`;
        }
    }
    cancelTransactionButton.onclick = async () => {
        const buyer = cancelTransactionBuyer.value;
        const seller = cancelTransactionSeller.value;
        try{
            // const TxId = await getTxId();
            const transaction = await escrowProvider.cancel(TxId);
            const tx = await transaction.wait();
            await Check();
        } catch (err){
            console.error(err);
        }
    }
    approveTransactionButton.onclick = async () => {
        const seller = approveTransactionSeller.value;
        try{
            // const TxId = await getTxId();
            const transaction = await escrowProvider.approve(TxId);
            const tx = await transaction.wait();
            approveTransactionStatus.innerHTML = `Ok`;
            await Check();
        } catch (err){
            console.error(err);
            approveTransactionStatus.innerHTML = `Error: ${err.data.message}`;
        }
    }
    disapproveTransactionButton.onclick = async () => {
        const seller = disapproveTransactionSeller.value;
        try{
            // const TxId = await getTxId();
            const transaction = await escrowProvider.disapprove(TxId);
            const tx = await transaction.wait();
            disapproveTransactionStatus.innerHTML = `Ok`;
            await Check();
        } catch (err){
            console.error(err);
            disapproveTransactionStatus.innerHTML = `Error: ${err.data.message}`;
        }
    }

    withdrawButton.onclick = async () => {
        const target = withdrawTarget.value;
        try{
            const transaction = await escrowProvider.withdraw(target);
            const tx = await transaction.wait();
            withdrawStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err);
            withdrawStatus.innerHTML = `Error: ${err.data.message}`;
        }
    }

    async function handleNewAccounts (newAccounts) {
        accounts = newAccounts;
        getAccountsResult.innerHTML = accounts || 'Not able to get accounts';
        const signer = provider.getSigner();
        const balance = await signer.getBalance();
        getBalanceResult.innerHTML = String(balance) || '';
        escrowProvider = new EscrowProvider(signer);
      }

    const onClickConnect = async () => {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
    };

    if (isMetaMaskInstalled()) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        ethereum.autoRefreshOnNetworkChange = false;
        ethereum.on('accountsChanged', handleNewAccounts);
        try {
            const newAccounts = await provider.listAccounts();
            if (newAccounts.length > 0)
                handleNewAccounts(newAccounts);
        } catch (err) {
            console.error('Error on init when getting accounts', err);
        }

        onboardButton.innerText = 'Connect';
        onboardButton.onclick = onClickConnect;
        onboardButton.disabled = false;
    } else {
        onboardButton.innerText = 'Click here to install MetaMask!';
        onboardButton.disabled = true;
    }
};

window.addEventListener('DOMContentLoaded', initialize);

const getTxId = () => {
    return new Promise( (res , rej) => {
        setTimeout( () => {
            const TxId = "0x177a73f8f29cb1d4dddb2fd58ae343b12393f256400cfb69167ab5151fc59d73";
            res(TxId);
        }, 2000);
    })
}