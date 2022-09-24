const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const sqlite3 = require('sqlite3').verbose();
// const escrowRoutes = require("./routes/escrow.js")
const { ethers } = require("ethers");
const { dbTest, dbInsertData, dbGetDealsByAccount } = require('./lib/sqlite.js');

provider = new ethers.getDefaultProvider("http://localhost:8545");

const hostname = '127.0.0.1';
const port = 4000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(escrowRoutes);

dbGetDealsByAccount("0x0");


app.get('/', (req, res) => {
  res.render('metamask');
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

// app.use((req, res) => {
//   res.status(404);
//   res.render('404 - Error');
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// DB
/*
1) Пользователь Foreign Key
2) Кому
3) Какое количество
4) Статус сделки




*/