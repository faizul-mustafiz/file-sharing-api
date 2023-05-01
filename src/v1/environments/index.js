const environment = process.env.NODE_ENV || 'development';
module.exports = require(`../environments/environment.${environment}.js`);
