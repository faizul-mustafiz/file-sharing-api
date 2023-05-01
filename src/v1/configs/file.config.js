const {
  PROVIDER,
  CONFIG,
  FORM_DATA_KEY,
  MAX_FILE_SIZE,
} = require('../environments');

module.exports = {
  provider: PROVIDER,
  config: CONFIG,
  formDataKey: FORM_DATA_KEY,
  maxFileSize: MAX_FILE_SIZE,
};
