const updateHistoryBtn = document.getElementById("answerCreate-btn");

const createDeal = document.getElementById("create-deal-btn");
const buyerWallet = document.getElementById("create-buyer");
const sellerWallet = document.getElementById("create-seller");
const transactionAmount = document.getElementById("transactionAmount");
const historyList = document.getElementById("history-list");


const headers = { "Content-Type": "application/json" };

createDeal.addEventListener("submit", (evt) => {
  evt.preventDefault();
  console.log(buyerWallet.value);
  const body = JSON.stringify({
    buyer: buyerWallet.value,
    seller: sellerWallet.value,
    value: transactionAmount.value,
  });

  console.log("-------");
  const answerContainer = document.getElementById("answerCreate");
  console.log(answerContainer);

  fetch("/fetch/createDeal", { method: "post", body, headers })
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      answerContainer.innerHTML = json.msg;
    })
    .catch((err) => {
      console.log(err);
      answerContainer.innerHTML = err;
    });
});

function updateHistory(account){
  const body = JSON.stringify({
    account: account,
  });

  console.log(body);

  const answerContainer = document.getElementById("answerCreate");

  fetch(`/fetch/getDeals?account=${account}`, { headers }) // и всегда отправляем методом POST
    .then((resp) => {
      console.log(resp);
      if (resp.status < 200 || resp.status >= 300)
        throw new Error("connect error");
      return resp.json();
    })
    .then((json) => {
      console.log(json.list);
      while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
      }
      for(let element of json.list){
        console.log(element)
        console.log(element.seller)
        var li = document.createElement("li");
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between');

        var div = document.createElement("div");
        if(element.status != 0) div.className = 'text-success';
        var h6 = document.createElement("h6");
        h6.className = 'my-0';
        h6.innerHTML = element.seller; //TODO: фильтрация с тем у кого сделка
        div.appendChild(h6);

        var small = document.createElement("small");
        small.className = 'text-muted';
        small.innerHTML = "pending";

        li.appendChild(div);
        li.appendChild(small);
        historyList.appendChild(li);
      }
      answerContainer.innerHTML = json.msg;
    })
    .catch((err) => {
      console.log(err);
      answerContainer.innerHTML = err;
    });
}

export {updateHistory};