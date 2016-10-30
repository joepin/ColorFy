const { getDB } = require('../lib/dbConnect.js');

const addToRecents = (req, res, next) => {

  const newRecord = {
    timestamp: new Date().toUTCString(),
    text: req.body.main,
    response: res.data,
    colors: res.colors,
    userID: req.session.userID,
  }

  getDB().then((db) => {
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

const getAllRecents = (req, res, next) => {
  getDB().then((db) => {
    db.collection('recents')
    .find({}, {}, { limit: 5, })
    .sort({ timestamp:-1 })
    .limit(5)
    .toArray((arrayError, data) => {
      if (arrayError) return next(arrayError);

      // return the data
      res.allRecents = data;
      db.close();
      return next();
    });
    return false;
  });
  return false;
}

const addToWordFrequency = (req, res, next) => {
  const dbFrequency = {};
  const thisUpload = res.textFrequency;

  return getDB().then((db) => {
    const promise = new Promise((resolve, reject) => {
      db.collection('frequency').find().forEach((doc) => {
        for (let key in thisUpload) {
          if (doc[key] && thisUpload[key]) {
            doc[key] += thisUpload[key];
          } else if (thisUpload[key]) {
            doc[key] = thisUpload[key];
          }
        }
        for (let key in doc) {
          dbFrequency[key] = doc[key];
        }
        resolve(dbFrequency);
      });
    }).then(() => {
      res.dbFrequency = dbFrequency;
      db.collection('frequency').update({}, {$set: dbFrequency});
      db.close();
      next();
    });
    return promise;
  });
}

const getAllWordFrequencies = (req, res, next) => {
  getDB().then((db) => {
    db.collection('frequency')
    .findOne({}, (err, data) => {
      if (err) return next(err);

      // return the data
      res.allFrequencies = data;
      db.close();
      return next();
    });
    return false;
  });
  return false;
}

module.exports = {
  addToRecents,
  getAllRecents,
  addToWordFrequency,
  getAllWordFrequencies,
}
