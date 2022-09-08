const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const garantProvider = require('./lib/GarantProvider.js');
const ethers = require("ethers");

provider = new ethers.getDefaultProvider("http://localhost:8545");

signer1 = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
signer2 = new ethers.Wallet("0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", provider);

garant = new garantProvider(signer1);

const send = async () => {
  const tx = {
    value: ethers.utils.parseEther("1.0"),
    gasLimit: 3000000,
  };

  await garant.createDealByBuyer(signer2.address, tx);
  await garant.getBalance();
};

send();

async function tmp(){
  var balance = await signer1.getBalance();
  console.log("signer1 = " + balance);
  balance = await signer2.getBalance();
  console.log("signer2 = " + balance);
}
tmp();

const app = express();

const hostname = '127.0.0.2';
const port = 3000;

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('metamask');
});

app.use((req, res) => {
  res.status(404);
  res.render('404 - Error');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});