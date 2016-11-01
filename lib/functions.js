/*

  This file is a simple library of utility functions for my app

*/

const { getDB } = require('./dbConnect');

// getColors is called after the Watson API is called, and generates the color based on the return's emotions.
// TODO: make this a much better algorithm. See README for more info
const getColors = (req, res, next) => {
  // store the results in an easy to access variable
  // this tones array is only the emotional tones
  const tones = res.data.document_tone.tone_categories[0].tones;
  // RGB values of the emotions, in order of the emotions in the tones array
  // TODO: make that more clear
  const allColors = [
    [255, 0, 0],
    [128, 0, 128],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255]
  ];

  let rTot = 0;
  let gTot = 0;
  let bTot = 0;
  // loop through emotions and compute each RGB channel
  for (let i = 0; i < tones.length; i++) {
    // each channel is s product of the score (which is a number between 0 and 1, representing percentages)
    // and the current emotion's channel color value
    rTot += (tones[i].score * allColors[i][0]);
    gTot += (tones[i].score * allColors[i][1]);
    bTot += (tones[i].score * allColors[i][2]);
  }

  // return the colors
  res.colors = {
    red: Math.floor(rTot),
    green: Math.floor(gTot),
    blue: Math.floor(bTot),
  }
  next();
}

// getWordCount is called after the user makes a request with text, and it calculates the count of each word in the request
const getWordCount = (req, res, next) => {
  const text = req.body.main;
  // regex and text stripping method received from StackOverflow: http://stackoverflow.com/a/4328722
  const strippedText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  const normalizedText = strippedText.replace(/\s{2,}/g," ");
  const wordsArray = normalizedText.split(' ');
  // till here

  let count = {};
  // loop through the normalized array of words in the request
  for (let i = 0; i < wordsArray.length; i++) {
    // if the current word already exists in the count object
    if (count[wordsArray[i]]) {
      // update its value
      count[wordsArray[i]]++;
    // otherwise if it's not in the count object
    } else {
      // put it there with a count of 1
      count[wordsArray[i]] = 1;
    }
  }

  let countArray = [];
  // loop through the count object
  for (let word in count) {
    // put each count object into an array of arrays - outer array contains all words arrays, inner arrays are all basically
    // key value pairs. This is our version of a set
    countArray.push([word, count[word]])
  }
  // sort the array by ascending count of each word
  countArray.sort((a, b) => {
        return b[1] - a[1];
  });
  // empty the count object
  count = {};
  // loop through the count array and store its KVp pairs into the object
  countArray.forEach((el) => {
    count[el[0]] = el[1];
  });
  // return the count object to the result object
  res.textFrequency = count;
  // oook tank you!!
  next();
}

// apiAuth is a function that checks to see if the requested api key exists in the apiUsers database
const apiAuth = (req, res, next) => {

  const apiKey = req.query.key;

  getDB().then((db) => {
    db.collection('apiUsers')
    .findOne({ key: apiKey }, (err, apiUser) => {
      if (err) next(err);

      res.apiUser = apiUser;
      db.close();
      next();
    });
  });
}

module.exports = {
  getColors,
  getWordCount,
  apiAuth,
}
