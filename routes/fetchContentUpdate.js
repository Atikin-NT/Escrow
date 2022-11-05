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
    status: -1,
};
const unitList = ["Wei", "Gwei", "Ether"];

async function changeDealView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account;
    let dbAnswer = defaulDeal;
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    if(dbAnswer.status != 0) dbAnswer = defaulDeal;
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
    res.render('partials/inputLayout', {
        layout : 'part',
        title: 'Change Form',
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
    if(dbAnswer.status != 0) dbAnswer = defaulDeal;
    let role = "Buyer";
    if(dbAnswer.seller == account) role = "Seller";
    res.render('partials/textLayout', {
        layout : 'part',
        title: 'Waiting for approved by your partner',
        role: role,
        seller: dbAnswer.seller, 
        buyer: dbAnswer.buyer, 
        value: dbAnswer.value, 
        unit: unitList[dbAnswer.unit],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
        change: true,
        btnName: "Approve",
    });
}

async function changeDealStatus(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account.toUpperCase();
    const newStatus = parseInt(req.query.status);
    let dbAnswer = defaulDeal;
    let title = "default";
    if(id != undefined && id != null && id >= 0){
        const answer = JSON.parse(await dbGetDealsByID(id));
        console.log("answer.list[0].status = ", answer.list[0].status, " newStatus-1 = ", newStatus-1);
        if(answer.code == 0){
            switch(newStatus){
                case 1:
                    title = "Have Been Aproved By Your Partner";
                    if(answer.list[0].status == newStatus-1 && (answer.list[0].sellerIsAdmin == 0 && answer.list[0].seller == account) || (answer.list[0].sellerIsAdmin == 1 && answer.list[0].buyer == account)){
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                    }
                    else dbAnswer = answer.list[0];
                    break;
                case 2:
                    title = "Send Ethers by buyer";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        //IDEA: blockchain send money
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                    }
                    else dbAnswer = answer.list[0];
                break;
                case 3:
                    title = "Send magic box by seller";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].seller == account){
                        //IDEA: blockchain send box
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                    }
                    else dbAnswer = answer.list[0];
                break;
                case 4:
                    title = ":)";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        //IDEA: blockchain approve that box is with buyer
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                    }
                    else dbAnswer = answer.list[0];
                break;
                default:
                    title = "Something went wrong :(";
                    dbAnswer = answer.list[0];
                    break;
            }
        }
    }
    let role = "Buyer";
    if(dbAnswer.seller == account) role = "Seller";
    res.render('partials/textLayout', {
        layout : 'part',
        title: title,
        role: role,
        seller: dbAnswer.seller, 
        buyer: dbAnswer.buyer, 
        value: dbAnswer.value, 
        unit: unitList[dbAnswer.unit],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
        change: false,
        btnName: "Send Money Step",
    });
}

module.exports = { 
    changeDealView, 
    approveByPartnerView,
    changeDealStatus
};