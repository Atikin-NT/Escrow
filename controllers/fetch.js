const { dbInsertData, dbGetDealsByAccount, dbGetDealsToHelp, dbDeleteData, dbUpdateDealStatus, dbUpdateData, dbGetDealsByID, setTxId, setTxHash } = require('../lib/sqlite.js');

async function createDeal(req, res){
    answer = await dbInsertData(req.body.buyer, req.body.seller, 
        req.body.value, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

async function updateDeal(req, res){
    answer = await dbUpdateData(req.body.buyer, req.body.seller, 
        req.body.value, req.body.id, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

async function deleteDeal(req, res){
    answer = await dbDeleteData(req.body.id);
    res.send(answer);
}

async function getDeals(req, res){
    answer = await dbGetDealsByAccount(req.query.account, req.query.limit);
    res.send(answer);
}

async function dealsToHelp(req, res){
    answer = await dbGetDealsToHelp(req.query.account, req.query.limit);
    res.send(answer);
}

async function updateDealStatus(req, res){
    answer = await dbUpdateDealStatus(req.body.id, req.body.status);
    res.send(answer);
}

async function getDealById(req, res){
    answer = await dbGetDealsByID(req.body.id);
    res.send(answer);
}

async function updateTxId(req, res){
    answer = await setTxId(req.body.id, req.body.txId);
    res.send(answer);
}

async function updateTxHash(req, res){
    answer = await setTxHash(req.body.id, req.body.txHash);
    res.send(answer);
}

module.exports = {createDeal, deleteDeal, getDeals, dealsToHelp, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash};