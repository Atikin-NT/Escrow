const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, dealsToHelp, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash} = require("../controllers/fetch.js");
const { preloadAdminPage } = require("../controllers/admin.js");

const router = Router();

//=> body { buyer, seller, value, sellerIsAdmin, fee, feeRole }
//<= send(JSON)
router.post("/fetch/createDeal", createDeal);
//=> body { id }
//<= send(JSON)
router.post("/fetch/deleteDeal", deleteDeal);
//=> query { account, limit }
//<= send(JSON)
router.get("/fetch/getDeals", getDeals);
//=> query { account, limit }
//<= send(JSON)
router.get("/fetch/dealsToHelp", dealsToHelp);
//=> body { id, status }
//<= send(JSON)
router.post("/fetch/updateDealStatus", updateDealStatus);
//=> body { buyer, seller, value, id, sellerIsAdmin, fee, feeRole }
//<= send(JSON)
router.post("/fetch/updateDeal", updateDeal);
//=> body { id }
//<= send(JSON)
router.get("/fetch/getDealById", getDealById);
//=> body { id, txId }
//<= send(JSON)
router.post("/fetch/updateTxId", updateTxId);
//=> body { id, txHash }
//<= send(JSON)
router.post("/fetch/updateTxHash", updateTxHash);
//=> query { account }
//<= send(JSON)
router.get('/fetch/preloadAdminPage', preloadAdminPage);

module.exports = router;
