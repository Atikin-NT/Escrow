const { Router } = require("express");
const GarantChain = require("../lib/GarantChain");

const router = Router()

router.post('/login', GarantChain.login);
router.post('/create', GarantChain.create);
router.post('/sendB', GarantChain.sendB);
router.post('/sendS', GarantChain.sendS);
router.post('/cancel', GarantChain.cancel);
router.post('/approve', GarantChain.approve);
router.post('/disapprove', GarantChain.disapprove);
router.post('/withdraw', GarantChain.withdraw);

module.exports = router