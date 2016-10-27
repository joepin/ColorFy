const watson = require('watson-developer-cloud');

const username = process.env.WATSON_USER;
const password = process.env.WATSON_PASSWORD;

const analyzer = watson.tone_analyzer({
  username: `${username}`,
  password: `${password}`,
  version: 'v3',
  version_date: '2016-05-19'
});

const analyzeText = (req, res, next) => {
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
