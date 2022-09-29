const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { ethers } = require("ethers");
const { dbInsertData, dbGetDealsByAccount, dbDeleteData, dbUpdateDealStatus } = require('./lib/sqlite.js');

provider = new ethers.getDefaultProvider("http://localhost:8545");

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


app.get('/', (req, res) => {
  res.render('fetchTest');
});

app.post("/request", (req, res) => {
  res.json([{
     name_recieved: req.body.name,
     designation_recieved: req.body.designation
  }]);
});

app.post("/fetch", (req, res) => {
  res.send({
    name_recieved: req.body.name,
    id_recieved: req.body.id
 });
});

app.post("/fetch/createDeal", async (req, res) => {
  answer = await dbInsertData(req.body.buyer, req.body.seller, req.body.value);
  res.send(answer);
});

app.post("/fetch/deleteDeal", async (req, res) => {
  answer = await dbDeleteData(req.body.id);
  res.send(answer);
});

app.post("/fetch/getDeals", async (req, res) => {
  answer = await dbGetDealsByAccount(req.body.account);
  res.send(answer);
});

app.post("/fetch/updateDealStatus", async (req, res) => {
  answer = await dbUpdateDealStatus(req.body.id, req.body.status);
  res.send(answer);
});

// app.use((req, res) => {
//   res.status(404);
//   res.render('404 - Error');
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});