const express         = require('express');
const logger          = require('morgan');
const path            = require('path');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');
require('dotenv').config();

// get routers
const homeRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const apiRoute = require('./routes/api');

// set up app, declare constants
const app = express();
const port = process.argv[2] || process.env.PORT || 3000;
const SECRET = 'colorsAreCool*1000';

// set up views for use
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware to server static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware to set up logging
app.use(logger('dev'));

// middleware to receive form inputs
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for method override
app.use(methodOverride('_method'));

// middleware to enable session tracking
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SECRET
}));

// routes
app.use('/', homeRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/api', apiRoute);

// LET'S GOOOOOOOOOO!!!!
app.listen(port, () => console.warn(`Listening on port ${port}!`));
