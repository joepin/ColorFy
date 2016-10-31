/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const express      = require('express');
const { createUser }    = require('../models/user.js');
const { authenticate }   = require('../lib/auth');
const userModel = require('../models/user');

const router  = express.Router();

/**
 * Creates a new user by handling the POST request from a form with action `/users`
 * It uses the createUser middleware from the user model
 */
router.post('/', createUser, (req, res) => {
  res.redirect('/users/profile', {
    user: req.session.username,
  });
});

/**
 * Takes the user to its profile by handling any GET request to `/users/profile`
 * It redirects to /login when attempted to be reached by a non logged in user
 * It is "protected" by the authenticate middleware from the auth library
 */
router.get('/profile', authenticate, userModel.getFavorites, (req, res) => {
  res.render('users/profile', {
    user: req.session.username,
    dbUser: res.user,
    favorites: res.favorites,
  });
  // res.json(res.user);
});

router.get('/favorites', authenticate, userModel.getFavorites, (req, res) => {
  res.render('users/favorites', {
    user: req.session.username,
    favorites: res.favorites,
  });
  // res.json(res.favorites);
});

router.post('/favorites', userModel.saveFavorite, (req, res) => {
  res.redirect('/users/favorites', {
    user: req.session.username,
  });
  // res.json(res.saved);
});

router.delete('/favorites', authenticate, userModel.deleteFavorite, (req, res) => {
    res.redirect('/users/favorites', {
      user: req.session.username,
    });
  // res.json(res.removed);
});

router.put('/update', userModel.updateUserInfo, (req, res) => {
  res.redirect('/users/profile');
});

module.exports = router;
