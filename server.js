"use strict";

let express = require('express');
const app = express();
//const path = require('path');
const pjson = require('./package.json');
const session = require('express-session');
const lusca = require('lusca');
const flash = require('express-flash');
process.env.NODE_ENV = 'dev';

//====================================================================
// Setup body parser
// 
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true},
    secret: 'ashdfjhasdlkjfhalksdjhflak', //process.env.SESSION_SECRET,
  }));
  app.use(flash());
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  
  app.use((req, res, next) => {
      // After successful login, redirect back to the intended page
      if (!req.user &&
          req.path !== "/login" &&
          req.path !== "/signup") {
        req.session.returnTo = req.path;
      } else if (req.user &&
          req.path == "/account") {
        req.session.returnTo = req.path;
      }
      next();
    });

//
// END body parser setup
//====================================================================

//====================================================================
// Setup body cors
//
let cors = require('./cors.js');
app.use(cors);
//
// END cors setup
//====================================================================

//====================================================================
// Setup Logger
//
let morgan = require("morgan");
let logger = require("./logger.js");
let config = require('config');
//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan("combined", { "stream": logger.stream }));
}
//
// END Logger setup
//====================================================================
// Setup mongodb through mongoose
// 
let db = require('./db.js').connection;
db.on('error', console.error.bind(console, 'MongoDb connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDb");
});
//
// END mongodb setup
//====================================================================

//====================================================================
// Setup routes
// 
let routes = require('./modules/routes.js');
app.use('/api', routes);
//
// END routes setup
//====================================================================

//====================================================================
// setup error route
// 
let error = require('./error.js');
app.use(error);
//
// END error routes setup
//====================================================================

const listener = app.listen(pjson.server.port, () => {
    console.log('APP running on port ' + listener.address().port);
});

module.exports = app;
