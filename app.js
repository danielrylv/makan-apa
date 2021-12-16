const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))
app.use('/', require('./routes'));
app.use((err, req, res, next) => {
  console.log(err);
  res.send(err);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
