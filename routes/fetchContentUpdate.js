const { dbGetDealsByID } = require('../lib/sqlite.js');

async function changeDealView(req, res){
    //TODO: добавить какую-нибудь сделку по умолчанию, если вдруг dealid будет undefind
    const id = req.query.dealid;
    const account = req.query.account;
    let dbAnswer = {
        seller: "0x0", 
        buyer: "0x0", 
        value: 0, 
        unit: 0,
        txid: -1,
        id: -1,
        fee: 0,
    };
    if(id != undefined && id != null && id >= 0)
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];

    let partner = dbAnswer.seller;
    let buyerCheck = "checked";
    let sellerCheck = "";
    if(dbAnswer.seller == account){
        partner = dbAnswer.buyer;
        buyerCheck = "";
        sellerCheck = "checked";
    }
    let unitList = ["", "", ""];
    unitList[dbAnswer.unit] = "selected";
    res.render('partials/createDeal', {
        title: "Change Form",
        buyerCheck: buyerCheck,
        sellerCheck: sellerCheck,
        partner: partner, 
        value: dbAnswer.value, 
        weiSelected: unitList[0],
        gweiSelected: unitList[1],
        etherSelected: unitList[2],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        btnName: "Save",
    });
}

async function approveByPartnerView(req, res){
    const id = req.query.dealid;
    const account = req.query.account;
    let dbAnswer = {
        seller: "0x0", 
        buyer: "0x0", 
        value: 0,
        unit: 0,
        txid: -1,
        id: -1,
        fee: 0,
    };
    if(id != undefined && id != null && id >= 0)
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    const unitList = ["Wei", "Gwei", "Ether"];
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
    });
}

module.exports = { 
    changeDealView, 
    approveByPartnerView 
};