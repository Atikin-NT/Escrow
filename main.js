const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const ethers = require("ethers");
const escrowRoutes = require("./routes/escrow.js")

provider = new ethers.getDefaultProvider("http://localhost:8545");

const app = express();

const hostname = '127.0.0.1';
const port = 4000;

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(escrowRoutes);

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