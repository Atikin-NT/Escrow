const { Router } = require("express");
const { dbInsertData, dbGetDealsByAccount, dbDeleteData, dbUpdateDealStatus } = require('../lib/sqlite.js');

const fetchRouter = Router()

fetchRouter.post("/fetch", (req, res) => {
    res.send({
        name_recieved: req.body.name,
        id_recieved: req.body.id
    });
});

fetchRouter.post("/fetch/createDeal", async (req, res) => {
    answer = await dbInsertData(req.body.buyer, req.body.seller, req.body.value);
    res.send(answer);
});

fetchRouter.post("/fetch/deleteDeal", async (req, res) => {
    answer = await dbDeleteData(req.body.id);
    res.send(answer);
});

fetchRouter.post("/fetch/getDeals", async (req, res) => {
    answer = await dbGetDealsByAccount(req.body.account);
    res.send(answer);
});

fetchRouter.post("/fetch/updateDealStatus", async (req, res) => {
    answer = await dbUpdateDealStatus(req.body.id, req.body.status);
    res.send(answer);
});

module.exports = fetchRouter