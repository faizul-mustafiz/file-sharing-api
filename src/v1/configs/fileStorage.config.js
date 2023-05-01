const {
  FOLDER,
  BUCKET_NAME,
  PROVIDER,
  FORM_DATA_KEY,
  MAX_FILE_SIZE,
  MAX_FILES,
} = require('../environments');

module.exports = {
  folder: FOLDER,
  bucketName: BUCKET_NAME,
  provider: PROVIDER,
  formDataKey: FORM_DATA_KEY,
  maxFileSize: MAX_FILE_SIZE,
  maxFiles: MAX_FILES,
};
