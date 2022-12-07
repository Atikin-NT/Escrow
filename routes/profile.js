const { Router } = require("express");
const { pageLoad } = require("../controllers/profile.js");

const router = Router();

//=> params { address }
//<= render
router.get("/0x:address", pageLoad);

module.exports = router;