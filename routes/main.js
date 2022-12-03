const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, dealsToHelp, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash} = require("../controllers/fetch.js");
const {changeDealView, approveByPartnerView, changeDealStatus, dealAdminView} = require("../controllers/view.js");
const { preloadAdminPage } = require("../controllers/admin.js");


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

router.get("/view/changeDealView", changeDealView);
router.get("/view/approveByPartner", approveByPartnerView);
router.get("/view/inProgressView", changeDealStatus);
router.get("/view/dealAdminView", dealAdminView);

router.get('/fetch/preloadAdminPage', preloadAdminPage);

exports.router = router;

