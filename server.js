const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const homeRoute = require('./routes/index');

const app = express();
const port = process.argv[2] || process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// middleware to receive form inputs
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for method override
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', './views');

// routes
app.use('/', homeRoute);

app.listen(port, () => console.warn(`Listening on port ${port}!`));
