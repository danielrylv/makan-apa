require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginEnforcer = require('./middlewares/loginEnforcer');
const envConfigurator = require('./middlewares/envConfigurator');

const app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}));
app.use('/', envConfigurator);
app.use('/', loginEnforcer);
app.use('/', require('./routes'));
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

module.exports = app;
