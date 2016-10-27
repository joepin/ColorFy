const router = require('express').Router();
const watsonService = require('../services/watson');
const recents = require('../models/recents');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/show', recents.addToRecents, watsonService.analyzeText, (req, res) => {
  res.json(res.data);
});

module.exports = router;
