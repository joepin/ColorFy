const { getDB } = require('../lib/dbConnect.js');

// addToRecents takes in a request/response object and stores it in the recents collection, along with the requesting
// user's ID. It also stores the current time of the request so we can later filter by time
const addToRecents = (req, res, next) => {

  // build the new record object
  const newRecord = {
    timestamp: new Date().toUTCString(),
    text: req.body.main,
    response: res.data,
    colors: res.colors,
    userID: req.session.userID,
  }

  // insert it into the recents collection of the database and save the response from mongo in res.saved, in case
  // we want to analyze that later
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

// getAllRecents simply queries the database for the five most recent searches, and sorts them by most recent first
// TODO: make this more versatile, allowing us to search for either all recents or provide a limit and limit by that,
// as opposed to a hardcoded limit of 5 results
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

// addToWordFrequency queries the frequency collection of the database, which, by design, only contains one gigantic
// document of all the words ever searched along with their count. The function then adds the current search's word
// frequency to the document, updating the count of existing words and inserting new ones if they don't already exist
const addToWordFrequency = (req, res, next) => {
  const dbFrequency = {};
  // the current search's word frequency object
  const thisUpload = res.textFrequency;

  return getDB().then((db) => {
    // set up promise object to force us into blocking execution until we have our result
    const promise = new Promise((resolve, reject) => {
      db.collection('frequency').find().forEach((doc) => {
        // loop through words in the current search's frequency object
        for (let key in thisUpload) {
          // if the word is less than four letters, we don't want it. This is a simple way of removing common words like
          // the, if, and, or - aka things that don't provide emootion
          if (key.length > 3) {
            // if the current word exists in both the database and the current object
            if (doc[key] && thisUpload[key]) {
              // update the database's count with the current object's count
              doc[key] += thisUpload[key];
              // otherwise, if the key exists in the current object but not the databse
            } else if (thisUpload[key]) {
              // set the database's key value to the current object's
              doc[key] = thisUpload[key];
            }
          }
        }
        // build a new return object with all the updated keys and values
        for (let key in doc) {
          dbFrequency[key] = doc[key];
        }
        // end the promise
        resolve(dbFrequency);
      });
    }).then(() => {
      // return that to the controller in case we want it later
      res.dbFrequency = dbFrequency;
      // update the frequency collection's sole object with the new return object
      db.collection('frequency').update({}, {$set: dbFrequency});
      db.close();
      // next!!!
      next();
    });
    return promise;
  });
}

// getAllWordFrequencies queries the frequency collection od the database for its one object and returns that to the controller
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
