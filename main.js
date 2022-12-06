const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fetchRoutes = require('./routes/fetch.js');
const viewRoutes = require('./routes/view.js');
const profileRoutes = require('./routes/profile.js');
const cookieParser = require('cookie-parser');
const ethers = require('ethers');
const {setTxIdByHash, dbGetDealsByTxID, dbUpdateDealStatus, setArbitrator } = require("./lib/sqlite");
const { DEAL_STATUS } = require("./lib/utils.js")
require("dotenv").config();

const hostname = '127.0.0.1';
const port = 3000;

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
app.use(fetchRoutes);
app.use(viewRoutes);
app.use(profileRoutes);

app.get('/', (req, res) => {
  res.render('partials/inputLayout', {
    title: "Create Form",
    buyerCheck: "checked",
    btnName: "Create",
    discountChecked: "checked",
    partnerRole: "Seller",
  });
});

app.get('/admin', (req, res) => {
  res.render('partials/adminMainPage', {
    title: "Статистика",
    layout: "admin",
  });
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

const { API_URL } = process.env;
let provider = new ethers.providers.JsonRpcProvider(API_URL);
const address = "0x89173A9F2295a208763F8B5b6A8bd1121a0C0e31";
provider.on({
  address: address, 
  topics: [
      ethers.utils.id("Created(address,address,bytes32)")
  ]}, async (log, event) => {
  const txHash = log.transactionHash;
  const buyer = ethers.utils.hexStripZeros(log.topics[1]);
  const seller = ethers.utils.hexStripZeros(log.topics[2]);
  const TxId = log.topics[3];
  await setTxIdByHash(txHash, TxId);
  console.log('Created: ', buyer, seller, TxId)
  await dbUpdateDealStatus(TxId, DEAL_STATUS.CREATE_B);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("BuyerConfim(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('BuyerConfim: ',TxId);
  await dbUpdateDealStatus(TxId, DEAL_STATUS.BUYER_CONF);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("SellerConfim(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('SellerConfim: ',TxId);
  await dbUpdateDealStatus(TxId, DEAL_STATUS.SELLER_CONF);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("Finished(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('Finished: ',TxId);
  const dbDeal = JSON.parse(await dbGetDealsByTxID(TxId));
  if (dbDeal.list.length > 0){
    await dbUpdateDealStatus(TxId, DEAL_STATUS.FINISHED);
  }
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("Conflict(bytes32)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  console.log('Consflict: ',TxId);
})

provider.on({
  address: address,
  topics: [
      ethers.utils.id("ArbitratorAsked(bytes32,address)")
  ]}, async (log, event) => {
  const TxId = log.topics[1];
  const arbitrator = ethers.utils.hexStripZeros(log.topics[2]);
  console.log('ArbitratorAsked: ',TxId);
  await setArbitrator(TxId, arbitrator.toLocaleLowerCase());
})