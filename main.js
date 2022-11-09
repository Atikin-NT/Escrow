const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const {router} = require('./routes/main.js');
const {openSQLite, closeSQLite} = require('./lib/sqlite.js');
const cookieParser = require('cookie-parser');

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
    btnName: "Create"
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