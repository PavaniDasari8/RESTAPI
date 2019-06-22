'use strict';

let express = require('express');

const router = express.Router();
let controller = require('./userController.js');
router.get('/',  controller.get);
router.get('/:id',  controller.getbyid);
router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.put('/:id',  controller.put);
router.delete('/:id',  controller.remove);

module.exports = router;