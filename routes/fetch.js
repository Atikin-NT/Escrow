const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, getDealsIDDesc, dealsToHelp, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash, getAdminHelpDeals} = require("../controllers/fetch.js");
const { preloadAdminPage } = require("../controllers/admin.js");

const router = Router();

router.post("/fetch/createDeal", createDeal);
router.post("/fetch/deleteDeal", deleteDeal);
router.get("/fetch/getDeals", getDeals);
router.get("/fetch/getDealsIDDesc", getDealsIDDesc);
router.get("/fetch/dealsToHelp", dealsToHelp);
router.post("/fetch/updateDealStatus", updateDealStatus);
router.post("/fetch/updateDeal", updateDeal);
router.get("/fetch/getDealById", getDealById);
router.post("/fetch/updateTxId", updateTxId);
router.post("/fetch/updateTxHash", updateTxHash);
router.get('/fetch/preloadAdminPage', preloadAdminPage);
router.get('/fetch/getAdminHelpDeals', getAdminHelpDeals);


module.exports = router;