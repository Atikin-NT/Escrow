const { 
    isAdmin,
    getDealsDoneCount, 
    getTotalAmount,
    getOpenAmount,
    getFeeTotalAmount,
    getDealsCount,
    getAdminHelpDealCount,
    getNeedsYourHelpCount
} = require("../lib/adminInfo.js");
const { ethers } = require('ethers');
const { createJsonAnswer } = require('../lib/createJsonAns.js');


async function preloadAdminPage(req, res){
    const account = req.query.account.toLowerCase();
    let msg = 'not admin';
    let code = 403;
    if(!ethers.utils.isAddress(account)){
        msg = 'bad account';
        code = 601;
    }
    if((await isAdmin(account)) == 0)
        res.status(code).send(createJsonAnswer(code, msg, [
            {
                dealsDoneCount: 0,
                totalAmount: 0,
                feeTotalAmount: 0,
                dealsCount: 0,
                openAmount: 0,
                adminHelpDealCount: 0,
                sol_amount: 0
            }
        ]))
    else 
        res.send(createJsonAnswer(0, "The deal has been inserted", [
            {
                dealsDoneCount: await getDealsDoneCount(),
                totalAmount: await getTotalAmount(),
                feeTotalAmount: await getFeeTotalAmount(),
                dealsCount: await getDealsCount(),
                openAmount: await getOpenAmount(),
                adminHelpDealCount: await getAdminHelpDealCount(),
                sol_amount: 0
            }
        ]))
}

module.exports = {
    preloadAdminPage
};