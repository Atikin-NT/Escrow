const { 
    getDealsDoneCount, 
    getTotalAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount
} = require("../lib/adminInfo.js");


async function preloadProfilePage(req, res){
    dealsDoneCount = await getDealsDoneCount();
    totalAmount = await getTotalAmount();
    feeTotalAmount = await getFeeTotalAmount();
    dealsCount = await getDealsCount();
    adminHelpDealCount = await getAdminHelpDealCount();
    res.render('partials/adminMainPage', {
        title: "Статистика",
        done_deals: dealsDoneCount,
        total_amount: totalAmount,
        garant_count: adminHelpDealCount,
        total_deals_count: dealsCount,
        fee_total_amount: feeTotalAmount,
      });
}

module.exports = {
    preloadProfilePage
};