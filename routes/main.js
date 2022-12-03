const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, updateDealStatus, updateDeal, getDealById, updateTxId, updateTxHash} = require("../controllers/fetch.js");
const {changeDealView, approveByPartnerView, changeDealStatus} = require("../controllers/view.js");
const { SignIn, preloadProfilePage } = require("../controllers/profile.js");


const router = Router();

router.post("/fetch/createDeal", createDeal);
router.post("/fetch/deleteDeal", deleteDeal);
router.get("/fetch/getDeals", getDeals);
router.post("/fetch/updateDealStatus", updateDealStatus);
router.post("/fetch/updateDeal", updateDeal);
router.post("/fetch/getDealById", getDealById);
router.post("/fetch/updateTxId", updateTxId);
router.post("/fetch/updateTxHash", updateTxHash);

router.get("/view/changeDealView", changeDealView);
router.get("/view/approveByPartner", approveByPartnerView);
router.get("/view/inProgressView", changeDealStatus);

router.post("/profile", SignIn);

router.get('/preloadProfilePage', preloadProfilePage);

exports.router = router;

