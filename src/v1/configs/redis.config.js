require('dotenv').config();
const { REDIS_URL } = require('../environments');
module.exports = {
  url: REDIS_URL,
};
