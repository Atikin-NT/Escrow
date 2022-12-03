const { 
    getDealsDoneCount, 
    getTotalAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount
} = require("../lib/adminInfo.js");
const { ethers } = require('ethers');


async function preloadProfilePage(req, res){
    account = req.query.account;
    if(!ethers.utils.isAddress(account)){
        return 0;
    }
    dealsDoneCount = await getDealsDoneCount();
    totalAmount = await getTotalAmount();
    feeTotalAmount = await getFeeTotalAmount();
    dealsCount = await getDealsCount();
    adminHelpDealCount = await getAdminHelpDealCount();
    // res = {
    //     "dealsDoneCount": dealsDoneCount,
    //     "totalAmount": totalAmount,
    //     "feeTotalAmount": feeTotalAmount,
    //     "dealsCount": dealsCount,
    //     "adminHelpDealCount": adminHelpDealCount
    // }
    // return res;
    res.render('partials/adminMainPage', {
        title: "Статистика",
        done_deals: await getDealsDoneCount(),
        total_amount: await getTotalAmount(),
        garant_count: await getAdminHelpDealCount(),
        total_deals_count: await getDealsCount(),
        fee_total_amount: await getFeeTotalAmount(),
        layout: 'profile'
      });
}

module.exports = {
    preloadProfilePage
};