const { dbGetDealsByID, dbUpdateDealStatus, dbUpdateDealStatusById } = require('../lib/sqlite.js');
const ethers = require('ethers');

const defaulDeal = {
    seller: "0x0", 
    buyer: "0x0", 
    value: 0,
    txid: -1,
    id: -1,
    fee: 0,
    status: -1,
};
const feeRoleList = ["Buyer", "50/50", "Seller"];

async function changeDealView(req, res){
    const id = parseInt(req.query.dealid);
    const account = req.query.account.toLowerCase();
    let dbAnswer = defaulDeal;
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
    dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    if(dbAnswer.status != 0) dbAnswer = defaulDeal;
    let partnerRole = "Seller";
    let partner = dbAnswer.seller;
    let buyerCheck = "checked";
    let sellerCheck = "";
    if(dbAnswer.seller == account){
        partner = dbAnswer.buyer;
        buyerCheck = "";
        partnerRole = "Buyer"
        sellerCheck = "checked";
    }
    let unitListWithSelect = ["", ""];
    let feeRoleList = ["", "", ""];
    unitListWithSelect[dbAnswer.unit] = "selected";
    feeRoleList[dbAnswer.feeRole] = "checked";
    res.render('partials/inputLayout', {
        layout : 'part',
        title: 'Change Form',
        buyerCheck: buyerCheck,
        sellerCheck: sellerCheck,
        partner: partner, 
        partnerRole: partnerRole,
        value: dbAnswer.value,
        etherSelected: unitListWithSelect[0],
        usdSelected: unitListWithSelect[1],
        discountChecked: feeRoleList[1],
        buyerFeeChecked: feeRoleList[0],
        sellerFeeChecked: feeRoleList[2],
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
    const account = req.query.account.toLowerCase();
    let dbAnswer = defaulDeal;
    let showNextButton = false;
    let title = 'Waiting for approved by your partner';
    if(id != undefined && id != null && id >= 0 && ethers.utils.isAddress(account))
        dbAnswer = JSON.parse(await dbGetDealsByID(id)).list[0];
    if(dbAnswer.status == 0 && 
        ((account == dbAnswer.seller && dbAnswer.sellerIsAdmin == 0) || (account == dbAnswer.buyer && dbAnswer.sellerIsAdmin == 1))){
        showNextButton = true
        title = 'Waiting for your approve';
    }
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
        feeRole: feeRoleList[dbAnswer.feeRole],
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
        dbAnswer = answer.list[0];
        if(answer.code == 0){
            switch(newStatus){
                case 1:
                    title = "Waiting when your partner will send Ethers";
                    btnName = "Send Ethers";
                    showNextButton = false;
                    if (answer.list[0].buyer == account) {
                        title = "Waiting when you will send Ethers";
                        showNextButton = true;
                    }
                    if (answer.list[0].status == newStatus - 1){
                        dbAnswer.status = newStatus;
                    }
                break;
                case 2:
                    title = "Waiting when your partner will send Magic Box";
                    btnName = "Send Magic Box";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        dbAnswer = answer.list[0];
                        dbAnswer.status = newStatus;
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
                        dbAnswer = answer.list[0];
                        dbAnswer.status = newStatus;
                        showNextButton = false;
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
                    title = "???(??????_???)??????";
                    if(answer.list[0].status == newStatus-1 && answer.list[0].buyer == account){
                        dbAnswer = answer.list[0];
                        dbAnswer.status = newStatus;
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
        feeRole: feeRoleList[dbAnswer.feeRole],
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