const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

const dbConnection = 'mongodb://localhost:27017/colors-project';

function getFavorites(req, res, next) {
  MongoClient.connect(dbConnection, (err, db) => {
    if (err) return next(err);

    const filters = {
      user: req.query.name,
    }

    db.collection('favorites')
      .find(filters)
      .toArray((arrayError, data) => {
        if (arrayError) return next(arrayError);

        // return the data
        res.favorites = data;
        db.close();
        return next();
      });
    return false;
  });
  return false;
}

function saveFavorite(req, res, next) {
  MongoClient.connect(dbConnection, (err, db) => {
    if (err) return next(err);

    const newFavorite = {
      user: req.body.user,
      timestamp: new Date().toUTCString(),
      colors: JSON.parse(req.body.colors),
      requestText: req.body.text,
      watsonResult: JSON.parse(req.body.watson),
    }

    db.collection('favorites')
    .insert(newFavorite, (insertErr, result) => {
      if (insertErr) return next(insertErr);

      res.saved = result;
      db.close();
      return next();
    });
    return false;
  });
  return false;
}

// function deleteFavorite(req, res, next) {
//   MongoClient.connect(dbConnection, (err, db) => {
//     if (err) return next(err);

//     db.collection('favorites')
//       .findAndRemove({ _id: ObjectID(req.params.id) }, (removeErr, doc) => {
//         if (removeErr) return next(removeErr);

//         // return the data
//         res.removed = doc;
//         db.close();
//         return next();
//       });
//     return false;
//   });
//   return false;
// }

module.exports = {
  getFavorites,
  saveFavorite,
}
