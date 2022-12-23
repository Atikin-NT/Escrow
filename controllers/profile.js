const { 
    getDoneDealsCount, 
    getUserTotalAmount,
    getOpenDealsCount,
    getOpenDealsAmount
} = require("../lib/userinfo.js");
const { ethers } = require('ethers');

/**
 * render page or send BadAddr html
 * @param  {{params: {address: string}}} req request
 * @param  {} res response
 */
exports.pageLoad = async (req, res) => {
    const address = '0x' + req.params.address.toLowerCase();
    if(!ethers.utils.isAddress(address))
        res.status(601).send('<h1>Bad address</h1>');
    else {
        const responses = await Promise.all([
            getDoneDealsCount(address),
            getUserTotalAmount(address),
            getOpenDealsCount(address),
            getOpenDealsAmount(address)
        ])
        res.render('partials/profileMainPage', {
            title: "Статистика",
            layout: "profile",
            done_deals: responses[0],
            user_total_amount: responses[1],
            total_deals_count: responses[2],
            user_now_amount: responses[3]
        });
    }
}