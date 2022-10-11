const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const {router} = require('./routes/main.js');

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
app.use('/', router);

app.get('/', (req, res) => {
  res.render('./layouts/main');
});

app.get('/profile', (req, res) => {
  res.render('main', {layout : 'profile'});
});

app.post("/request", (req, res) => {
  res.json([{
     name_recieved: req.body.name,
     designation_recieved: req.body.designation
  }]);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});