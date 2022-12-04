const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, dealsToHelp, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash, solveDeal} = require("../controllers/fetch.js");
const { preloadAdminPage } = require("../controllers/admin.js");
const { preloadProfilePage } = require("../controllers/profile.js");

const router = Router();

router.post("/fetch/createDeal", createDeal);
router.post("/fetch/deleteDeal", deleteDeal);
router.get("/fetch/getDeals", getDeals);
router.get("/fetch/dealsToHelp", dealsToHelp);
router.post("/fetch/updateDealStatus", updateDealStatus);
router.post("/fetch/updateDeal", updateDeal);
router.post("/fetch/getDealById", getDealById);
router.post("/fetch/updateTxId", updateTxId);
router.post("/fetch/updateTxHash", updateTxHash);
router.get('/fetch/preloadAdminPage', preloadAdminPage);
router.get('/fetch/preloadProfilePage', preloadProfilePage);

router.post("/admin/solveDealByAdmin", solveDeal);

module.exports = router;
