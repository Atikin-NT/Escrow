const createTest = document.getElementById("answerCreate-btn");

const createDeal = document.getElementById("create-deal-btn");
const buyerWallet = document.getElementById("create-buyer");
const sellerWallet = document.getElementById("create-seller");
const transactionAmount = document.getElementById("transactionAmount");

// Для общения с БД нужен headers
const headers = { "Content-Type": "application/json" };

// console.log(createDeal);

createDeal.addEventListener("click", (evt) => {
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

createTest.addEventListener("click", (evt) => {
  const body = JSON.stringify({
    // список всех параметров запроса
    account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  });

  //   const headers = { "Content-Type": "application/json" }; // заголовок. Всегда оставляем таким
  const answerContainer = document.getElementById("answerCreate");

  fetch("/fetch/getDeals", { method: "post", body, headers }) // и всегда отправляем методом POST
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
