'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DEBUG = true;

require('../modules/api/user/userTest.js');

