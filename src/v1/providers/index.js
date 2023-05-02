const { provider } = require('../configs/file.config');
module.exports = require(`../providers/${provider}.storage.provider`);
