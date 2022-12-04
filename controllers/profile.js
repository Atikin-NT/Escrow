const { 
    getDoneDealsCount, 
    getUserTotalAmount,
    getOpenDealsCount,
    getOpenDealsAmount
} = require("../lib/userinfo.js");
const { ethers } = require('ethers');
const { createJsonAnswer } = require('../lib/createJsonAns.js');


exports.preloadProfilePage = async (req, res) => {
    const account = req.query.account.toLowerCase();
    if(!ethers.utils.isAddress(account))
        res.status(601).send(createJsonAnswer(601, 'bad account', [
            {
                done_deals: 0,
                user_total_amount: 0,
                total_deals_count: 0,
                user_now_amount: 0
            }
        ]))
    else 
        res.send(createJsonAnswer(0, "The deal has been inserted", [
            {
                done_deals: await getDoneDealsCount(account),
                user_total_amount: await getUserTotalAmount(account),
                total_deals_count: await getOpenDealsCount(account),
                user_now_amount: await getOpenDealsAmount(account)
            }
        ]))
}