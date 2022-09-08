var tx = {
    gasLimit: 3000000,
  };

async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    showAccount.innerHTML = account;
}

exports.create = (req, res) => {
    var tmptx = {
        value: ethers.utils.parseEther("$value"),
        ...tx
    };
    var account = getAccount();
    garantProvider.create(req.query.buyer, req.body.seller, req.body.value, tmptx);
    res.redirect(303, 'metamask');
};

exports.sendB = (req, res) => {
    garantProvider.sendB(req.body.seller, tx);
    res.redirect(303, 'metamask');
};

exports.sendS = (req, res) => {
    garantProvider.sendS(req.body.buyer, tx);
    res.redirect(303, 'metamask');
};

exports.cancel = (req, res) => {
    garantProvider.cancel(req.query.buyer, req.body.seller, tx);
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