/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');
const bcrypt       = require('bcryptjs');

const SALTROUNDS = 10;

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

function updateUserInfo(req, res, next) {
  const userObject = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.password) {
    // Store hashed password
    userObject.password = bcrypt.hashSync(req.body.password, SALTROUNDS)
  }

  getDB().then((db) => {
    db.collection('users')
    .update({ _id: ObjectID(req.body.id) }, {$set: userObject});
    db.close();
    return next();
  });
}

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



function getFavorites(req, res, next) {

  if (!req.session.userID && !req.query.id){
    const err = new Error('Please supply a valid user ID');
    res.favorites = err;
    next(err);
  }

  getDB().then((db) => {

    const filters = {
      userID: { $eq: req.session.userID || req.query.id },
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
  getDB().then((db) => {

    const newFavorite = {
      userID: req.session.userID,
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
