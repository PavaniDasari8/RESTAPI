'use strict';

let express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }))
//====================================================================
// Setup route middleware to handle common actions
//bodyParser.json({ type: 'text/html' }),
//
router.use((req, res, next) => {
    //res.setHeader('Content-Type', 'application/json');
    next();
});
//
// END route middleware setup
//====================================================================
//====================================================================
// Setup user routes
//
let userRoutes = require('./api/user/userRoutes.js');
router.use('/user', userRoutes);
//
// END user routes setup
//====================================================================

router.get('/healthcheck', (req, res) => res.send("API working!!!"));
//
// END Authenticate routes setup
//====================================================================

module.exports = router;
