const router = require('express').Router();
const watsonService = require('../services/watson');
const recents = require('../models/recents');
const userModel = require('../models/user');
const functions = require('../lib/functions');
const auth = require('../lib/auth');

router.get('/', recents.getAllRecents, recents.getAllWordFrequencies, (req, res) => {
  const userObj = userModel.getUserById(req.session.userID)
  res.render('home/index', {
    user: userObj.username,
    recents: res.allRecents,
    frequencies: res.allFrequencies,
  });
  // res.json(res.session.user);
});

router.get('/search', (req, res) => {
  res.render('home/search');
})

router.post('/show', watsonService.analyzeText, functions.getColors, recents.addToRecents, functions.getWordCount, recents.addToWordFrequency, (req, res) => {
  // res.json(res.data);
  res.render('home/results', {
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

router.get('/test', (req, res) => {
  res.json(req.session);
})

router.get('/login', (req, res) => {
  res.render('home/login');
});

router.get('/signup', (req, res) => {
  res.render('home/signup');
});

module.exports = router;
