const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const escrowRoutes = require("./routes/escrow.js")
const ethers = require("ethers");

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

app.use(escrowRoutes);


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