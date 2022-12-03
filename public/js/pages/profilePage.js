import { updateHistory } from "../sqlConnect/SQLRequests.js";
import { CreateToast } from "../frontend/Toasts.js";
import { MetaMaskWallet } from "../web3/Web3Layer.js"


function funonload(){
    if(MetaMaskWallet == null){
        CreateToast(true, "Сначала нужно зарегистрироваться");
    }
    account = MetaMaskWallet[0];
    fetch(`view/preloadProfilePage?account=${account}`, { headers })
    .then((resp) => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error("connect error");
        return resp.text();
    })
    .then((json) => {
        console.log(json);
    })
    .catch((err) => {
        console.log(err);
    });
}

window.onload = funonload;