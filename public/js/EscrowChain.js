const forwarderOrigin = 'http://localhost:9010';

//MetaMask connect
const onboardButton = document.getElementById('connectButton');
const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResult = document.getElementById('show-account');

// Permissions Actions Section
const requestPermissionsButton = document.getElementById('requestPermissions');
const getPermissionsButton = document.getElementById('getPermissions');
const permissionsResult = document.getElementById('permissionsResult');

// Tarnsaction Test Send
const transactionTestTo = document.getElementById('transactionTest-to');
const transactionTestValue = document.getElementById('transactionTest-value');
const transactionTestSendButton = document.getElementById('transactionTest-send');
const transactionTestStatus = document.getElementById('transactionTest-status');

const initialize = () => {
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

    const MetaMaskClientCheck = () => {
        //Now we check to see if MetaMask is installed
        if (!isMetaMaskInstalled()) {
            onboardButton.innerText = 'Click here to install MetaMask!';
            onboardButton.disabled = true;
        } else {
            onboardButton.innerText = 'Connect';
            onboardButton.onclick = onClickConnect;
            onboardButton.disabled = false; // FIXME: не работает
        }
    };

    getAccountsButton.addEventListener('click', async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
    });

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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            const signer = provider.getSigner(accounts[0]);
            tx = {
                to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                value: ethers.utils.parseEther('0.1', 'ether')
            };
            const transaction = await signer.sendTransaction(tx);
            transactionTestStatus,innerHTML = ``;
        } catch (err){
            console.error(err)
            transactionTestStatus.innerHTML = `Error: ${err.message}`
        }
    }

    MetaMaskClientCheck();
};
window.addEventListener('DOMContentLoaded', initialize);

function getPermissionsDisplayString (permissionsArray) {
    if (permissionsArray.length == 0) {
        return 'No permissions found.'
    }
    const permissionNames = permissionsArray.map((perm) => perm.parentCapability)
    return permissionNames.reduce((acc, name) => `${acc}${name}, `, '').replace(/, $/u, '')
}