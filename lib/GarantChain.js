const escrowProvider = require('./GarantProvider.js');
const ethers = require("ethers");

let tx = {
    gasLimit: 3000000,
};
let escrow;
const provider = new ethers.getDefaultProvider("http://localhost:8545");

exports.login = (req, res) => {
    signer1 = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    escrow = new escrowProvider(signer1);
    res.redirect(303, '/');
};

exports.create = (req, res) => {
    escrow.create(req.body.buyer, req.body.seller, req.body.value, tx);
    res.redirect(303, '/');
};

exports.sendB = (req, res) => {
    const tmptx = {
        value: ethers.utils.parseEther(`${req.body.value}`),
        ...tx
    };
    escrow.sendB(req.body.seller, tmptx);
    res.redirect(303, '/');
};

exports.sendS = (req, res) => {
    escrow.sendS(req.body.buyer, tx);
    res.redirect(303, '/');
};

exports.cancel = (req, res) => {
    escrow.cancel(req.body.buyer, req.body.seller, tx);
    res.redirect(303, '/');
};

exports.approve = (req, res) => {
    escrow.approve(req.body.seller, tx);
    res.redirect(303, '/');
};

exports.disapprove = (req, res) => {
    escrow.disapprove(req.body.seller, tx);
    res.redirect(303, '/');
};

exports.withdraw = (req, res) => {
    escrow.withdraw(tx);
    res.redirect(303, '/');
};