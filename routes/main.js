const { Router } = require("express");
const {createDeal, deleteDeal, getDeals, updateDealStatus} = require("./fetch.js");

const router = Router();

router.post("/fetch/createDeal", createDeal);

router.post("/fetch/deleteDeal", deleteDeal);

router.post("/fetch/getDeals", getDeals);

router.post("/fetch/updateDealStatus", updateDealStatus);

exports.router = router;

