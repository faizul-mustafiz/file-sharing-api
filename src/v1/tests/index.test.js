/**
 * * During the test we are going to use test environment config
 * * as redis will use test db assigned for our test env variable
 */
process.env.NODE_ENV = 'testing';
const fileTest = require('./file.test');
module.exports = {
  fileTest,
};
