const { dbInsertData, dbGetDealsByAccount, dbDeleteData, dbUpdateDealStatus } = require('../lib/sqlite.js');

async function createDeal(req, res){
    answer = await dbInsertData(req.body.buyer, req.body.seller, req.body.value);
    res.send(answer);
}

async function deleteDeal(req, res){
    answer = await dbDeleteData(parseInt(req.query.id));
    res.send(answer);
}

async function getDeals(req, res){
    answer = await dbGetDealsByAccount(req.query.account);
    res.send(answer);
}

async function updateDealStatus(req, res){
    answer = await dbUpdateDealStatus(req.body.id, req.body.status);
    res.send(answer);
}

module.exports = {createDeal, deleteDeal, getDeals, updateDealStatus};