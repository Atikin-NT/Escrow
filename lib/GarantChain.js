const escrowProvider = require('./GarantProvider.js');

let tx = {
    gasLimit: 3000000,
};
let garant;

exports.login = (req, res) => {
    garant = new EscrowProvider(req.body.account);
    res.redirect(303, '/');
};

exports.create = (req, res) => {
    escrowProvider.create(req.body.buyer, req.body.seller, req.body.value, tx);
    res.redirect(303, '/');
};

exports.sendB = (req, res) => {
    const tmptx = {
        value: ethers.utils.parseEther(`${req.body.value}`),
        ...tx
    };
    escrowProvider.sendB(req.body.seller, tmptx);
    res.redirect(303, '/');
};

exports.sendS = (req, res) => {
    escrowProvider.sendS(req.body.buyer, tx);
    res.redirect(303, '/');
};

exports.cancel = (req, res) => {
    escrowProvider.cancel(req.body.buyer, req.body.seller, tx);
    res.redirect(303, '/');
};

exports.approve = (req, res) => {
    escrowProvider.approve(req.body.seller, tx);
    res.redirect(303, '/');
};

exports.disapprove = (req, res) => {
    escrowProvider.disapprove(req.body.seller, tx);
    res.redirect(303, '/');
};

exports.withdraw = (req, res) => {
    escrowProvider.withdraw(tx);
    res.redirect(303, '/');
};