// const EscrowProvider = require('./GarantProvider.js');
// import {EscrowProvider} from './EscrowProvider.js';

const forwarderOrigin = 'http://localhost:9010';

//MetaMask connect
const onboardButton = document.getElementById('connectButton');
// const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResult = document.getElementById('show-account');

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
const createTransactionValue = document.getElementById('create-seller');
const createTransactionSendButton = document.getElementById('create-btn');
const createTransactionStatus = document.getElementById('create-status');

// Send Money For Subject
const sendBSeller = document.getElementById('sendB-seller');
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
            permissionsResult.innerHTML = `Error: ${err.message}`
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
            permissionsResult.innerHTML = `Error: ${err.message}`
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
            createTransactionStatus.innerHTML = `Error: ${err.message}`
        }
    }
    createTransactionSendButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const buyer = createTransactionBuyer.value;
            const seller = createTransactionSeller.value;
            const value = createTransactionValue.value;
            const transaction = await escrowProvider.create(buyer, seller, value);
            createTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            createTransactionStatus.innerHTML = `Error: ${err.message}`
        }
    }
    sendBButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const seller = sendBSeller.value;
            tx = {
                value: ethers.utils.parseEther('5', 'ether')
            };
            const transaction = await escrowProvider.sendB(seller, tx=tx);
            sendBStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            sendBStatus.innerHTML = `Error: ${err.message}`
        }
    }
    sendSButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const buyer = sendSBuyer.value;
            const transaction = await escrowProvider.sendS(buyer);
            sendSStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            sendBStatus.innerHTML = `Error: ${err.message}`
        }
    }
    cancelTransactionButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const buyer = cancelTransactionBuyer.value;
            const seller = cancelTransactionSeller.value;
            const transaction = await escrowProvider.cancel(buyer, seller);
            cancelTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            cancelTransactionStatus.innerHTML = `Error: ${err.message}`
        }
    }
    approveTransactionButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const seller = approveTransactionSeller.value;
            const transaction = await escrowProvider.approve(seller);
            approveTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            approveTransactionStatus.innerHTML = `Error: ${err.message}`
        }
    }
    disapproveTransactionButton.onclick = async () => {
        try{
            const signer = provider.getSigner();

            const escrowProvider = new EscrowProvider(signer);
            const seller = disapproveTransactionSeller.value;
            const transaction = await escrowProvider.disapprove(seller);
            disapproveTransactionStatus.innerHTML = `Ok`;
        } catch (err){
            console.error(err)
            disapproveTransactionStatus.innerHTML = `Error: ${err.message}`
        }
    }

    function handleNewAccounts (newAccounts) {
        accounts = newAccounts
        getAccountsResult.innerHTML = accounts || 'Not able to get accounts';
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