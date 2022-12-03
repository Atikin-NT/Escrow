const { 
    isAdmin,
    getDealsDoneCount, 
    getTotalAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount
} = require("../lib/adminInfo.js");
const { ethers } = require('ethers');
// import { escrowProvider } from "../web3/Web3Layer.js";


async function preloadAdminPage(req, res){
    console.log("preloadAdminPage");
    account = req.query.account;
    if(!ethers.utils.isAddress(account)){
        return 0;
    }
    if(isAdmin(account) == 0){
        return res.json({code: 0, error: "not admin"});
    }

    // transaction = await escrowProvider.hold();
    // sol_amount = await transaction.wait();
    sol_amount = 0;
    console.log(sol_amount);
    return res.json({
        dealsDoneCount: await getDealsDoneCount(),
        totalAmount: await getTotalAmount(),
        feeTotalAmount: await getFeeTotalAmount(),
        dealsCount: await getDealsCount(),
        adminHelpDealCount: await getAdminHelpDealCount(),
        sol_amount: sol_amount
    });
}

module.exports = {
    preloadAdminPage
};