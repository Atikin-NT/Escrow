const { Router } = require("express");
const {login, create, sendB, sendS, cancel, approve, disapprove, withdraw} = require("../lib/GarantChain");

const router = Router()

router.post('/login', login);
router.post('/create', create);
router.post('/sendB', sendB);
router.post('/sendS', sendS);
router.post('/cancel', cancel);
router.post('/approve', approve);
router.post('/disapprove', disapprove);
router.post('/withdraw', withdraw);

module.exports = router