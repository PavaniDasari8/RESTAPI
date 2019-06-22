"use strict"
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt-nodejs");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = module.exports = Schema({
  "userName": {
    "type": "string",
    "unique": true
  },
  "email": {
    "type": "string",
    "unique": true
  },
  "firstName": {
    "type": "string",
    "required": true
  },
  "lastName": {
    "type": "string",
    "required": true
  },
  "dateOfBirth": {
    "type": "date",
    "required": true
  },
  "password": {
    "type": "string",
    "required": true
  },
  "skills": {
    "type": "string",
    "required": false
  },
  "country": {
    "type": "string",
    "required": false
  }
});

const fillData = function (obj) {
  return Object.assign({}, {
    "userName": obj.userName,
    "email": obj.email,
    "firstName": obj.firstName,
    "lastName": obj.lastName,
    "dateOfBirth": obj.dateOfBirth,
    "password": obj.password,
    "skills": obj.skills,
    "country": obj.country
  });
}


// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});
/**
 * 
 * Validate Password using Bcrypt compare 
 */
const comparePassword = (candidatePassword, previouspassword, cb) => {
  bcrypt.compare(candidatePassword, previouspassword, (err, isMatch) => {
    cb(err, isMatch);
  });
};

// module.exports = mongoose.model('User', UserSchema);
module.exports = { "model": mongoose.model('User', UserSchema), "fillData": fillData, "comparePassword": comparePassword };