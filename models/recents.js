const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

const dbConnection = 'mongodb://localhost:27017/colors-project';

const addToRecents = (req, res, next) => {

  const newRecord = {
    timestamp: new Date().toUTCString(),
    text: req.body.main,
    response: res.data,
    colors: res.colors,
  }
  if (req.user) {
    newRecord.user = req.user;
  }
  MongoClient.connect(dbConnection, (err, db) => {
    if (err) return next(err);

    db.collection('recents')
    .insert(newRecord, (insertErr, result) => {
      if (insertErr) return next(insertErr);

      res.saved = result;
      db.close();
      return next();
    });
    return false;
  });
  return false;
}

module.exports = {
  addToRecents,
}
