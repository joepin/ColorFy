const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();
const port = process.argv[2] || process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.set('view engine', 'ejs');
app.set('views', './views');

// routes
app.get('/', (req, res) => {
  res.render('index');
});


app.listen(port, () => console.warn(`Listening on port ${port}!`));
