// Watson's module for making requests
const watson = require('watson-developer-cloud');

// Watson API login info
const username = process.env.WATSON_USER;
const password = process.env.WATSON_PASSWORD;

// initialize the analyzer object with required fields
const analyzer = watson.tone_analyzer({
  username: `${username}`,
  password: `${password}`,
  version: 'v3',
  version_date: '2016-05-19'
});

// middleware function that makes an API request to Watson
const analyzeText = (req, res, next) => {
  // user submitted request text is stored in req.body.main
  analyzer.tone({
    text: req.body.main,
  }, (err, tone) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.data = tone;
        next();
      }
  });
}

module.exports = {
  analyzeText,
}
