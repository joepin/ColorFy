const apiRouter = require('express').Router();
const recents = require('../models/recents');
const users = require('../models/user');
const auth = require('../lib/auth');
const functions = require('../lib/functions');

apiRouter.get('/', (req, res) => {
  res.render('api');
})

// test key: W5XU8M4ARN
apiRouter.get('/recents', functions.apiAuth, recents.getAllRecents, (req, res) => {
  res.json(res.allRecents);
});

apiRouter.get('/user/favorites', functions.apiAuth, users.getFavorites, (req, res) => {
  res.json(res.favorites);
});

module.exports = apiRouter;
