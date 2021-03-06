/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const bcrypt    = require('bcryptjs');
const userModel = require('../models/user');


/**
 * logIn - Middleware to compare password from login form with password
 *         from the user in the DB. If matches, the user Id is stored in the
 *         session.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */
function logIn(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  console.log(username, password, email);

  userModel.getUserByUsername(username).then((dbUser) => {
    if (!dbUser) {
      res.render('home/login', {
        user: null,
        errorMessage: 'That username and password combination does not exist',
      })
    }
    const matches = bcrypt.compareSync(password, dbUser.password);

    if (matches) {
      console.log('matches')
      req.session.userID = dbUser._id;
      req.session.username = dbUser.username;
      res.user = dbUser;
      console.log('before next');
      next();
    } else {
      res.redirect('/');
    }
  });
}


/**
 * authenticate - Middleware to protect routes
 *
 * @param {object} req  request object
 * @param {object} res  response object
 * @param {function} next invoked to continue the response flow
 *
 */
function authenticate(req, res, next) {
  if (req.session.userID) {
    userModel.getUserById(req.session.userID).then((dbUser) => {
      res.user = dbUser;
      next();
    }).catch(() => {
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  logIn,
  authenticate
};
