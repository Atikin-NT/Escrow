const { 
    getDoneDealsCount, 
    getUserTotalAmount,
    getOpenDealsCount,
    getOpenDealsAmount
} = require("../lib/userinfo.js");
const { ethers } = require('ethers');

exports.pageLoad = async (req, res) => {
    const address = '0x' + req.params.address.toLowerCase();
    if(!ethers.utils.isAddress(address))
        res.status(601).send('<h1>Bad address</h1>');
    else 
        res.render('partials/profileMainPage', {
            title: "Статистика",
            layout: "profile",
            done_deals: await getDoneDealsCount(address),
            user_total_amount: await getUserTotalAmount(address),
            total_deals_count: await getOpenDealsCount(address),
            user_now_amount: await getOpenDealsAmount(address)
        }); //лучше не бегать много раз, а создать табличку по адресам (до полутора секунд)
}