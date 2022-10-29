const { dbGetDealsByID, dbUpdateDealStatus } = require('../lib/sqlite.js');
const ethers = require('ethers');

const defaulDeal = {
    seller: "0x0", 
    buyer: "0x0", 
    value: 0,
    unit: 0,
    txid: -1,
    id: -1,
    fee: 0,
};
const unitList = ["Wei", "Gwei", "Ether"];

async function changeDealView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account;
    let dbAnswer = defaulDeal;
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];

    let partner = dbAnswer.seller;
    let buyerCheck = "checked";
    let sellerCheck = "";
    if(dbAnswer.seller == account){
        partner = dbAnswer.buyer;
        buyerCheck = "";
        sellerCheck = "checked";
    }
    let unitListWithSelect = ["", "", ""];
    unitListWithSelect[dbAnswer.unit] = "selected";
    res.render('partials/createDeal', {
        title: "Change Form",
        buyerCheck: buyerCheck,
        sellerCheck: sellerCheck,
        partner: partner, 
        value: dbAnswer.value, 
        weiSelected: unitListWithSelect[0],
        gweiSelected: unitListWithSelect[1],
        etherSelected: unitListWithSelect[2],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
        btnName: "Save",
    });
}

async function approveByPartnerView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account;
    let dbAnswer = defaulDeal;
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    let role = "Buyer";
    if(dbAnswer.seller == account) role = "Seller";
    res.render('partials/approveByPartner', {
        role: role,
        seller: dbAnswer.seller, 
        buyer: dbAnswer.buyer, 
        value: dbAnswer.value, 
        unit: unitList[dbAnswer.unit],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
    });
}

async function inProgressView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account;
    let dbAnswer = defaulDeal;
    if(id != undefined && id != null && id >= 0){
        const answer = JSON.parse(await dbGetDealsByID(id));
        if(answer.code == 0 && answer.list[0].buyer == account){
            const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, 1)).code;
            if(changeDealStatusAnswer == 0){
                dbAnswer = answer.list[0];
                dbAnswer.status = 1;
            }
        }
    }
    let role = "Buyer";
    if(dbAnswer.seller == account) role = "Seller";
    res.render('partials/sendSubject', {
        role: role,
        seller: dbAnswer.seller, 
        buyer: dbAnswer.buyer, 
        value: dbAnswer.value, 
        unit: unitList[dbAnswer.unit],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
    });
}

module.exports = { 
    changeDealView, 
    approveByPartnerView,
    inProgressView
};