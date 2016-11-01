/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const express      = require('express');
const { createUser }    = require('../models/user.js');
const { authenticate }   = require('../lib/auth');
const { logIn }   = require('../lib/auth');
const userModel = require('../models/user');

const router  = express.Router();

// this route is based on the route createed by Rafa Pacas

/**
 * Creates a new user by handling the POST request from a form with action `/users`
 * It uses the createUser middleware from the user model
 */
router.post('/', createUser, logIn, (req, res) => {
  res.render('users/profile', {
    user: req.session.username,
    dbUser: res.user,
    favorites: [],
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
});

// authenticates a user and then gets all their favorites from the database, then renders that
router.get('/favorites', authenticate, userModel.getFavorites, (req, res) => {
  res.render('users/favorites', {
    user: req.session.username,
    favorites: res.favorites,
  });
});

// posting to favorites first authenticates the user, then saves the inputted favorite object to the database
router.post('/favorites', authenticate, userModel.saveFavorite, (req, res) => {
  res.redirect('/users/favorites');
});

// authenticates the user, then removes the inputted favorite from the favorites collection of the database
// note that this does not remove the entry from the recents collection
router.delete('/favorites', authenticate, userModel.deleteFavorite, (req, res) => {
    res.redirect('/users/favorites');
  // res.json(res.removed);
});

// allows a user to update their info in the users collection
router.put('/update', authenticate, userModel.updateUserInfo, (req, res) => {
  res.redirect('/users/profile');
});

module.exports = router;
