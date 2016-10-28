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

module.exports = {
  addToRecents,
}
