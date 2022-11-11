const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, updateDealStatus, updateDeal, getDealById, updateTxId} = require("./fetch.js");
const {changeDealView, approveByPartnerView, changeDealStatus} = require("./fetchContentUpdate.js");
const { SignIn } = require("./profile.js");


const router = Router();

router.post("/fetch/createDeal", createDeal);
router.post("/fetch/deleteDeal", deleteDeal);
router.get("/fetch/getDeals", getDeals);
router.post("/fetch/updateDealStatus", updateDealStatus);
router.post("/fetch/updateDeal", updateDeal);
router.post("/fetch/getDealById", getDealById);
router.post("/fetch/updateTxId", updateTxId);

router.get("/view/changeDealView", changeDealView);
router.get("/view/approveByPartner", approveByPartnerView);
router.get("/view/inProgressView", changeDealStatus);

router.post("/profile", SignIn);

exports.router = router;

