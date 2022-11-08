import { updateHistory } from "../sqlConnect/SQLRequests.js";
const onboardButton = document.getElementById("connectButton");

let MetaMaskWallet;
let escrowProvider;
let provider;

const initialize = async () => {
  //   createTransactionSendButton.onclick = async () => {
  //     const buyer = createTransactionBuyer.value;
  //     const seller = createTransactionSeller.value;
  //     const value = createTransactionValue.value;
  //     try {
  //       const transaction = await escrowProvider.create(buyer, seller, value);
  //       const tx = await transaction.wait();
  //       TxId = tx.events[0].args.TxId;
  //       createTransactionStatus.innerHTML = `Ok`;
  //     } catch (err) {
  //       console.error(err);
  //       createTransactionStatus.innerHTML = `Error: ${err.data.message}`;
  //     }
  //   };

  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const isMetaMaskConnected = () => MetaMaskWallet && MetaMaskWallet.length > 0;

  const updateConnectionBtn = (wallet) => {
    if (!isMetaMaskInstalled()) {
      onboardButton.innerText = "Please install MetaMask";
      onboardButton.disabled = false;
    } else if (isMetaMaskConnected()) {
      if (document.getElementById("connectButton") !== null) {
        document.getElementById("connectButton").remove();
      } 
      if (wallet != null) {
        document.getElementById("show-account").innerText = wallet;
      }
    } else {
      onboardButton.innerText = "Connect";
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
    if(wallet != undefined)
      updateHistory(wallet);
  };

  const handleNewAccounts = async (newAccounts) => {
    MetaMaskWallet = newAccounts;
    const signer = provider.getSigner();
    escrowProvider.connect(signer);
    updateConnectionBtn(MetaMaskWallet);
  };

  const onClickConnect = async () => {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
  };

  if (isMetaMaskInstalled()) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    ethereum.autoRefreshOnNetworkChange = false;
    try {
      const newAccounts = await provider.listAccounts();
      const signer = provider.getSigner();
      escrowProvider = new EscrowProvider(signer);
      handleNewAccounts(newAccounts);
    } catch (err) {
      console.error("Error on init when getting accounts", err);
    }
    ethereum.on("accountsChanged", handleNewAccounts);
  }

  updateConnectionBtn();
};

window.addEventListener("DOMContentLoaded", initialize);

export { MetaMaskWallet, escrowProvider, provider };
