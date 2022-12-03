const { 
    getDealsDoneCount, 
    getTotalAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount
} = require("../lib/adminInfo.js");


async function preloadProfilePage(req, res){
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