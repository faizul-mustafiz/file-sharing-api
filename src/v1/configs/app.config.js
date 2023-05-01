const {
  BASE_API_ROUTE,
  API_PORT,
  API_HOST,
  API_PROTOCOL,
} = require('../environments');

module.exports = {
  version: 'v1',
  baseRoute: BASE_API_ROUTE,
  port: API_PORT,
  host: API_HOST,
  protocol: API_PROTOCOL,
};
