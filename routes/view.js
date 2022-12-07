const { Router } = require("express");
const {changeDealView, approveByPartnerView, changeDealStatus, dealAdminView, dealViewOnly} = require("../controllers/view.js");

const router = Router();

//=> query { dealid, account }
//<= render
router.get("/view/changeDealView", changeDealView);
//=> query { dealid, account }
//<= render
router.get("/view/approveByPartner", approveByPartnerView);
//=> query { dealid, account, status }
//<= render
router.get("/view/inProgressView", changeDealStatus);
//=> query { dealid, account }
//<= render
router.get("/view/dealAdminView", dealAdminView);
//=> query { dealid, account }
//<= render
router.get("/view/dealViewOnly", dealViewOnly);

module.exports = router;