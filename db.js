'use strict';

const mongoose = require('mongoose');

// mongoose log quries
mongoose.set('debug', true);

// mongoose connection to db
 mongoose.connect("mongodb://localhost:27017/NodeJS");
 
module.exports = mongoose;