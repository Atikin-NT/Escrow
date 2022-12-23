const { dbInsertData, dbGetDealsByAccount, dbGetDealsByAccountIDDesc, dbGetDealsToHelp, dbDeleteData, dbUpdateDealStatus, dbUpdateData, dbGetDealsByID, setTxId, setTxHash } = require('../lib/sqlite.js');
const { getAdminHelpDeals } = require('../lib/adminInfo.js');

/**
 * @param  {{body: {buyer: string, seller: string, value: float, sellerIsAdmin: boolean, fee: float, feeRole: int}}} req request
 * @param  {} res response
 */
exports.createDeal = async (req, res) => {
    const answer = await dbInsertData(req.body.buyer.toLowerCase(), req.body.seller.toLowerCase(), 
        req.body.value, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

/**
 * @param  {{body: {buyer: string, seller: string, value: float, id: int, sellerIsAdmin: boolean, fee: float, feeRole: int}}} req request
 * @param  {} res response
 */
exports.updateDeal = async (req, res) => {
    const answer = await dbUpdateData(req.body.buyer.toLowerCase(), req.body.seller.toLowerCase(), 
        req.body.value, req.body.id, req.body.sellerIsAdmin,
        req.body.fee, req.body.feeRole);
    res.send(answer);
}

/**
 * @param  {{body: {id: int}}} req request
 * @param  {} res response
 */
exports.deleteDeal = async (req, res) => {
    const answer = await dbDeleteData(req.body.id);
    res.send(answer);
}

/**
 * @param  {{query: {account: string, limit: int}}} req request
 * @param  {} res response
 */
exports.getDeals = async (req, res) => {
    const answer = await dbGetDealsByAccount(req.query.account.toLowerCase(), req.query.limit);
    res.send(answer);
}

/**
 * @param  {{query: {limit: int}}} req request
 * @param  {} res response
 */
exports.getAdminHelpDeals = async (req, res) => {
    const answer = await getAdminHelpDeals(req.query.limit);
    res.send(answer);
}

/**
 * @param  {{query: {account: string, limit: int}}} req request
 * @param  {} res response
 */
exports.getDealsIDDesc = async (req, res) => {
    const answer = await dbGetDealsByAccountIDDesc(req.query.account.toLowerCase(), req.query.limit);
    res.send(answer);
}

/**
 * @param  {{query: {account: string, limit: int}}} req request
 * @param  {} res response
 */
exports.dealsToHelp = async (req, res) => {
    const answer = await dbGetDealsToHelp(req.query.account.toLowerCase(), req.query.limit);
    res.send(answer);
}

/**
 * @param  {{body: {id: int, status: int}}} req request
 * @param  {} res response
 */
exports.updateDealStatus = async (req, res) => {
    const answer = await dbUpdateDealStatus(req.body.id, req.body.status);
    res.send(answer);
}

/**
 * @param  {{query: {id: int}}} req request
 * @param  {} res response
 */
exports.getDealById = async (req, res) => {
    const answer = await dbGetDealsByID(req.query.id);
    res.send(answer);
}

/**
 * @param  {{body: {id: int, txId: string}}} req request
 * @param  {} res response
 */
exports.updateTxId = async (req, res) => {
    const answer = await setTxId(req.body.id, req.body.txId);
    res.send(answer);
}

/**
 * @param  {{body: {id: int, txHash: string}}} req request
 * @param  {} res response
 */
exports.updateTxHash = async (req, res) => {
    const answer = await setTxHash(req.body.id, req.body.txHash);
    res.send(answer);
}