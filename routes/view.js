const { Router } = require("express");
const {changeDealView, approveByPartnerView, changeDealStatus, dealAdminView} = require("../controllers/view.js");

const router = Router();

router.get("/view/changeDealView", changeDealView);
router.get("/view/approveByPartner", approveByPartnerView);
router.get("/view/inProgressView", changeDealStatus);
router.get("/view/dealAdminView", dealAdminView);

module.exports = router;