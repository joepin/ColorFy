/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');
const bcrypt       = require('bcryptjs');

const SALTROUNDS = 10;

// this model is based on the one built by Rafa Pacas

// createUser simply puts the user's info into the database
function createUser(req, res, next) {
  const userObject = {
    username: req.body.username,
    email: req.body.email,

    // Store hashed password
    password: bcrypt.hashSync(req.body.password, SALTROUNDS)
  };

  getDB().then((db) => {
    db.collection('users')
      .insert(userObject, (insertErr, dbUser) => {
        if (insertErr) return next(insertErr);

        res.user = dbUser;
        db.close();
        return next();
      });
  });
}

// my function that simply updates the user's info in the database
// TODO: validate the data before putting it in
function updateUserInfo(req, res, next) {
  const userObject = {
    username: req.body.username,
    email: req.body.email,
  };

  // if the user wants to change their password. Necessary because this field is not automatically populated, as the other two are
  if (req.body.password) {
    // Store hashed password
    userObject.password = bcrypt.hashSync(req.body.password, SALTROUNDS)
  }

  // do the update
  getDB().then((db) => {
    db.collection('users')
    .update({ _id: ObjectID(req.body.id) }, {$set: userObject});
    db.close();
    return next();
  });
}

// this function takes in a user id and returns the user object from the database
function getUserById(id) {
  return getDB().then((db) => {
    const promise = new Promise((resolve, reject) => {
      db.collection('users')
        .findOne({ _id: ObjectID(id) }, (findError, user) => {
          if (findError) reject(findError);
          db.close();
          resolve(user);
        });
    });
    return promise;
  });
}

// this function takes in a username and returns the user object from the database
function getUserByUsername(username) {
  return getDB().then((db) => {
    const promise = new Promise((resolve, reject) => {
      db.collection('users')
        .findOne({ username }, (findError, user) => {
          if (findError) reject(findError);
          db.close();
          resolve(user);
        });
    });
    return promise;
  });
}



// this function gets a user's favorites by querying the favorites database. It gets the user id either by checking
// the req.session object or by checking the query parameters. Query parameters are necessary for the API (for now), since
// we defined the API as a GET method
function getFavorites(req, res, next) {

  if (!req.session.userID && !req.query.id){
    const err = new Error('Please supply a valid user ID');
    // store the error object in the result object
    res.favorites = err;
    next(err);
  }

  getDB().then((db) => {

    // build filter object with the user id
    const filters = {
      userID: { $eq: req.session.userID || req.query.id },
    }
    // find the favorites and return them
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

// this function saves a favorite into the favorites database
function saveFavorite(req, res, next) {
  getDB().then((db) => {

    // build the new favorite object to insert
    const newFavorite = {
      userID: req.session.userID,
      timestamp: new Date().toUTCString(),
      colors: JSON.parse(req.body.colors),
      requestText: req.body.text,
      watsonResult: JSON.parse(req.body.watson),
    }

    // do the insert
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

// deletes a favorite from the database, based on the object's id
function deleteFavorite(req, res, next) {
  getDB().then((db) => {

    db.collection('favorites')
      .findAndRemove({ _id: ObjectID(req.body.id) }, (removeErr, doc) => {
        if (removeErr) return next(removeErr);

        // return the data
        res.removed = doc;
        db.close();
        return next();
      });
    return false;
  });
  return false;
}

module.exports = {
  createUser,
  updateUserInfo,
  getUserById,
  getUserByUsername,
  getFavorites,
  saveFavorite,
  deleteFavorite,
};
