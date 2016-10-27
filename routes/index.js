const router = require('express').Router();
const watsonService = require('../services/watson');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/show', watsonService.analyzeText, (req, res) => {
  res.json(res.data);
});

module.exports = router;
