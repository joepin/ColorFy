const router = require('express').Router();
const users = require('../models/users');

router.get('/favorites', users.getFavorites, (req, res) => {
  res.render('favorites', {
    user: req.query.name,
    favorites: res.favorites,
  });
  // res.json(res.favorites);
});

router.post('/favorites', users.saveFavorite, (req, res) => {
  res.json(res.saved);
});

router.delete('/favorites', users.deleteFavorite, (req, res) => {
  res.json(res.removed);
});

// router.delete('/favorites', (req, res) => {
//   res.json(req.body);
// });

module.exports = router;
