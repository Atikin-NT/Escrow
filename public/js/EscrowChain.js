// const EscrowProvider = require('./GarantProvider.js');
// import {EscrowProvider} from './EscrowProvider.js';

const forwarderOrigin = 'http://localhost:9010';

//MetaMask connect
const onboardButton = document.getElementById('connectButton');
// const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResult = document.getElementById('show-account');
const getBalanceResult = document.getElementById('show-balance');

// Permissions Actions Section
const requestPermissionsButton = document.getElementById('requestPermissions');
const getPermissionsButton = document.getElementById('getPermissions');
const permissionsResult = document.getElementById('permissionsResult');

// Tarnsaction Test Send
const transactionTestSendButton = document.getElementById('transactionTest-send');
const transactionTestStatus = document.getElementById('transactionTest-status');

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

    const onClickConnect = async () => {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
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

    // getAccountsButton.addEventListener('click', async () => {
    //     const newAccounts = await provider.listAccounts();
    //     handleNewAccounts(newAccounts)
    // });

    requestPermissionsButton.onclick = async () => {
        try { // TODO: разумно будет сначала запросить, какие разрешения уже предоставлены
            const permissionsArray = await ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
            })
            permissionsResult.innerHTML = getPermissionsDisplayString(permissionsArray)
        } catch (err) {
            console.error(err)
            permissionsResult.innerHTML = `Error: ${err.data.message}`
        }
    }
  
    getPermissionsButton.onclick = async () => {
        try {
            const permissionsArray = await ethereum.request({
            method: 'wallet_getPermissions',
            })
            permissionsResult.innerHTML = getPermissionsDisplayString(permissionsArray)
        } catch (err) {
            console.error(err)
            permissionsResult.innerHTML = `Error: ${err.data.message}`
        }
    }

    transactionTestSendButton.onclick = async () => {
        try{
            const signer = provider.getSigner();
            tx = {
                to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                value: ethers.utils.parseEther('0.1', 'ether')
            };
            const transaction = await signer.sendTransaction(tx);
            createTransactionStatus.innerHTML = ``;
        } catch (err){
            console.error(err)
            createTransactionStatus.innerHTML = `Error: ${err.data.message}`
        }
    }

    createTransactionSendButton.onclick = async () => {
        const buyer = createTransactionBuyer.value;
        const seller = createTransactionSeller.value;
        const value = createTransactionValue.value;
        try{
            const transaction = await escrowProvider.create(buyer, seller, value);
            createTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            createTransactionStatus.innerHTML = `Error: ${err.data.message}`
        } finally {
            sendBValue.value = value;
            sendBSeller.value = seller;

            checkDealBuyer.value = buyer;
            checkDealSeller.value = seller;

            sendSBuyer.value = buyer;

            cancelTransactionBuyer.value = buyer;
            cancelTransactionSeller.value = seller;

            approveTransactionSeller.value = seller;

            disapproveTransactionSeller.value = seller;
        }
    }

    checkDealCheckButton.onclick = async () => {
        const buyer = checkDealBuyer.value;
        const seller = checkDealSeller.value;
        try{
            await escrowProvider.deals(buyer, seller).then(
                (transaction) => {
                    updateButtons(transaction);
                    checkDealOutput.innerHTML = transaction;
                }
            );
        } catch (err){
            console.error(err)
            checkDealOutput.innerHTML = `Error: ${err.data.message}`
        }
    }

    sendBButton.onclick = async () => {
        const seller = sendBSeller.value;
        const value = sendBValue.value;
        try{
            tx = {
                value: value
            };
            const transaction = await escrowProvider.sendB(seller, tx=tx);
            sendBStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            sendBStatus.innerHTML = `Error: ${err.data.message}`
        }
    }
    sendSButton.onclick = async () => {
        const buyer = sendSBuyer.value;
        try{
            const transaction = await escrowProvider.sendS(buyer);
            sendSStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            sendSStatus.innerHTML = `Error: ${err.data.message}`
        }
    }
    cancelTransactionButton.onclick = async () => {
        const buyer = cancelTransactionBuyer.value;
        const seller = cancelTransactionSeller.value;
        try{
            const transaction = await escrowProvider.cancel(buyer, seller);
            cancelTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            cancelTransactionStatus.innerHTML = `Error: ${err.data.message}`
        }
    }
    approveTransactionButton.onclick = async () => {
        const seller = approveTransactionSeller.value;
        try{
            const transaction = await escrowProvider.approve(seller);
            approveTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            approveTransactionStatus.innerHTML = `Error: ${err.data.message}`
        }
    }
    disapproveTransactionButton.onclick = async () => {
        const seller = disapproveTransactionSeller.value;
        try{
            const transaction = await escrowProvider.disapprove(seller);
            disapproveTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            disapproveTransactionStatus.innerHTML = `Error: ${err.data.message}`
        }
    }

    withdrawButton.onclick = async () => {
        const target = withdrawTarget.value;
        try{
            const transaction = await escrowProvider.withdraw(target);
            withdrawStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            withdrawStatus.innerHTML = `Error: ${err.data.message}`
        }
    }

    async function handleNewAccounts (newAccounts) {
        accounts = newAccounts
        getAccountsResult.innerHTML = accounts || 'Not able to get accounts';
        const signer = provider.getSigner();
        const balance = await signer.getBalance();
        getBalanceResult.innerHTML = String(balance) || '';
        escrowProvider = new EscrowProvider(signer);
        // if (isMetaMaskConnected()) {
        //   initializeAccountButtons()
        // }
        // updateButtons()
      }

    // let provider;
    if (isMetaMaskInstalled()) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        ethereum.autoRefreshOnNetworkChange = false
        ethereum.on('accountsChanged', handleNewAccounts)
        try {
            const newAccounts = await provider.listAccounts();
            handleNewAccounts(newAccounts)
        } catch (err) {
            console.error('Error on init when getting accounts', err)
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

function getPermissionsDisplayString (permissionsArray) {
    if (permissionsArray.length == 0) {
        return 'No permissions found.'
    }
    const permissionNames = permissionsArray.map((perm) => perm.parentCapability)
    return permissionNames.reduce((acc, name) => `${acc}${name}, `, '').replace(/, $/u, '')
}