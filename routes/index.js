const router = require('express').Router();
const watsonService = require('../services/watson');
const recents = require('../models/recents');
const functions = require('../lib/functions');

router.get('/', (req, res) => {
  res.render('home/index');
});

router.post('/show', watsonService.analyzeText, functions.getColors, recents.addToRecents, (req, res) => {
  // res.json(res.data);
  res.render('test', {
    colors: JSON.stringify(res.colors),
    text: req.body.main,
    response: JSON.stringify(res.data),
    red: res.colors.red,
    green: res.colors.green,
    blue: res.colors.blue,
    tones0: res.data.document_tone.tone_categories[0].tones,
    tones1: res.data.document_tone.tone_categories[1].tones,
    tones2: res.data.document_tone.tone_categories[2].tones,
  });
});

router.get('/login', (req, res) => {
  res.render('home/login');
});

router.get('/signup', (req, res) => {
  res.render('home/signup');
});

module.exports = router;
