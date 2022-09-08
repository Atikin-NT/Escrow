const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const ethers = require("ethers");
const GarantChain = require('./lib/GarantChain');

provider = new ethers.getDefaultProvider("http://localhost:8545");

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

app.post('/login', GarantChain.login);
app.post('/create', GarantChain.create);
app.post('/sendB', GarantChain.sendB);
app.post('/sendS', GarantChain.sendS);
app.post('/cancel', GarantChain.cancel);
app.post('/approve', GarantChain.approve);
app.post('/disapprove', GarantChain.disapprove);
app.post('/withdraw', GarantChain.withdraw);

app.use((req, res) => {
  res.status(404);
  res.render('404 - Error');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});