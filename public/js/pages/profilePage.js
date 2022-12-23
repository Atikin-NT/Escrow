import { updateHistory } from "../sqlConnect/SQLRequests.js";

const headers = { "Content-Type": "application/json" };
let bodyInput = document.getElementById("inputBody");

/**
 * @param  {int} dealID
 * @param  {string} account
 */
const dealViewOnly = async (dealID, account) => {
  try {
    const resp = await fetch(`view/dealViewOnly?dealid=${dealID}&account=${account}`, { headers });
    const html = await resp.text();
    bodyInput.innerHTML = html;
  }
  catch (err) { console.log(err); }
  await updateHistory(account, 'getDeals', dealViewOnly, 10);
}

updateHistory(window.location.pathname.slice(1), 'getDeals', dealViewOnly, 10);
