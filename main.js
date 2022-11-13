const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const {router} = require('./routes/main.js');
const {openSQLite, closeSQLite} = require('./lib/sqlite.js');
const cookieParser = require('cookie-parser');
const ethers = require('ethers');

openSQLite();

const hostname = '127.0.0.1';
const port = 5000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

app.get('/', (req, res) => {
  res.render('partials/inputLayout', {
    title: "Create Form",
    buyerCheck: "checked",
    btnName: "Create",
    discountChecked: "checked",
  });
});

app.get('/profile', (req, res) => {
  res.render('layouts/profile', {layout : 'profile'});
});

app.post("/request", (req, res) => {
  res.json([{
     name_recieved: req.body.name,
     designation_recieved: req.body.designation
  }]);
});

var server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('SIGINT', () => {
  console.log("SIGINT");
  closeSQLite();
  console.log("db close");
  server.close();
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('uncaughtExceptionMonitor');
  closeSQLite();
  console.log("db close");
});

process.on('uncaughtException', (err, origin) => {
  console.log('uncaughtException');
  console.log(err, origin);
  process.exit(1);
});


let provider = new ethers.providers.JsonRpcProvider();
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //localhost
let escrow = new ethers.Contract(
  address,
  [{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"BuyerConfim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"Conflict","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"Finished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"SellerConfim","type":"event"},{"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"checkUpkeep","outputs":[{"internalType":"bool","name":"upkeepNeeded","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint8","name":"feeStyle","type":"uint8"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"deals","outputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"Bfee","type":"uint256"},{"internalType":"uint8","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"disapprove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"hold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"limit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"performUpkeep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"sendB","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"sendS","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newlimit","type":"uint256"}],"name":"setLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
  provider);

provider.on({
  address: address, 
  topics: [
      ethers.utils.id("Created(address,address,bytes32)")
  ]}, async (log, event) => {
  const buyer = ethers.utils.hexStripZeros(log.topics[1]);
  const seller = ethers.utils.hexStripZeros(log.topics[2]);
  const TxId = log.topics[3];
  console.log('Created: ', buyer, seller, TxId)
  const deal = await escrow.deals(TxId);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("BuyerConfim(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('BuyerConfim: ',TxId);
  const deal = await escrow.deals(TxId);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("SellerConfim(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('SellerConfim: ',TxId);
  const deal = await escrow.deals(TxId);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("Finished(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('Finished: ',TxId);
  const deal = await escrow.deals(TxId);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("Conflict(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('Consflict: ',TxId);
  const deal = await escrow.deals(TxId);
})