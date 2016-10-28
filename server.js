const express         = require('express');
const logger          = require('morgan');
const path            = require('path');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');

require('dotenv').config();

const homeRoute = require('./routes/index');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');

const app = express();
const port = process.argv[2] || process.env.PORT || 3000;
const SECRET = 'colorsAreCool*1000';

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// middleware to receive form inputs
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for method override
app.use(methodOverride('_method'));

app.use(cookieParser());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SECRET
}));

// routes
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);

app.listen(port, () => console.warn(`Listening on port ${port}!`));
