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
const { ESCROW } = require("../lib/utils.js")


/**
 * @param  {{query: {account: string}}} req request
 * @param  {} res response
 */
exports.preloadAdminPage = async (req, res) => {
    const account = req.query.account.toLowerCase();
    let msg = 'not admin';
    let code = 403;
    if(!ethers.utils.isAddress(account)){
        msg = 'bad account';
        code = 601;
    }
    if(!(await isAdmin(account)))
        res.status(code).send(createJsonAnswer(code, msg, [
            {
                dealsDoneCount: 0,
                totalAmount: 0,
                feeTotalAmount: 0,
                dealsCount: 0,
                openAmount: 0,
                adminHelpDealCount: 0,
                needYourHelp: 0,
                sol_amount: 0
            }
        ]))
    else {
        const responses = await Promise.all([
            getDealsDoneCount(), 
            getTotalAmount(), 
            getFeeTotalAmount(), 
            getDealsCount(), 
            getOpenAmount(), 
            getAdminHelpDealCount(), 
            getNeedsYourHelpCount(account), 
            ESCROW.hold()
        ]);
        res.send(createJsonAnswer(0, "The deal has been inserted", [
            {
                dealsDoneCount: responses[0],
                totalAmount: responses[1],
                feeTotalAmount: responses[2],
                dealsCount: responses[3],
                openAmount: responses[4],
                adminHelpDealCount: responses[5],
                needYourHelp: responses[6],
                sol_amount: ethers.utils.formatEther(responses[7])
            }
        ]))
    }
}