const router = require('express').Router();
const watsonService = require('../services/watson');
const recents = require('../models/recents');
const userModel = require('../models/user');
const functions = require('../lib/functions');
const auth = require('../lib/auth');

// home page of the app shows all the recent colors and all the word frequencies ever searched
router.get('/', recents.getAllRecents, recents.getAllWordFrequencies, (req, res) => {
  res.render('home/index', {
    user: req.session.username,
    recents: res.allRecents,
    frequencies: res.allFrequencies,
  });
});

// search page is a simple form
router.get('/search', (req, res) => {
  res.render('home/search', {
    user: req.session.username
  });
});

// posting to results first authenticates the user, then calls the Watson API to analyze the text, then converts the result
// into a color, then adds the search to the recents collection in the database, then gets the word frequency count of the
// current search, then adds that frequency count to the global count, then renders the result to the user.
router.post('/results', auth.authenticate, watsonService.analyzeText, functions.getColors, recents.addToRecents, (req, res) => {
  res.render('home/results', {
    user: req.session.username,
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

// simple login form on a view template
router.get('/login', (req, res) => {
  res.render('home/login', {
    user: req.session.username,
    errorMessage: null,
  });
});

// simple sign up form on a view template
router.get('/signup', (req, res) => {
  res.render('home/signup', {
    user: req.session.username,
  });
});

// get requests to recents gets all the recents in the database and displays them to the user, showing just the color
// and no sensitive information
router.get('/recents', recents.getAllRecents, (req, res) => {
  res.render('home/recents', {
    user: req.session.username,
    recents: res.allRecents,
  });
});

module.exports = router;
