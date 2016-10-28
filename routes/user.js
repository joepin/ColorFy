const router = require('express').Router();
const users = require('../models/users');

router.get('/favorites', users.getFavorites, (req, res) => {
  res.json(res.favorites);
});

router.post('/favorites', users.saveFavorite, (req, res) => {
  res.json(res.saved);
});

module.exports = router;
