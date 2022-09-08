const garantProvider = require('./GarantProvider.js');

let tx = {
    gasLimit: 3000000,
  };
  let garant;

exports.login = (req, res) => {
    garant = new garantProvider(req.body.account);
    res.redirect(303, 'metamask');
};

exports.create = (req, res) => {
    garantProvider.create(req.body.buyer, req.body.seller, req.body.value, tx);
    res.redirect(303, 'metamask');
};

exports.sendB = (req, res) => {
    const tmptx = {
        value: ethers.utils.parseEther("$value"),
        ...tx
    };
    garantProvider.sendB(req.body.seller, tmptx);
    res.redirect(303, 'metamask');
};

exports.sendS = (req, res) => {
    garantProvider.sendS(req.body.buyer, tx);
    res.redirect(303, 'metamask');
};

exports.cancel = (req, res) => {
    garantProvider.cancel(req.body.buyer, req.body.seller, tx);
    res.redirect(303, 'metamask');
};

exports.approve = (req, res) => {
    garantProvider.approve(req.body.seller, tx);
    res.redirect(303, 'metamask');
};

exports.disapprove = (req, res) => {
    garantProvider.disapprove(req.body.seller, tx);
    res.redirect(303, 'metamask');
};

exports.withdraw = (req, res) => {
    garantProvider.withdraw(tx);
    res.redirect(303, 'metamask');
};