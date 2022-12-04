const { dbInsertData, dbGetDealsByAccount, dbGetDealsToHelp, dbDeleteData, dbUpdateDealStatus, dbUpdateData, dbGetDealsByID, setTxId, setTxHash } = require('../lib/sqlite.js');
const { solveDealByAdmin } = require("../lib/adminInfo.js");

exports.createDeal = async (req, res) => {
    answer = await dbInsertData(req.body.buyer, req.body.seller, 
        req.body.value, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

exports.updateDeal = async (req, res) => {
    answer = await dbUpdateData(req.body.buyer, req.body.seller, 
        req.body.value, req.body.id, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

exports.deleteDeal = async (req, res) => {
    answer = await dbDeleteData(req.body.id);
    res.send(answer);
}

exports.getDeals = async (req, res) => {
    answer = await dbGetDealsByAccount(req.query.account, req.query.limit);
    res.send(answer);
}

exports.dealsToHelp = async (req, res) => {
    answer = await dbGetDealsToHelp(req.query.account, req.query.limit);
    res.send(answer);
}

exports.updateDealStatus = async (req, res) => {
    answer = await dbUpdateDealStatus(req.body.id, req.body.status);
    res.send(answer);
}

exports.getDealById = async (req, res) => {
    answer = await dbGetDealsByID(req.body.id);
    res.send(answer);
}

exports.updateTxId = async (req, res) => {
    answer = await setTxId(req.body.id, req.body.txId);
    res.send(answer);
}

exports.updateTxHash = async (req, res) => {
    answer = await setTxHash(req.body.id, req.body.txHash);
    res.send(answer);
}

exports.solveDeal= async (req, res) => {
    answer = await solveDealByAdmin(req.body.dealID, req.body.account, req.body.priory);
    res.send(answer);
}