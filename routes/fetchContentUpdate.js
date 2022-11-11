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
const unitList = ["Wei", "Gwei", "Ether", "USD"];
//TODO: if something wrong send error resp status
//2360

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
    let unitListWithSelect = ["", "", "", ""];
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
        usdSelected: unitListWithSelect[3],
        txid: dbAnswer.txid,
        id: dbAnswer.id,
        fee: dbAnswer.fee,
        status: dbAnswer.status,
        btnName: "Save",
        notEnd: true,
    });
}

async function approveByPartnerView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account;
    let dbAnswer = defaulDeal;
    let showNextButton = false;
    let title = 'Waiting for approved by your partner';
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    if(dbAnswer.status == 0 && 
        ((account.toLowerCase() == dbAnswer.seller && dbAnswer.sellerIsAdmin == 0) || (account.toLowerCase() == dbAnswer.buyer && dbAnswer.sellerIsAdmin == 1))){
        showNextButton = true
        title = 'Waiting for your approve';
    }
    console.log(dbAnswer);
    console.log(showNextButton, account);
    if(dbAnswer.status != 0) dbAnswer = defaulDeal;
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
        change: true,
        btnName: "Approve",
        showNextButton: showNextButton,
        notEnd: true,
        cancelBtn: true,
    });
}

async function changeDealStatus(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account.toLowerCase();
    const newStatus = parseInt(req.query.status);
    let dbAnswer = defaulDeal;
    let title = "default";
    let showNextButton = true;
    let btnName = "";
    let notEnd = true;
    let cancelBtn = true;
    if(id != undefined && id != null && id >= 0){
        const answer = JSON.parse(await dbGetDealsByID(id));
        console.log("answer.list[0].status = ", answer.list[0].status, " newStatus-1 = ", newStatus-1);
        if(answer.code == 0){
            switch(newStatus){
                case 1:
                    title = "Waiting when your partner will send Ethers";
                    btnName = "Send Ethers";
                    if(answer.list[0].status == newStatus-1 && (answer.list[0].sellerIsAdmin == 0 && answer.list[0].seller == account) || (answer.list[0].sellerIsAdmin == 1 && answer.list[0].buyer == account)){
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                            showNextButton = false;
                        }
                    }
                    else {
                        dbAnswer = answer.list[0];
                        title = "Waiting when you will send Ethers";
                        if((answer.list[0].sellerIsAdmin == 0 && answer.list[0].seller == account) || (answer.list[0].sellerIsAdmin == 1 && answer.list[0].buyer == account)){
                            showNextButton = false;
                            title = "Waiting when your partner will send Ethers";
                        }
                    }
                break;
                case 2:
                    title = "Waiting when your partner will send Magic Box";
                    btnName = "Send Magic Box";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                        showNextButton = false;
                    }
                    else {
                        dbAnswer = answer.list[0];
                        title = "Waiting when you will send Magic Box";
                        if(answer.list[0].buyer == account){
                            title = "Waiting when your partner will send Magic Box";
                            showNextButton = false;
                        }
                    }
                break;
                case 3:
                    title = "Waiting when your partner will approve Magic Box";
                    btnName = "Approve Magic Box";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].seller == account){
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                            showNextButton = false;
                        }
                    }
                    else {
                        dbAnswer = answer.list[0];
                        title = "Waiting when you will approve Magic Box";
                        if(answer.list[0].seller == account){
                            showNextButton = false;
                            title = "Waiting when your partner will approve Magic Box";
                        }
                    }
                break;
                case 4:
                    title = "ヾ(⌐■_■)ノ♪";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        const changeDealStatusAnswer = JSON.parse(await dbUpdateDealStatus(id, newStatus)).code;
                        if(changeDealStatusAnswer == 0){
                            dbAnswer = answer.list[0];
                            dbAnswer.status = newStatus;
                        }
                    }
                    else
                        dbAnswer = answer.list[0];
                    showNextButton = false;
                    notEnd = false;
                break;
                default:
                    title = "Something went wrong :(";
                    dbAnswer = answer.list[0];
                    showNextButton = false;
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
        btnName: btnName,
        showNextButton: showNextButton,
        notEnd: notEnd,
        cancelBtn: cancelBtn,
    });
}

module.exports = { 
    changeDealView, 
    approveByPartnerView,
    changeDealStatus
};