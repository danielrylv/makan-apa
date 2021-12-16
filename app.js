const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes'));
app.use((err, req, res, next) => {
  console.log(err);
  res.send(err);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
