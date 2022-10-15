const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, updateDealStatus, updateDeal} = require("./fetch.js");
const {changeDealView, approveByPartnerView} = require("./fetchContentUpdate.js");

const router = Router();

router.post("/fetch/createDeal", createDeal);
router.delete("/fetch/deleteDeal", deleteDeal);
router.get("/fetch/getDeals", getDeals);
router.post("/fetch/updateDealStatus", updateDealStatus);
router.post("/fetch/updateDeal", updateDeal);

router.get("/view/changeDealView", changeDealView);
router.get("/view/approveByPartner", approveByPartnerView);

exports.router = router;

